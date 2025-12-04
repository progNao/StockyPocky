from sqlalchemy.orm import Session
from app.models.user import User
from app.repositories.users_repo import create_user, get_user_for_email, get_user_for_name
from app.schemas.user import LoginRequest, SignupRequest, UserResponse
from app.utils.jwt import create_access_token
from app.utils.response import success, error
from app.utils.security import hash_password, verify_password

def login_api(request: LoginRequest, db: Session):
  user = get_user_for_email(request, db)

  if not user:
    return error("User not found", 404)

  if not verify_password(request.password, user.password):
    return error("Invalid password", 401)
  
  token = create_access_token({"sub": user.name})
  response = "Bearer " + token

  return success({
    "token": response,
    "name": user.name
  })

def signup_api(request: SignupRequest, db: Session):
  existing_name = get_user_for_name(request, db)
  existing_email = get_user_for_email(request, db)

  if existing_name:
    return error("Name already registered", 409)

  if existing_email:
    return error("Email already registered", 409)

  hashed = hash_password(request.password)

  new_user = User(
    email=request.email,
    password=hashed,
    name=request.name
  )

  try:
    create_user(new_user, db)
    return success(UserResponse.model_validate(new_user))
  except Exception:
    db.rollback()
    return error("db_error", 500)

def logout_api():
  return success("Logged out successfully")