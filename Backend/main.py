# main.py
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from routers import auth, user, farm, bid

app = FastAPI(debug=True)

origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    # Add more origins here
]

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

# Mount static files
app.mount("/media", StaticFiles(directory="media"), name="media")

app.include_router(user.router)
app.include_router(auth.router, prefix="/auth")
app.include_router(farm.router)
app.include_router(bid.router)

@app.get("/")
async def root():
    return {"message": "Welcome to AgroTech API"}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
