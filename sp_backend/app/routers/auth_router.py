from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.v1.auth_api import login_api, logout_api, signup_api
from app.schemas.response import SuccessResponse
from app.schemas.user import LoginRequest, SignupRequest
from database import get_db

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/login", response_model=SuccessResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
  return login_api(request, db)

@router.post("/signup", response_model=SuccessResponse)
def signup(request: SignupRequest, db: Session = Depends(get_db)):
  return signup_api(request, db)

@router.post("/logout", response_model=SuccessResponse)
def logout():
  return logout_api()
