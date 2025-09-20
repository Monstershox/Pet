from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Float, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from app.core.database import Base

class RequestStatus(str, enum.Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class Shelter(Base):
    __tablename__ = "shelters"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    phone = Column(String(20))
    address = Column(String(300))
    city = Column(String(100))
    description = Column(Text)
    website = Column(String(255))

    latitude = Column(Float)
    longitude = Column(Float)

    capacity = Column(Integer)
    current_occupancy = Column(Integer, default=0)

    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    animals = relationship("Animal", back_populates="shelter")
    requests = relationship("ShelterRequest", back_populates="shelter", cascade="all, delete-orphan")

class ShelterRequest(Base):
    __tablename__ = "shelter_requests"

    id = Column(Integer, primary_key=True, index=True)
    shelter_id = Column(Integer, ForeignKey("shelters.id"), nullable=False)
    animal_id = Column(Integer, ForeignKey("animals.id"), nullable=False)
    reporter_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    status = Column(Enum(RequestStatus), default=RequestStatus.PENDING)
    priority = Column(String(20), default="normal")
    notes = Column(Text)
    response_notes = Column(Text)

    created_at = Column(DateTime, default=datetime.utcnow)
    responded_at = Column(DateTime)
    completed_at = Column(DateTime)

    shelter = relationship("Shelter", back_populates="requests")
    animal = relationship("Animal", back_populates="shelter_requests")
    reporter = relationship("User", back_populates="shelter_requests")