from datetime import datetime, timedelta
import secrets
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from passlib.hash import bcrypt

from ..database import get_db
from ..models import Admin

router = APIRouter()

# In-memory reset token store for dev; replace with DB table in prod
RESET_TOKENS: dict[str, dict] = {}

class LoginRequest(BaseModel):
  username: str
  password: str

class LoginResponse(BaseModel):
  message: str

class ForgotPasswordRequest(BaseModel):
  email: EmailStr

class ResetPasswordRequest(BaseModel):
  token: str
  new_password: str

@router.post("/login", response_model=LoginResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
  admin: Optional[Admin] = db.query(Admin).filter(Admin.username == req.username).first()
  if not admin or not bcrypt.verify(req.password, admin.password_hash):
    raise HTTPException(status_code=401, detail="Invalid credentials")
  return {"message": "ok"}

@router.post("/forgot-password")
def forgot_password(req: ForgotPasswordRequest):
  token = secrets.token_urlsafe(32)
  RESET_TOKENS[token] = {"email": req.email, "exp": datetime.utcnow() + timedelta(hours=1)}
  # For dev: print the reset link in server logs
  print(f"[DEV] Password reset link: http://localhost:3000/reset?token={token}")
  return {"message": "If this email exists, a reset link has been sent."}

@router.post("/reset-password")
def reset_password(req: ResetPasswordRequest, db: Session = Depends(get_db)):
  record = RESET_TOKENS.get(req.token)
  if not record or record["exp"] < datetime.utcnow():
    raise HTTPException(status_code=400, detail="Invalid or expired token")
  email = record["email"]
  # For demo: update Admin password if username matches email (adapt as needed)
  admin = db.query(Admin).filter(Admin.username == email).first()
  if not admin:
    raise HTTPException(status_code=404, detail="User not found")
  admin.password_hash = bcrypt.hash(req.new_password)
  db.add(admin)
  db.commit()
  del RESET_TOKENS[req.token]
  return {"message": "Password reset successful"}
