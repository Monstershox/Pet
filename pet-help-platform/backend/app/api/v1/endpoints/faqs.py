from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.models import FAQ, User
from app.schemas import FAQ as FAQSchema, FAQCreate, FAQUpdate
from app.api.v1.endpoints.auth import get_current_user

router = APIRouter()

@router.post("/", response_model=FAQSchema)
def create_faq(
    faq_data: FAQCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in ["admin", "vet"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to create FAQs"
        )

    new_faq = FAQ(**faq_data.dict())
    db.add(new_faq)
    db.commit()
    db.refresh(new_faq)
    return new_faq

@router.get("/", response_model=List[FAQSchema])
def get_faqs(
    skip: int = 0,
    limit: int = 100,
    category: Optional[str] = None,
    is_active: bool = True,
    db: Session = Depends(get_db)
):
    query = db.query(FAQ).filter(FAQ.is_active == is_active)

    if category:
        query = query.filter(FAQ.category == category)

    faqs = query.offset(skip).limit(limit).all()
    return faqs

@router.get("/search", response_model=List[FAQSchema])
def search_faqs(
    q: str,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    search_term = f"%{q}%"
    faqs = db.query(FAQ).filter(
        FAQ.is_active == True,
        (FAQ.question.ilike(search_term) | FAQ.answer.ilike(search_term))
    ).limit(limit).all()
    return faqs

@router.get("/categories")
def get_faq_categories(db: Session = Depends(get_db)):
    categories = db.query(FAQ.category).distinct().filter(
        FAQ.category.isnot(None),
        FAQ.is_active == True
    ).all()
    return [cat[0] for cat in categories if cat[0]]

@router.get("/{faq_id}", response_model=FAQSchema)
def get_faq(faq_id: int, db: Session = Depends(get_db)):
    faq = db.query(FAQ).filter(FAQ.id == faq_id).first()
    if not faq:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="FAQ not found"
        )

    faq.views += 1
    db.commit()
    db.refresh(faq)
    return faq

@router.put("/{faq_id}", response_model=FAQSchema)
def update_faq(
    faq_id: int,
    faq_update: FAQUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in ["admin", "vet"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update FAQs"
        )

    faq = db.query(FAQ).filter(FAQ.id == faq_id).first()
    if not faq:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="FAQ not found"
        )

    for key, value in faq_update.dict(exclude_unset=True).items():
        setattr(faq, key, value)

    db.commit()
    db.refresh(faq)
    return faq

@router.post("/{faq_id}/helpful")
def mark_faq_helpful(
    faq_id: int,
    db: Session = Depends(get_db)
):
    faq = db.query(FAQ).filter(FAQ.id == faq_id).first()
    if not faq:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="FAQ not found"
        )

    faq.helpful_count += 1
    db.commit()
    return {"message": "Marked as helpful", "count": faq.helpful_count}

@router.delete("/{faq_id}")
def delete_faq(
    faq_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete FAQs"
        )

    faq = db.query(FAQ).filter(FAQ.id == faq_id).first()
    if not faq:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="FAQ not found"
        )

    db.delete(faq)
    db.commit()
    return {"message": "FAQ deleted successfully"}