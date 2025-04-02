from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from sqlalchemy import func

from database import get_db
from models import User, Farm, Bid, UserType, BidStatusEnum
from schemas import BidCreate, BidResponse, BidUpdate, BidWithFarmResponse
from auth.auth_handler import get_current_active_user

router = APIRouter(prefix="/api", tags=["bids"])

# Create a new bid (only for companies)
@router.post("/bids/", response_model=BidResponse)
async def create_bid(
    bid: BidCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Check if user is a company
    if current_user.user_type != UserType.COMPANY:
        raise HTTPException(status_code=403, detail="Only companies can place bids")
    
    # Check if farm exists
    farm = db.query(Farm).filter(Farm.id == bid.farm_id).first()
    if not farm:
        raise HTTPException(status_code=404, detail="Farm not found")
    
    # Check if company already has a pending bid for this farm
    existing_bid = db.query(Bid).filter(
        Bid.farm_id == bid.farm_id,
        Bid.company_username == current_user.username,
        Bid.status == BidStatusEnum.PENDING
    ).first()
    
    if existing_bid:
        raise HTTPException(status_code=400, detail="You already have a pending bid for this farm")
    
    # Create new bid
    db_bid = Bid(
        farm_id=bid.farm_id,
        company_username=current_user.username,
        bid_amount=bid.bid_amount,
        status=BidStatusEnum.PENDING
    )
    
    db.add(db_bid)
    db.commit()
    db.refresh(db_bid)
    
    return db_bid

# Get all bids with optional farm_id filter
@router.get("/bids/", response_model=List[BidResponse])
async def get_bids(
    farm_id: Optional[int] = None,
    status: Optional[BidStatusEnum] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    query = db.query(Bid)
    
    # Companies can only see their own bids
    if current_user.user_type == UserType.COMPANY:
        query = query.filter(Bid.company_username == current_user.username)
    
    # Farmers can only see bids for their farms
    elif current_user.user_type == UserType.FARMER:
        # Get all farms owned by the farmer
        farmer_farms = db.query(Farm.id).filter(Farm.farmer_username == current_user.username).all()
        farmer_farm_ids = [farm[0] for farm in farmer_farms]
        query = query.filter(Bid.farm_id.in_(farmer_farm_ids))
    
    # Apply additional filters if provided
    if farm_id:
        query = query.filter(Bid.farm_id == farm_id)
    
    if status:
        query = query.filter(Bid.status == status)
    
    # Execute query with pagination
    bids = query.offset(skip).limit(limit).all()
    return bids

# Get a specific bid
@router.get("/bids/{bid_id}", response_model=BidWithFarmResponse)
async def get_bid(
    bid_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Get bid
    bid = db.query(Bid).filter(Bid.id == bid_id).first()
    if not bid:
        raise HTTPException(status_code=404, detail="Bid not found")
    
    # Check permissions
    farm = db.query(Farm).filter(Farm.id == bid.farm_id).first()
    
    # Only the bid maker (company) or farm owner (farmer) can see a specific bid
    if (current_user.user_type == UserType.COMPANY and current_user.username == bid.company_username) or \
       (current_user.user_type == UserType.FARMER and current_user.username == farm.farmer_username):
        return bid
    else:
        raise HTTPException(status_code=403, detail="You don't have permission to view this bid")

# Update a bid
@router.put("/bids/{bid_id}", response_model=BidResponse)
async def update_bid(
    bid_id: int,
    bid_update: BidUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Get bid
    db_bid = db.query(Bid).filter(Bid.id == bid_id).first()
    if not db_bid:
        raise HTTPException(status_code=404, detail="Bid not found")
    
    # Get farm
    farm = db.query(Farm).filter(Farm.id == db_bid.farm_id).first()
    
    # Check permissions based on update type
    if bid_update.bid_amount is not None:
        # Only the bid maker (company) can update the bid amount
        if current_user.user_type != UserType.COMPANY or current_user.username != db_bid.company_username:
            raise HTTPException(status_code=403, detail="Only the company that made the bid can update the amount")
        
        # Can only update if bid is still pending
        if db_bid.status != BidStatusEnum.PENDING:
            raise HTTPException(status_code=400, detail="Cannot update the amount of a non-pending bid")
        
        # Update bid amount
        db_bid.bid_amount = bid_update.bid_amount
    
    if bid_update.status is not None:
        # Only the farm owner (farmer) can update the bid status
        if current_user.user_type != UserType.FARMER or current_user.username != farm.farmer_username:
            raise HTTPException(status_code=403, detail="Only the farm owner can update the bid status")
        
        # Update bid status
        db_bid.status = bid_update.status
    
    db.commit()
    db.refresh(db_bid)
    return db_bid

# Delete a bid (only for the bid maker and only if pending)
@router.delete("/bids/{bid_id}", status_code=204)
async def delete_bid(
    bid_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Get bid
    db_bid = db.query(Bid).filter(Bid.id == bid_id).first()
    if not db_bid:
        raise HTTPException(status_code=404, detail="Bid not found")
    
    # Check if current user is the bid maker
    if current_user.user_type != UserType.COMPANY or current_user.username != db_bid.company_username:
        raise HTTPException(status_code=403, detail="Only the company that made the bid can delete it")
    
    # Check if bid is still pending
    if db_bid.status != BidStatusEnum.PENDING:
        raise HTTPException(status_code=400, detail="Cannot delete a non-pending bid")
    
    # Delete bid
    db.delete(db_bid)
    db.commit()
    return None

# Get all bids made by the current company
@router.get("/bids/my-bids/", response_model=List[BidResponse])
async def get_my_bids(
    status: Optional[BidStatusEnum] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    if current_user.user_type != UserType.COMPANY:
        raise HTTPException(status_code=403, detail="Only companies can access this endpoint")
    
    query = db.query(Bid).filter(Bid.company_username == current_user.username)
    
    if status:
        query = query.filter(Bid.status == status)
    
    bids = query.all()
    return bids 