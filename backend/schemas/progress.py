from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class ProgressUpdate(BaseModel):
    goal_amount: Optional[float] = None
    current_amount: Optional[float] = None


class ProgressResponse(BaseModel):
    current_amount: float
    goal_amount: float
    percentage: float
    updated_at: datetime

    class Config:
        from_attributes = True