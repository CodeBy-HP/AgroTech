# schemas.py
from pydantic import BaseModel, EmailStr
from typing import Optional
from models import UserType


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str | None = None


class UserBase(BaseModel):
    username: str
    email: EmailStr
    password: str
    full_name: str
    mobile_number: str


class FarmerCreate(UserBase):
    user_type: UserType = UserType.FARMER
    farm_location: str
    farm_area: float
    government_id: Optional[str] = None


class CompanyCreate(UserBase):
    user_type: UserType = UserType.COMPANY
    company_name: str
    company_type: str
    company_location: str
    contact_person_designation: str
    company_gst_id: Optional[str] = None


class UserResponse(BaseModel):
    username: str
    email: EmailStr
    full_name: str
    mobile_number: str
    user_type: UserType
    is_active: bool

    # Farmer fields
    farm_location: Optional[str] = None
    farm_area: Optional[float] = None
    government_id: Optional[str] = None

    # Company fields
    company_name: Optional[str] = None
    company_type: Optional[str] = None
    company_location: Optional[str] = None
    contact_person_designation: Optional[str] = None
    company_gst_id: Optional[str] = None

    class Config:
        from_attributes = True


class UserInDB(UserResponse):
    hashed_password: str