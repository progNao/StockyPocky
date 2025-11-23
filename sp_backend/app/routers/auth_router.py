from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from schemas.response import SuccessResponse
from database import get_db
from schemas.user import LoginRequest, SignupRequest
from api.v1.auth import login_api, logout_api, signup_api

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/login", response_model=SuccessResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
  return login_api(payload, db)

@router.post("/signup", response_model=SuccessResponse)
def signup(payload: SignupRequest, db: Session = Depends(get_db)):
  return signup_api(payload, db)

@router.post("/logout", response_model=SuccessResponse)
def logout():
  return logout_api()