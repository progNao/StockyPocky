from fastapi import Depends
from sqlalchemy.orm import Session
from app.models.user import User
from app.repositories.users_repo import create_user, get_user_for_email, get_user_for_name
from app.schemas.user import LoginRequest, SignupRequest, UserResponse
from app.utils.jwt import create_access_token
from app.utils.response import success, error
from app.utils.security import hash_password, verify_password
from database import get_db

def login_api(payload: LoginRequest, db: Session = Depends(get_db)):
  user = get_user_for_email(payload, db)

  if not user:
    return error("User not found", 404)

  if not verify_password(payload.password, user.password):
    return error("Invalid password", 401)
  
  token = create_access_token({"sub": user.name})
  response = "Bearer " + token

  return success(response)

def signup_api(payload: SignupRequest, db: Session = Depends(get_db)):
  existing_name = get_user_for_name(payload, db)
  existing_email = get_user_for_email(payload, db)

  if existing_name:
    return error("Name already registered", 409)

  if existing_email:
    return error("Email already registered", 409)

  hashed = hash_password(payload.password)

  new_user = User(
    email=payload.email,
    password=hashed,
    name=payload.name
  )

  try:
    create_user(new_user, db)
    user_dict = UserResponse.model_validate(new_user).model_dump()
    return success(user_dict)
  except Exception:
    db.rollback()
    return error("db_error", 500)

def logout_api():
  return success("Logged out successfully")