from uuid import UUID
from pydantic import BaseModel

class CategoryResponse(BaseModel):
  id: int
  name: str
  icon: str
  user_id: UUID
  
  model_config = {
    "from_attributes": True
  }

class CreateCategoryRequest(BaseModel):
  name: str
  icon: str

class UpdateCategoryRequest(CreateCategoryRequest):
  id: int