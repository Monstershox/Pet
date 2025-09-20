from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.models import Animal, AnimalPhoto, User, Swipe
from app.models.animal import AnimalType, AnimalStatus, AnimalSize
from app.schemas import Animal as AnimalSchema, AnimalCreate, AnimalUpdate
from app.api.v1.endpoints.auth import get_current_user

router = APIRouter()

@router.post("/", response_model=AnimalSchema)
def create_animal(
    animal_data: AnimalCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_animal = Animal(
        **animal_data.dict(),
        owner_id=current_user.id
    )

    db.add(new_animal)
    db.commit()
    db.refresh(new_animal)
    return new_animal

@router.get("/", response_model=List[AnimalSchema])
def get_animals(
    skip: int = 0,
    limit: int = 100,
    animal_type: Optional[AnimalType] = None,
    status: Optional[AnimalStatus] = None,
    size: Optional[AnimalSize] = None,
    location: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Animal)

    if animal_type:
        query = query.filter(Animal.type == animal_type)
    if status:
        query = query.filter(Animal.status == status)
    if size:
        query = query.filter(Animal.size == size)
    if location:
        query = query.filter(Animal.location.ilike(f"%{location}%"))

    animals = query.offset(skip).limit(limit).all()
    return animals

@router.get("/feed", response_model=List[AnimalSchema])
def get_animal_feed(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    limit: int = 10
):
    swiped_animal_ids = db.query(Swipe.animal_id).filter(
        Swipe.user_id == current_user.id
    ).subquery()

    animals = db.query(Animal).filter(
        Animal.status.in_([AnimalStatus.AVAILABLE, AnimalStatus.IN_SHELTER]),
        Animal.id.notin_(swiped_animal_ids),
        Animal.owner_id != current_user.id
    ).limit(limit).all()

    return animals

@router.get("/{animal_id}", response_model=AnimalSchema)
def get_animal(animal_id: int, db: Session = Depends(get_db)):
    animal = db.query(Animal).filter(Animal.id == animal_id).first()
    if not animal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Animal not found"
        )
    return animal

@router.put("/{animal_id}", response_model=AnimalSchema)
def update_animal(
    animal_id: int,
    animal_update: AnimalUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    animal = db.query(Animal).filter(Animal.id == animal_id).first()
    if not animal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Animal not found"
        )

    if animal.owner_id != current_user.id and current_user.role not in ["admin", "shelter_admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this animal"
        )

    for key, value in animal_update.dict(exclude_unset=True).items():
        setattr(animal, key, value)

    db.commit()
    db.refresh(animal)
    return animal

@router.delete("/{animal_id}")
def delete_animal(
    animal_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    animal = db.query(Animal).filter(Animal.id == animal_id).first()
    if not animal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Animal not found"
        )

    if animal.owner_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this animal"
        )

    db.delete(animal)
    db.commit()
    return {"message": "Animal deleted successfully"}

@router.get("/my/animals", response_model=List[AnimalSchema])
def get_my_animals(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    animals = db.query(Animal).filter(Animal.owner_id == current_user.id).all()
    return animals