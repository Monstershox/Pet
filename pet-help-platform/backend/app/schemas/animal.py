from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from app.models.animal import AnimalType, AnimalStatus, AnimalSize

class AnimalPhotoBase(BaseModel):
    url: str
    is_primary: bool = False

class AnimalPhoto(AnimalPhotoBase):
    id: int
    thumbnail_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class AnimalAnalysisBase(BaseModel):
    ai_breed_detection: Optional[str] = None
    ai_condition_assessment: Optional[str] = None
    ai_age_estimation: Optional[str] = None
    ai_confidence_score: Optional[float] = None

class AnimalAnalysis(AnimalAnalysisBase):
    id: int
    raw_analysis_data: Optional[Dict[str, Any]] = None
    created_at: datetime

    class Config:
        from_attributes = True

class AnimalBase(BaseModel):
    name: Optional[str] = None
    type: AnimalType
    breed: Optional[str] = None
    age: Optional[int] = None
    size: Optional[AnimalSize] = None
    gender: Optional[str] = None
    color: Optional[str] = None
    description: Optional[str] = None
    health_status: Optional[str] = None
    vaccinated: bool = False
    neutered: bool = False
    location: Optional[str] = None
    good_with_kids: Optional[bool] = None
    good_with_pets: Optional[bool] = None

class AnimalCreate(AnimalBase):
    status: AnimalStatus = AnimalStatus.FOUND
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class AnimalUpdate(BaseModel):
    name: Optional[str] = None
    breed: Optional[str] = None
    age: Optional[int] = None
    size: Optional[AnimalSize] = None
    gender: Optional[str] = None
    color: Optional[str] = None
    description: Optional[str] = None
    status: Optional[AnimalStatus] = None
    health_status: Optional[str] = None
    vaccinated: Optional[bool] = None
    neutered: Optional[bool] = None
    location: Optional[str] = None
    good_with_kids: Optional[bool] = None
    good_with_pets: Optional[bool] = None

class Animal(AnimalBase):
    id: int
    status: AnimalStatus
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    owner_id: Optional[int] = None
    shelter_id: Optional[int] = None
    found_date: datetime
    created_at: datetime
    updated_at: datetime
    photos: List[AnimalPhoto] = []
    analyses: List[AnimalAnalysis] = []

    class Config:
        from_attributes = True