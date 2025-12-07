from uuid import UUID
from pydantic import BaseModel, field_validator
from datetime import datetime

class ShoppingListResponse(BaseModel):
  id: int
  quantity: int
  checked: bool
  user_id: UUID
  item_id: int
  added_at: datetime
  
  model_config = {
    "from_attributes": True
  }

class ShoppingListRequest(BaseModel):
  item_id: int
  quantity: int

class ShoppingListCheckRequest(BaseModel):
  checked: bool