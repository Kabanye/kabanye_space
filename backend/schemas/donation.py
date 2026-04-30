from pydantic import BaseModel, Field, validator
from typing import Optional
from datetime import datetime
import re


class DonationCreate(BaseModel):
    amount: float = Field(..., gt=0, description="Donation amount in KES")
    phone_number: str = Field(...)  # ✅ removed min_length/max_length — validator handles this
    name: Optional[str] = Field(None, max_length=100)
    message: Optional[str] = Field(None, max_length=500)

    @validator('phone_number')
    def validate_kenyan_phone(cls, v):
        v = re.sub(r'[\s\-\(\)]', '', v)
        if v.startswith('+'):
            v = v[1:]
        if v.startswith('0'):
            v = '254' + v[1:]
        if re.match(r'^[17]\d{8}$', v):  # ✅ handle bare 7xx/1xx (9 digits)
            v = '254' + v
        if not re.match(r'^254[17]\d{8}$', v):
            raise ValueError('Invalid Kenyan phone number format')
        return v

    @validator('amount')
    def validate_amount(cls, v):
        if v < 1:
            raise ValueError('Minimum donation is KES 1')
        if v > 150000:
            raise ValueError('Maximum donation is KES 150,000')
        return round(v, 2)


class DonationResponse(BaseModel):
    id: str
    amount: float
    name: Optional[str]
    message: Optional[str]
    is_public: bool
    created_at: datetime

    class Config:
        from_attributes = True


class PublicMessage(BaseModel):
    name: Optional[str]
    message: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True