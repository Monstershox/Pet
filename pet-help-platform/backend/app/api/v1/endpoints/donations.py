from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
import uuid

from app.core.database import get_db
from app.models import Donation, Animal, User
from app.models.donation import DonationStatus
from app.schemas import Donation as DonationSchema, DonationCreate
from app.api.v1.endpoints.auth import get_current_user

router = APIRouter()

@router.post("/", response_model=DonationSchema)
def create_donation(
    donation_data: DonationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if donation_data.animal_id:
        animal = db.query(Animal).filter(Animal.id == donation_data.animal_id).first()
        if not animal:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Animal not found"
            )

    transaction_id = f"TXN-{uuid.uuid4()}"

    new_donation = Donation(
        user_id=current_user.id,
        animal_id=donation_data.animal_id,
        amount=donation_data.amount,
        currency=donation_data.currency,
        payment_method=donation_data.payment_method,
        purpose=donation_data.purpose,
        notes=donation_data.notes,
        transaction_id=transaction_id,
        status=DonationStatus.PENDING
    )

    db.add(new_donation)
    db.commit()
    db.refresh(new_donation)

    return new_donation

@router.get("/", response_model=List[DonationSchema])
def get_donations(
    skip: int = 0,
    limit: int = 100,
    status: Optional[DonationStatus] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view all donations"
        )

    query = db.query(Donation)
    if status:
        query = query.filter(Donation.status == status)

    donations = query.offset(skip).limit(limit).all()
    return donations

@router.get("/my", response_model=List[DonationSchema])
def get_my_donations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    donations = db.query(Donation).filter(
        Donation.user_id == current_user.id
    ).order_by(Donation.created_at.desc()).all()
    return donations

@router.get("/{donation_id}", response_model=DonationSchema)
def get_donation(
    donation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    donation = db.query(Donation).filter(Donation.id == donation_id).first()
    if not donation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Donation not found"
        )

    if donation.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this donation"
        )

    return donation

@router.put("/{donation_id}/complete", response_model=DonationSchema)
def complete_donation(
    donation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    donation = db.query(Donation).filter(Donation.id == donation_id).first()
    if not donation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Donation not found"
        )

    if donation.status != DonationStatus.PENDING:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Donation is not in pending status"
        )

    donation.status = DonationStatus.COMPLETED
    donation.completed_at = datetime.utcnow()

    donor = db.query(User).filter(User.id == donation.user_id).first()
    donor.points += int(donation.amount * 10)

    db.commit()
    db.refresh(donation)
    return donation

@router.get("/animal/{animal_id}", response_model=List[DonationSchema])
def get_animal_donations(
    animal_id: int,
    db: Session = Depends(get_db)
):
    animal = db.query(Animal).filter(Animal.id == animal_id).first()
    if not animal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Animal not found"
        )

    donations = db.query(Donation).filter(
        Donation.animal_id == animal_id,
        Donation.status == DonationStatus.COMPLETED
    ).all()
    return donations