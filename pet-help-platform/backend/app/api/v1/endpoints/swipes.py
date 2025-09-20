from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models import Swipe, Animal, User
from app.models.swipe import SwipeDirection
from app.schemas import Swipe as SwipeSchema, SwipeCreate
from app.api.v1.endpoints.auth import get_current_user

router = APIRouter()

@router.post("/", response_model=SwipeSchema)
def create_swipe(
    swipe_data: SwipeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    animal = db.query(Animal).filter(Animal.id == swipe_data.animal_id).first()
    if not animal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Animal not found"
        )

    existing_swipe = db.query(Swipe).filter(
        Swipe.user_id == current_user.id,
        Swipe.animal_id == swipe_data.animal_id
    ).first()

    if existing_swipe:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Already swiped on this animal"
        )

    is_match = swipe_data.direction in [SwipeDirection.RIGHT, SwipeDirection.SUPER_LIKE]

    new_swipe = Swipe(
        user_id=current_user.id,
        animal_id=swipe_data.animal_id,
        direction=swipe_data.direction,
        is_match=is_match
    )

    db.add(new_swipe)

    if is_match:
        current_user.points += 5

    db.commit()
    db.refresh(new_swipe)
    return new_swipe

@router.get("/matches", response_model=List[SwipeSchema])
def get_matches(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    matches = db.query(Swipe).filter(
        Swipe.user_id == current_user.id,
        Swipe.is_match == True
    ).all()
    return matches

@router.get("/history", response_model=List[SwipeSchema])
def get_swipe_history(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    swipes = db.query(Swipe).filter(
        Swipe.user_id == current_user.id
    ).order_by(Swipe.created_at.desc()).offset(skip).limit(limit).all()
    return swipes

@router.delete("/{swipe_id}")
def delete_swipe(
    swipe_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    swipe = db.query(Swipe).filter(
        Swipe.id == swipe_id,
        Swipe.user_id == current_user.id
    ).first()

    if not swipe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Swipe not found"
        )

    db.delete(swipe)
    db.commit()
    return {"message": "Swipe deleted successfully"}