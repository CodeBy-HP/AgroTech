# models.py
from sqlalchemy import Column, Integer, String, Boolean, Float, Enum, ForeignKey, Date, DateTime, func
from sqlalchemy.ext.declarative import declarative_base
import enum
from datetime import date

Base = declarative_base()

class UserType(str, enum.Enum):
    FARMER = "farmer"
    COMPANY = "company"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    user_type = Column(Enum(UserType), nullable=False)
    
    # Common fields
    full_name = Column(String, nullable=False)
    mobile_number = Column(String, nullable=False)
    
    # Farmer specific fields
    farm_location = Column(String, nullable=True)  # Can store GeoJSON as string
    farm_area = Column(Float, nullable=True)  # In hectares
    government_id = Column(String, nullable=True)  # Store file path or ID
    
    # Company specific fields
    company_name = Column(String, nullable=True)
    company_type = Column(String, nullable=True)  # Food Processing, Exporter, Retailer, etc.
    company_location = Column(String, nullable=True)
    contact_person_designation = Column(String, nullable=True)
    company_gst_id = Column(String, nullable=True)  # Store file path or ID

class FarmStatusEnum(str, enum.Enum):
    EMPTY = "empty"
    GROWING = "growing"
    HARVESTED = "harvested"

class Farm(Base):
    __tablename__ = "farms"
    
    id = Column(Integer, primary_key=True, index=True)
    farmer_username = Column(String, ForeignKey("users.username"), nullable=False)
    farm_location = Column(String, nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    farm_area = Column(Float, nullable=False)
    crop_type = Column(String, nullable=True)
    is_organic = Column(Boolean, default=False)
    pesticides_used = Column(String, nullable=True)
    expected_harvest_date = Column(Date, nullable=True)
    expected_quantity = Column(Float, nullable=True)
    min_asking_price = Column(Float, nullable=True)
    farm_status = Column(Enum(FarmStatusEnum), default=FarmStatusEnum.EMPTY)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

class BidStatusEnum(str, enum.Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    REJECTED = "rejected"

class Bid(Base):
    __tablename__ = "bids"
    
    id = Column(Integer, primary_key=True, index=True)
    farm_id = Column(Integer, ForeignKey("farms.id"), nullable=False)
    company_username = Column(String, ForeignKey("users.username"), nullable=False)
    bid_amount = Column(Float, nullable=False)
    bid_date = Column(DateTime, server_default=func.now())
    status = Column(Enum(BidStatusEnum), default=BidStatusEnum.PENDING, nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
