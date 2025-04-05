from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models import GovScheme, User, UserType
from schemas import GovSchemeCreate, GovSchemeResponse
from auth.auth_handler import get_current_active_user

router = APIRouter(prefix="/api", tags=["schemes"])

# Create a new government scheme (admin only)
@router.post("/schemes/", response_model=GovSchemeResponse)
async def create_scheme(
    scheme: GovSchemeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Only admin users can create schemes
    if current_user.user_type != UserType.COMPANY:  # Using COMPANY as admin for simplicity
        raise HTTPException(status_code=403, detail="Only admins can create government schemes")
    
    # Create new scheme
    db_scheme = GovScheme(**scheme.dict())
    
    db.add(db_scheme)
    db.commit()
    db.refresh(db_scheme)
    return db_scheme

# Get all government schemes
@router.get("/schemes/", response_model=List[GovSchemeResponse])
async def get_schemes(
    scheme_type: str = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    query = db.query(GovScheme)
    
    # Filter by type if provided
    if scheme_type:
        query = query.filter(GovScheme.type == scheme_type)
    
    # Execute query
    schemes = query.all()
    return schemes

# Get a specific scheme by ID
@router.get("/schemes/{scheme_id}", response_model=GovSchemeResponse)
async def get_scheme(
    scheme_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    scheme = db.query(GovScheme).filter(GovScheme.id == scheme_id).first()
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")
    
    return scheme

# Bulk create schemes (for seeding)
@router.post("/schemes/bulk/", response_model=List[GovSchemeResponse])
async def bulk_create_schemes(
    schemes: List[GovSchemeCreate],
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Only admin users can create schemes
    if current_user.user_type != UserType.COMPANY:  # Using COMPANY as admin for simplicity
        raise HTTPException(status_code=403, detail="Only admins can create government schemes")
    
    db_schemes = []
    for scheme in schemes:
        db_scheme = GovScheme(**scheme.dict())
        db.add(db_scheme)
        db_schemes.append(db_scheme)
    
    db.commit()
    
    # Refresh all schemes
    for scheme in db_schemes:
        db.refresh(scheme)
    
    return db_schemes 