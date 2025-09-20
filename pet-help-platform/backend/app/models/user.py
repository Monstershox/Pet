from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from app.core.database import Base

class UserRole(str, enum.Enum):
    USER = "user"
    VOLUNTEER = "volunteer"
    SHELTER_ADMIN = "shelter_admin"
    VET = "vet"
    ADMIN = "admin"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(50), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(100))
    phone = Column(String(20))
    role = Column(Enum(UserRole), default=UserRole.USER)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    avatar_url = Column(String(500))
    bio = Column(Text)
    location = Column(String(200))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    preferences = Column(Text)
    points = Column(Integer, default=0)

    animals = relationship("Animal", back_populates="owner", cascade="all, delete-orphan")
    swipes = relationship("Swipe", back_populates="user", cascade="all, delete-orphan")
    donations = relationship("Donation", back_populates="user", cascade="all, delete-orphan")
    shelter_requests = relationship("ShelterRequest", back_populates="reporter", cascade="all, delete-orphan")