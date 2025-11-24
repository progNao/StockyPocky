from uuid import UUID
from pydantic import BaseModel, EmailStr, field_validator

class UserResponse(BaseModel):
  id: UUID
  email: str
  name: str
  
  model_config = {
    "from_attributes": True
  }

class LoginRequest(BaseModel):
  email: EmailStr
  password: str
  
  @field_validator("password")
  def check_password(cls, v):
    if len(v) < 8:
      raise ValueError("Password must be at least 8 characters")
    return v

class SignupRequest(LoginRequest):
  name: str

class UpdateUserRequest(SignupRequest):
  id: UUID
