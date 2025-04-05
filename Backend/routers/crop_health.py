from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
import os
import shutil
import requests
from typing import Optional
from dotenv import load_dotenv
from datetime import datetime
import uuid

from database import get_db
from auth.auth_handler import get_current_active_user
from models import User, CropHealthRecord

# Load environment variables
load_dotenv()

# Get API configuration
CROP_DISEASE_API_KEY = os.getenv("CROP_DISEASE_API_KEY")
CROP_DISEASE_API_URL = os.getenv("CROP_DISEASE_API_URL")

router = APIRouter(
    prefix="/api",
    tags=["crop-health"],
    responses={404: {"description": "Not found"}},
)

@router.post("/crop-disease-identify")
async def identify_crop_disease(
    image: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Identify crop disease from uploaded image
    """
    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    # Create media directory if it doesn't exist
    upload_dir = "media/crop_images"
    os.makedirs(upload_dir, exist_ok=True)
    
    # Generate a unique filename
    file_extension = os.path.splitext(image.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(upload_dir, unique_filename)
    
    # Save the image
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving file: {str(e)}")
    finally:
        image.file.close()
    
    # If API key is not set, use mock response for development
    if not CROP_DISEASE_API_KEY or not CROP_DISEASE_API_URL:
        # Mock response for demonstration
        mock_result = {
            "name": "Late Blight",
            "scientific_name": "Phytophthora infestans",
            "probability": 0.89,
            "treatment": {
                "prevention": [
                    "Plant resistant varieties when available",
                    "Ensure proper spacing between plants for good air circulation",
                    "Avoid overhead irrigation and water early in the day",
                    "Rotate crops (3-4 year rotation)",
                    "Remove and destroy all infected plant debris"
                ],
                "chemical": [
                    "Chlorothalonil-based fungicides (preventative)",
                    "Mancozeb-based products (preventative)",
                    "Metalaxyl or mefenoxam combined with a protectant fungicide",
                    "Copper-based fungicides for organic production"
                ],
                "biological": [
                    "Bacillus subtilis-based products",
                    "Trichoderma harzianum-based products",
                    "Compost tea applications to boost plant immunity"
                ]
            }
        }
        
        # Save record to database
        crop_health_record = CropHealthRecord(
            user_id=current_user.id,
            image_path=f"/{file_path}",
            detected_disease=mock_result["name"],
            confidence_score=mock_result["probability"],
            scientific_name=mock_result["scientific_name"],
            timestamp=datetime.utcnow()
        )
        db.add(crop_health_record)
        db.commit()
        
        return mock_result
    
    # Call external API for disease detection
    try:
        with open(file_path, "rb") as img_file:
            files = {"image": (unique_filename, img_file, image.content_type)}
            headers = {"Authorization": f"Bearer {CROP_DISEASE_API_KEY}"}
            
            response = requests.post(
                CROP_DISEASE_API_URL,
                files=files,
                headers=headers
            )
            
            if response.status_code != 200:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"Error from crop disease API: {response.text}"
                )
            
            result = response.json()
            
            # Save record to database
            crop_health_record = CropHealthRecord(
                user_id=current_user.id,
                image_path=f"/{file_path}",
                detected_disease=result.get("name", "Unknown"),
                confidence_score=result.get("probability", 0.0),
                scientific_name=result.get("scientific_name", ""),
                timestamp=datetime.utcnow()
            )
            db.add(crop_health_record)
            db.commit()
            
            return result
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Error calling crop disease API: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}") 