from uuid import UUID
from pydantic import BaseModel

class UserResponse(BaseModel):
  id: UUID
  email: str
  name: str
  
  model_config = {
    "from_attributes": True
  }

class UpdateRequest(BaseModel):
  email: str
  name: str
