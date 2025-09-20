from sqlalchemy import Column, Integer, Boolean, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from app.core.database import Base

class SwipeDirection(str, enum.Enum):
    LEFT = "left"
    RIGHT = "right"
    SUPER_LIKE = "super_like"

class Swipe(Base):
    __tablename__ = "swipes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    animal_id = Column(Integer, ForeignKey("animals.id"), nullable=False)

    direction = Column(Enum(SwipeDirection), nullable=False)
    is_match = Column(Boolean, default=False)

    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="swipes")
    animal = relationship("Animal", back_populates="swipes")