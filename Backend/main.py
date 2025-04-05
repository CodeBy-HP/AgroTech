# main.py
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
import os
from dotenv import load_dotenv

from routers import auth, user, farm, bid, schemes, crop_health

# Load environment variables
load_dotenv()

app = FastAPI(debug=True)

# Get allowed origins from environment variable
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:5173")
origins = allowed_origins.split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create media directory if it doesn't exist
media_dir = Path("media")
media_dir.mkdir(exist_ok=True)

# Create crop images directory
crop_images_dir = Path("media/crop_images")
crop_images_dir.mkdir(exist_ok=True)

# Mount static files
app.mount("/media", StaticFiles(directory="media"), name="media")

app.include_router(user.router)
app.include_router(auth.router, prefix="/auth")
app.include_router(farm.router)
app.include_router(bid.router)
app.include_router(schemes.router)
app.include_router(crop_health.router)

@app.get("/")
async def root():
    return {"message": "Welcome to AgroTech API"}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
