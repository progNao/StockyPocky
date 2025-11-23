from uuid import UUID
from pydantic import BaseModel

class UserResponse(BaseModel):
  id: UUID
  email: str
  name: str
  
  model_config = {
    "from_attributes": True
  }

class LoginRequest(BaseModel):
  email: str
  password: str

class SignupRequest(LoginRequest):
  name: str

class UpdateUserRequest(SignupRequest):
  id: UUID
