# main.py
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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

app.include_router(user.router)
app.include_router(auth.router, prefix="/auth")
app.include_router(farm.router)
app.include_router(bid.router)

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
