from sqlalchemy import Column, Integer, String, DateTime, Text, Float, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from app.core.database import Base

class DonationStatus(str, enum.Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    REFUNDED = "refunded"

class Donation(Base):
    __tablename__ = "donations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    animal_id = Column(Integer, ForeignKey("animals.id"))

    amount = Column(Float, nullable=False)
    currency = Column(String(3), default="USD")

    status = Column(Enum(DonationStatus), default=DonationStatus.PENDING)
    payment_method = Column(String(50))
    transaction_id = Column(String(255), unique=True)

    purpose = Column(String(200))
    notes = Column(Text)

    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime)

    user = relationship("User", back_populates="donations")
    animal = relationship("Animal", back_populates="donations")