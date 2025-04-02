from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from sqlalchemy import or_

from database import get_db
from models import User, Farm, UserType, FarmStatusEnum
from schemas import FarmCreate, FarmResponse, FarmUpdate, FarmWithBidsResponse
from auth.auth_handler import get_current_active_user

router = APIRouter(prefix="/api", tags=["farms"])

# Create a new farm (only for farmers)
@router.post("/farms/", response_model=FarmResponse)
async def create_farm(
    farm: FarmCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Check if user is a farmer
    if current_user.user_type != UserType.FARMER:
        raise HTTPException(status_code=403, detail="Only farmers can create farm listings")
    
    # Create new farm
    db_farm = Farm(
        **farm.dict(),
        farmer_username=current_user.username
    )
    
    db.add(db_farm)
    db.commit()
    db.refresh(db_farm)
    return db_farm

# Get all farms with optional filters
@router.get("/farms/", response_model=List[FarmResponse])
async def get_farms(
    crop_type: Optional[str] = None,
    is_organic: Optional[bool] = None,
    farm_location: Optional[str] = None,
    farm_status: Optional[FarmStatusEnum] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    query = db.query(Farm)
    
    # Apply filters if provided
    if crop_type:
        query = query.filter(Farm.crop_type == crop_type)
    if is_organic is not None:
        query = query.filter(Farm.is_organic == is_organic)
    if farm_location:
        query = query.filter(Farm.farm_location.contains(farm_location))
    if farm_status:
        query = query.filter(Farm.farm_status == farm_status)
    
    # Execute query with pagination
    farms = query.offset(skip).limit(limit).all()
    return farms

# Get a specific farm by ID with its bids
@router.get("/farms/{farm_id}", response_model=FarmResponse)
async def get_farm(
    farm_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Get farm
    farm = db.query(Farm).filter(Farm.id == farm_id).first()
    if not farm:
        raise HTTPException(status_code=404, detail="Farm not found")
    
    # Check access permissions
    if current_user.user_type == UserType.FARMER and current_user.username != farm.farmer_username:
        # Farmers can only see their own farms in detail
        pass  # We'll still return the farm, as it's public info
        
    # Return the farm without bids (bids should be fetched separately)
    return farm

# Update a farm (only for farm owner)
@router.put("/farms/{farm_id}", response_model=FarmResponse)
async def update_farm(
    farm_id: int,
    farm_update: FarmUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Check if farm exists
    db_farm = db.query(Farm).filter(Farm.id == farm_id).first()
    if not db_farm:
        raise HTTPException(status_code=404, detail="Farm not found")
    
    # Check if current user owns the farm
    if current_user.username != db_farm.farmer_username:
        raise HTTPException(status_code=403, detail="You don't have permission to update this farm")
    
    # Update farm with provided values
    farm_data = farm_update.dict(exclude_unset=True)
    for key, value in farm_data.items():
        setattr(db_farm, key, value)
    
    db.commit()
    db.refresh(db_farm)
    return db_farm

# Delete a farm (only for farm owner)
@router.delete("/farms/{farm_id}", status_code=204)
async def delete_farm(
    farm_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Check if farm exists
    db_farm = db.query(Farm).filter(Farm.id == farm_id).first()
    if not db_farm:
        raise HTTPException(status_code=404, detail="Farm not found")
    
    # Check if current user owns the farm
    if current_user.username != db_farm.farmer_username:
        raise HTTPException(status_code=403, detail="You don't have permission to delete this farm")
    
    # Delete farm
    db.delete(db_farm)
    db.commit()
    return None

# Get all farms owned by the current farmer
@router.get("/farms/my-farms/", response_model=List[FarmResponse])
async def get_my_farms(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    if current_user.user_type != UserType.FARMER:
        raise HTTPException(status_code=403, detail="Only farmers can access this endpoint")
    
    farms = db.query(Farm).filter(Farm.farmer_username == current_user.username).all()
    return farms 