# models.py - Database ORM models for the AgroTech application
# Implements SQLAlchemy models with proper relationships and constraints
from sqlalchemy import Column, Integer, String, Boolean, Float, Enum, ForeignKey, Date, DateTime, func
from sqlalchemy.ext.declarative import declarative_base
import enum
from datetime import date

Base = declarative_base()

class UserType(str, enum.Enum):
    FARMER = "farmer"
    COMPANY = "company"

class User(Base):
    """
    User model with polymorphic structure to support both farmer and company entities.
    Implements appropriate validation and relationship logic.
    """
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    user_type = Column(Enum(UserType), nullable=False)
    
    # Common fields for both user types
    full_name = Column(String, nullable=False)
    mobile_number = Column(String, nullable=False)
    
    # Farmer-specific attributes
    farm_location = Column(String, nullable=True)  # GeoJSON string representation for flexibility
    farm_area = Column(Float, nullable=True)  # Stored in hectares for standardization
    government_id = Column(String, nullable=True)  # File path to verification document
    
    # Company-specific attributes
    company_name = Column(String, nullable=True)
    company_type = Column(String, nullable=True)  # Food Processing, Exporter, Retailer, etc.
    company_location = Column(String, nullable=True)
    contact_person_designation = Column(String, nullable=True)
    company_gst_id = Column(String, nullable=True)  # File path to verification document

class FarmStatusEnum(str, enum.Enum):
    """Enumeration representing the current state of a farm's crop cycle"""
    EMPTY = "empty"
    GROWING = "growing"
    HARVESTED = "harvested"

class Farm(Base):
    """
    Farm entity representing agricultural land with its associated attributes.
    Contains geospatial data and crop-specific information.
    """
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

class FarmImage(Base):
    """Storage model for farm images to facilitate visual verification and analysis"""
    __tablename__ = "farm_images"
    
    id = Column(Integer, primary_key=True, index=True)
    farm_id = Column(Integer, ForeignKey("farms.id"), nullable=False)
    image_url = Column(String, nullable=False)
    created_at = Column(DateTime, server_default=func.now())

class BidStatusEnum(str, enum.Enum):
    """Status tracking for the bidding workflow process"""
    PENDING = "pending"
    ACCEPTED = "accepted"
    REJECTED = "rejected"

class Bid(Base):
    """
    Bid entity representing offers from companies to farmers.
    Implements a complete transaction tracking system.
    """
    __tablename__ = "bids"
    
    id = Column(Integer, primary_key=True, index=True)
    farm_id = Column(Integer, ForeignKey("farms.id"), nullable=False)
    company_username = Column(String, ForeignKey("users.username"), nullable=False)
    bid_amount = Column(Float, nullable=False)
    bid_date = Column(DateTime, server_default=func.now())
    status = Column(Enum(BidStatusEnum), default=BidStatusEnum.PENDING, nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

class GovScheme(Base):
    """
    Government scheme entity for agricultural support programs.
    Provides structured access to government initiatives.
    """
    __tablename__ = "gov_schemes"
    
    id = Column(Integer, primary_key=True, index=True)
    scheme_name = Column(String, nullable=False)
    detailed_description = Column(String, nullable=False)
    type = Column(String, nullable=False)
    url = Column(String, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

class CropHealthRecord(Base):
    """
    Stores disease detection results and associated metadata.
    Enables historical analysis and trend identification.
    """
    __tablename__ = "crop_health_records"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    image_path = Column(String, nullable=False)
    detected_disease = Column(String, nullable=True)
    scientific_name = Column(String, nullable=True)
    confidence_score = Column(Float, nullable=True)
    timestamp = Column(DateTime, server_default=func.now())
    notes = Column(String, nullable=True)
