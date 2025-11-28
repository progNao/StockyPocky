from uuid import UUID
from pydantic import BaseModel, field_validator

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
  
  @field_validator("name")
  def check_name(cls, v):
    if not v or v.strip() == "":
      raise ValueError("Name is required")
    return v

class UpdateCategoryRequest(CreateCategoryRequest):
  id: int