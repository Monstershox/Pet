from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Enum, Float, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from app.core.database import Base

class AnimalType(str, enum.Enum):
    DOG = "dog"
    CAT = "cat"
    BIRD = "bird"
    RABBIT = "rabbit"
    OTHER = "other"

class AnimalStatus(str, enum.Enum):
    LOST = "lost"
    FOUND = "found"
    IN_SHELTER = "in_shelter"
    ADOPTED = "adopted"
    NEEDS_HELP = "needs_help"
    AVAILABLE = "available"

class AnimalSize(str, enum.Enum):
    SMALL = "small"
    MEDIUM = "medium"
    LARGE = "large"

class Animal(Base):
    __tablename__ = "animals"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    type = Column(Enum(AnimalType), nullable=False)
    breed = Column(String(100))
    age = Column(Integer)
    size = Column(Enum(AnimalSize))
    gender = Column(String(20))
    color = Column(String(50))
    description = Column(Text)

    status = Column(Enum(AnimalStatus), default=AnimalStatus.FOUND)
    health_status = Column(String(200))
    vaccinated = Column(Boolean, default=False)
    neutered = Column(Boolean, default=False)

    location = Column(String(200))
    latitude = Column(Float)
    longitude = Column(Float)

    owner_id = Column(Integer, ForeignKey("users.id"))
    shelter_id = Column(Integer, ForeignKey("shelters.id"))

    found_date = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    characteristics = Column(JSON)
    medical_history = Column(Text)

    good_with_kids = Column(Boolean)
    good_with_pets = Column(Boolean)

    owner = relationship("User", back_populates="animals")
    shelter = relationship("Shelter", back_populates="animals")
    photos = relationship("AnimalPhoto", back_populates="animal", cascade="all, delete-orphan")
    analyses = relationship("AnimalAnalysis", back_populates="animal", cascade="all, delete-orphan")
    swipes = relationship("Swipe", back_populates="animal", cascade="all, delete-orphan")
    donations = relationship("Donation", back_populates="animal", cascade="all, delete-orphan")
    shelter_requests = relationship("ShelterRequest", back_populates="animal", cascade="all, delete-orphan")

class AnimalPhoto(Base):
    __tablename__ = "animal_photos"

    id = Column(Integer, primary_key=True, index=True)
    animal_id = Column(Integer, ForeignKey("animals.id"), nullable=False)
    url = Column(String(500), nullable=False)
    thumbnail_url = Column(String(500))
    is_primary = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    animal = relationship("Animal", back_populates="photos")

class AnimalAnalysis(Base):
    __tablename__ = "animal_analyses"

    id = Column(Integer, primary_key=True, index=True)
    animal_id = Column(Integer, ForeignKey("animals.id"), nullable=False)
    ai_breed_detection = Column(String(200))
    ai_condition_assessment = Column(Text)
    ai_age_estimation = Column(String(50))
    ai_confidence_score = Column(Float)
    raw_analysis_data = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)

    animal = relationship("Animal", back_populates="analyses")