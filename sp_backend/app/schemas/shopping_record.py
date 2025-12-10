from typing import Literal
from uuid import UUID
from pydantic import BaseModel, field_validator
from datetime import datetime

class ShoppingRecordResponse(BaseModel):
  id: int
  quantity: int
  price: int
  store: str
  bought_at: datetime
  user_id: UUID
  item_id: int
  
  model_config = {
    "from_attributes": True
  }

class ShoppingRecordRequest(BaseModel):
  item_id: int
  quantity: int
  price: int
  store: str
  bought_at: datetime
  
  @field_validator("store")
  def check_location(cls, v):
    if not v or v.strip() == "":
      raise ValueError("Store is required")
    return v

class ShoppingRecordUpdateRequest(BaseModel):
  item_id: int
  quantity: int
  price: int
  store: str
  bought_at: datetime
  reason: str
  action: Literal["increase", "decrease", "manual"]
  
  @field_validator("store")
  def check_location(cls, v):
    if not v or v.strip() == "":
      raise ValueError("Store is required")
    return v
