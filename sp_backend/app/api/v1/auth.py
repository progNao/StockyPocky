from fastapi import Depends
from sqlalchemy.orm import Session
from utils.jwt import create_access_token
from utils.security import hash_password, verify_password
from database import get_db
from schemas.user import LoginRequest, SignupRequest, UserResponse
from models.user import User
from utils.response import error
from repositories.users_repo import create_user, get_user_for_email

def login_api(payload: LoginRequest, db: Session = Depends(get_db)):
  user = get_user_for_email(payload, db)

  if not user:
    return error("User not found", 404)

  if not verify_password(payload.password, user.password):
    return error("Invalid password", 401)
  
  token = create_access_token({"sub": user.name})

  response_dict = {"success": True, "data": token}
  return response_dict

def signup_api(payload: SignupRequest, db: Session = Depends(get_db)):
  existing = get_user_for_email(payload, db)
  if existing:
    return error("Email already registered", 409)

  hashed = hash_password(payload.password)

  new_user = User(
    email=payload.email,
    password=hashed,
    name=payload.name
  )

  create_user(new_user, db)
  
  user_dict = UserResponse.from_orm(new_user).model_dump()
  response_dict = {"success": True, "data": user_dict}
  return response_dict
