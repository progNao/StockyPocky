from uuid import UUID
from fastapi import Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from utils.security import hash_password
from schemas.user import UpdateUserRequest, UserResponse
from utils.response import error, success
from repositories.users_repo import delete_user, get_user, get_users, update_user
from database import get_db

def get_users_api(db: Session):
  users = get_users(db)
  response_users = [UserResponse.model_validate(u) for u in users]
  return success(response_users)

def get_user_api(user_id: UUID, db: Session):
  user = __private_user_check(user_id, db)
  
  if isinstance(user, JSONResponse):
    return user
  
  return success(UserResponse.model_validate(user))

def update_user_api(payload: UpdateUserRequest, db: Session = Depends(get_db)):
  user = __private_user_check(payload.id, db)
  
  if isinstance(user, JSONResponse):
    return user
  
  if payload.name:
    user.name = payload.name
  if payload.email:
    user.email = payload.email
  if payload.password:
    user.password = hash_password(payload.password)
    
  try:
    response = update_user(user, db)
    return success(UserResponse.model_validate(response))
  except Exception:
    db.rollback()
    return error("db_error", 500)

def delete_user_api(user_id: UUID, db: Session):
  user = __private_user_check(user_id, db)
  
  if isinstance(user, JSONResponse):
    return user
  
  try:
    delete_user(user, db)
    return success(UserResponse.model_validate(user))
  except Exception:
    db.rollback()
    return error("db_error", 500)

def __private_user_check(user_id: UUID, db: Session):
  user = get_user(user_id, db)
  
  if not user:
    return error("User not found", 404)
  else:
    return user
