from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from sqlalchemy import or_

from database import get_db
from models import User, Farm, FarmImage, UserType, FarmStatusEnum
from schemas import FarmCreate, FarmResponse, FarmUpdate, FarmWithBidsResponse, FarmImageResponse, FarmWithImagesResponse
from auth.auth_handler import get_current_active_user
from utils import save_upload_file, delete_file

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

# Upload images for a farm
@router.post("/farms/{farm_id}/images/", response_model=List[FarmImageResponse])
async def upload_farm_images(
    farm_id: int,
    images: List[UploadFile] = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Check if farm exists
    db_farm = db.query(Farm).filter(Farm.id == farm_id).first()
    if not db_farm:
        raise HTTPException(status_code=404, detail="Farm not found")
    
    # Check if current user owns the farm
    if current_user.username != db_farm.farmer_username:
        raise HTTPException(status_code=403, detail="You don't have permission to upload images for this farm")
    
    # Save images and create records
    saved_images = []
    for image in images:
        # Check if file is an image
        if not image.content_type.startswith("image/"):
            continue
        
        # Save image and get path
        image_path = await save_upload_file(image)
        
        # Create image record
        db_image = FarmImage(
            farm_id=farm_id,
            image_url=image_path
        )
        
        db.add(db_image)
        db.commit()
        db.refresh(db_image)
        saved_images.append(db_image)
    
    return saved_images

# Get all images for a farm
@router.get("/farms/{farm_id}/images/", response_model=List[FarmImageResponse])
async def get_farm_images(
    farm_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Check if farm exists
    db_farm = db.query(Farm).filter(Farm.id == farm_id).first()
    if not db_farm:
        raise HTTPException(status_code=404, detail="Farm not found")
    
    # Get all images for the farm
    images = db.query(FarmImage).filter(FarmImage.farm_id == farm_id).all()
    return images

# Delete a farm image
@router.delete("/farms/images/{image_id}", status_code=204)
async def delete_farm_image(
    image_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Get the image
    db_image = db.query(FarmImage).filter(FarmImage.id == image_id).first()
    if not db_image:
        raise HTTPException(status_code=404, detail="Image not found")
    
    # Get the farm to check ownership
    db_farm = db.query(Farm).filter(Farm.id == db_image.farm_id).first()
    if not db_farm:
        raise HTTPException(status_code=404, detail="Farm not found")
    
    # Check if current user owns the farm
    if current_user.username != db_farm.farmer_username:
        raise HTTPException(status_code=403, detail="You don't have permission to delete this image")
    
    # Delete the file
    delete_file(db_image.image_url)
    
    # Delete the record
    db.delete(db_image)
    db.commit()
    
    return None

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

# Get a specific farm by ID with its images
@router.get("/farms/{farm_id}", response_model=FarmWithImagesResponse)
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
    
    # Get images for the farm
    images = db.query(FarmImage).filter(FarmImage.farm_id == farm_id).all()
    
    # Convert farm to dict and add images
    farm_dict = {**farm.__dict__}
    if "_sa_instance_state" in farm_dict:
        farm_dict.pop("_sa_instance_state")
    
    farm_dict["images"] = images
    
    return farm_dict

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
    
    # Get all images for the farm
    farm_images = db.query(FarmImage).filter(FarmImage.farm_id == farm_id).all()
    
    # Delete all image files
    for image in farm_images:
        delete_file(image.image_url)
        db.delete(image)
    
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