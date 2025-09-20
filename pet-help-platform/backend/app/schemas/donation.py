from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from app.models.donation import DonationStatus

class DonationBase(BaseModel):
    amount: float = Field(..., gt=0)
    currency: str = "USD"
    purpose: Optional[str] = None
    notes: Optional[str] = None

class DonationCreate(DonationBase):
    animal_id: Optional[int] = None
    payment_method: str = "card"

class Donation(DonationBase):
    id: int
    user_id: int
    animal_id: Optional[int] = None
    status: DonationStatus
    payment_method: str
    transaction_id: Optional[str] = None
    created_at: datetime
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True