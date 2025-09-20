from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from app.models.shelter import RequestStatus

class ShelterBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    description: Optional[str] = None
    website: Optional[str] = None
    capacity: Optional[int] = None

class ShelterCreate(ShelterBase):
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class ShelterUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    description: Optional[str] = None
    website: Optional[str] = None
    capacity: Optional[int] = None

class Shelter(ShelterBase):
    id: int
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    current_occupancy: int
    is_active: bool
    is_verified: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ShelterRequestBase(BaseModel):
    notes: Optional[str] = None
    priority: str = "normal"

class ShelterRequestCreate(ShelterRequestBase):
    shelter_id: int
    animal_id: int

class ShelterRequest(ShelterRequestBase):
    id: int
    shelter_id: int
    animal_id: int
    reporter_id: int
    status: RequestStatus
    response_notes: Optional[str] = None
    created_at: datetime
    responded_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True