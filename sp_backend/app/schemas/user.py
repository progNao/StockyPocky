from uuid import UUID
from pydantic import BaseModel

class LoginRequest(BaseModel):
  email: str
  password: str

class SignupRequest(BaseModel):
  email: str
  password: str
  name: str

class UserResponse(BaseModel):
  id: UUID
  email: str
  name: str
  
  model_config = {
    "from_attributes": True
  }
