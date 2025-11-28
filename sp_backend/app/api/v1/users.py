from uuid import UUID
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from app.repositories.users_repo import delete_user, get_user, get_user_for_email_check, get_user_for_name_check, get_users, update_user
from app.schemas.user import SignupRequest, UserResponse
from app.utils.response import error, success
from app.utils.security import hash_password

def get_users_api(db: Session):
  users = get_users(db)
  response = [UserResponse.model_validate(u) for u in users]
  return success(response)

def get_user_api(user_id: UUID, db: Session):
  user = __private_user_check(user_id, db)
  
  if isinstance(user, JSONResponse):
    return user
  
  return success(UserResponse.model_validate(user))

def update_user_api(user_id: UUID, request: SignupRequest, db: Session):
  user = __private_user_check(user_id, db)
  
  existing_name = get_user_for_name_check(request, user_id, db)
  if existing_name:
    return error("Name already registered", 409)

  existing_email = get_user_for_email_check(request, user_id, db)
  if existing_email:
    return error("Email already registered", 409)
  
  if isinstance(user, JSONResponse):
    return user
  
  if request.name:
    user.name = request.name
  if request.email:
    user.email = request.email
  if request.password:
    user.password = hash_password(request.password)
    
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

# private

def __private_user_check(user_id: UUID, db: Session):
  user = get_user(user_id, db)
  
  if not user:
    return error("User not found", 404)
  else:
    return user
