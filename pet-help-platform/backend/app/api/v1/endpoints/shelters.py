from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.core.database import get_db
from app.models import Shelter, ShelterRequest, User, Animal
from app.models.shelter import RequestStatus
from app.schemas import (
    Shelter as ShelterSchema,
    ShelterCreate,
    ShelterUpdate,
    ShelterRequest as ShelterRequestSchema,
    ShelterRequestCreate
)
from app.api.v1.endpoints.auth import get_current_user

router = APIRouter()

@router.post("/", response_model=ShelterSchema)
def create_shelter(
    shelter_data: ShelterCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in ["admin", "shelter_admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to create shelters"
        )

    existing = db.query(Shelter).filter(Shelter.email == shelter_data.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Shelter with this email already exists"
        )

    new_shelter = Shelter(**shelter_data.dict())
    db.add(new_shelter)
    db.commit()
    db.refresh(new_shelter)
    return new_shelter

@router.get("/", response_model=List[ShelterSchema])
def get_shelters(
    skip: int = 0,
    limit: int = 100,
    city: Optional[str] = None,
    is_active: bool = True,
    db: Session = Depends(get_db)
):
    query = db.query(Shelter).filter(Shelter.is_active == is_active)

    if city:
        query = query.filter(Shelter.city.ilike(f"%{city}%"))

    shelters = query.offset(skip).limit(limit).all()
    return shelters

@router.get("/{shelter_id}", response_model=ShelterSchema)
def get_shelter(shelter_id: int, db: Session = Depends(get_db)):
    shelter = db.query(Shelter).filter(Shelter.id == shelter_id).first()
    if not shelter:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Shelter not found"
        )
    return shelter

@router.put("/{shelter_id}", response_model=ShelterSchema)
def update_shelter(
    shelter_id: int,
    shelter_update: ShelterUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in ["admin", "shelter_admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update shelters"
        )

    shelter = db.query(Shelter).filter(Shelter.id == shelter_id).first()
    if not shelter:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Shelter not found"
        )

    for key, value in shelter_update.dict(exclude_unset=True).items():
        setattr(shelter, key, value)

    db.commit()
    db.refresh(shelter)
    return shelter

@router.post("/requests", response_model=ShelterRequestSchema)
def create_shelter_request(
    request_data: ShelterRequestCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    shelter = db.query(Shelter).filter(Shelter.id == request_data.shelter_id).first()
    if not shelter:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Shelter not found"
        )

    animal = db.query(Animal).filter(Animal.id == request_data.animal_id).first()
    if not animal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Animal not found"
        )

    new_request = ShelterRequest(
        shelter_id=request_data.shelter_id,
        animal_id=request_data.animal_id,
        reporter_id=current_user.id,
        notes=request_data.notes,
        priority=request_data.priority
    )

    db.add(new_request)
    db.commit()
    db.refresh(new_request)
    return new_request

@router.get("/requests/my", response_model=List[ShelterRequestSchema])
def get_my_shelter_requests(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    requests = db.query(ShelterRequest).filter(
        ShelterRequest.reporter_id == current_user.id
    ).all()
    return requests

@router.put("/requests/{request_id}/status")
def update_request_status(
    request_id: int,
    status: RequestStatus,
    response_notes: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in ["admin", "shelter_admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update request status"
        )

    request = db.query(ShelterRequest).filter(ShelterRequest.id == request_id).first()
    if not request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Request not found"
        )

    request.status = status
    if response_notes:
        request.response_notes = response_notes

    if status in [RequestStatus.ACCEPTED, RequestStatus.IN_PROGRESS]:
        request.responded_at = datetime.utcnow()
    elif status == RequestStatus.COMPLETED:
        request.completed_at = datetime.utcnow()

    db.commit()
    return {"message": f"Request status updated to {status}"}