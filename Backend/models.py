# models.py
from sqlalchemy import Column, Integer, String, Boolean, Float, Enum
from sqlalchemy.ext.declarative import declarative_base
import enum

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
