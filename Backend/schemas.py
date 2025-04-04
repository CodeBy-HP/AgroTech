# schemas.py
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import date, datetime
from models import UserType, FarmStatusEnum, BidStatusEnum


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

# Farm Schemas
class FarmBase(BaseModel):
    farm_location: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    farm_area: float
    crop_type: Optional[str] = None
    is_organic: Optional[bool] = False
    pesticides_used: Optional[str] = None
    expected_harvest_date: Optional[date] = None
    expected_quantity: Optional[float] = None
    min_asking_price: Optional[float] = None
    farm_status: Optional[FarmStatusEnum] = FarmStatusEnum.EMPTY

class FarmCreate(FarmBase):
    pass

class FarmUpdate(BaseModel):
    farm_location: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    farm_area: Optional[float] = None
    crop_type: Optional[str] = None
    is_organic: Optional[bool] = None
    pesticides_used: Optional[str] = None
    expected_harvest_date: Optional[date] = None
    expected_quantity: Optional[float] = None
    min_asking_price: Optional[float] = None
    farm_status: Optional[FarmStatusEnum] = None

class FarmResponse(FarmBase):
    id: int
    farmer_username: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Farm Image Schemas
class FarmImageBase(BaseModel):
    farm_id: int
    image_url: str

class FarmImageCreate(FarmImageBase):
    pass

class FarmImageResponse(FarmImageBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Bid Schemas
class BidBase(BaseModel):
    farm_id: int
    bid_amount: float

class BidCreate(BidBase):
    pass

class BidUpdate(BaseModel):
    bid_amount: Optional[float] = None
    status: Optional[BidStatusEnum] = None

class BidResponse(BidBase):
    id: int
    company_username: str
    bid_date: datetime
    status: BidStatusEnum
    updated_at: datetime

    class Config:
        from_attributes = True

# Additional response schemas
class FarmWithBidsResponse(FarmResponse):
    bids: List[BidResponse] = []

class BidWithFarmResponse(BidResponse):
    farm: FarmResponse

class FarmWithImagesResponse(FarmResponse):
    images: List[FarmImageResponse] = []