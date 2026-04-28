from datetime import datetime
from sqlalchemy import Column, Integer, Float, DateTime, CheckConstraint
from database import Base


class Progress(Base):
    __tablename__ = "progress"

    id = Column(Integer, primary_key=True, default=1)
    goal_amount = Column(Float, nullable=False, default=100000.00)
    current_amount = Column(Float, nullable=False, default=0.00)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    __table_args__ = (
        CheckConstraint('id = 1', name='single_progress_row'),
    )