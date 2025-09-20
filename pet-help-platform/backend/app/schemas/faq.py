from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class FAQBase(BaseModel):
    question: str
    answer: str
    category: Optional[str] = None

class FAQCreate(FAQBase):
    pass

class FAQUpdate(BaseModel):
    question: Optional[str] = None
    answer: Optional[str] = None
    category: Optional[str] = None
    is_active: Optional[bool] = None

class FAQ(FAQBase):
    id: int
    is_active: bool
    views: int
    helpful_count: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True