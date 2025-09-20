from pydantic import BaseModel
from datetime import datetime
from app.models.swipe import SwipeDirection

class SwipeBase(BaseModel):
    animal_id: int
    direction: SwipeDirection

class SwipeCreate(SwipeBase):
    pass

class Swipe(SwipeBase):
    id: int
    user_id: int
    is_match: bool
    created_at: datetime

    class Config:
        from_attributes = True