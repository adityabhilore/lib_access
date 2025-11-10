import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from .database import Base, engine
from .routers import auth, scan

load_dotenv()

Base.metadata.create_all(bind=engine)

app = FastAPI(title="LibAccess Backend", version="0.1.0")

CLIENT_URL = os.getenv("CLIENT_URL", "http://localhost:3000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[CLIENT_URL, "http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health():
    return {"status": "ok"}

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(scan.router, prefix="/api", tags=["scan"]) 
