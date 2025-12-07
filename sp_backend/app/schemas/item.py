from typing import Optional
from uuid import UUID
from pydantic import BaseModel, field_validator

class ItemResponse(BaseModel):
  id: int
  name: str
  brand: str
  unit: str
  image_url: str
  default_quantity: int
  notes: str
  is_favorite: bool
  user_id: UUID
  category_id: int
  
  model_config = {
    "from_attributes": True
  }

class ItemRequest(BaseModel):
  name: str
  brand: Optional[str] = None
  unit: Optional[str] = None
  image_url: Optional[str] = None
  default_quantity: int
  notes: Optional[str] = None
  is_favorite: bool
  category_id: int
  
  @field_validator("name")
  def check_name(cls, v):
    if not v or v.strip() == "":
      raise ValueError("Name is required")
    return v
