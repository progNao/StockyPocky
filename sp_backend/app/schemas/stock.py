from typing import Literal
from uuid import UUID
from pydantic import BaseModel, field_validator
from app.schemas.stock_history import StockHistoryRequest

class StockResponse(BaseModel):
  id: int
  quantity: int
  threshold: int
  location: str
  user_id: UUID
  item_id: int
  
  model_config = {
    "from_attributes": True
  }

class StockRequest(StockHistoryRequest):
  action: Literal["increase", "decrease", "manual"]
  quantity: int
  threshold: int
  location: str
  
  @field_validator("location")
  def check_location(cls, v):
    if not v or v.strip() == "":
      raise ValueError("Location is required")
    return v

class StockTestRequest(BaseModel):
  quantity: int
  threshold: int
  location: str
  
  @field_validator("location")
  def check_location(cls, v):
    if not v or v.strip() == "":
      raise ValueError("Location is required")
    return v

class StockOnlyRequest(BaseModel):
  quantity: int
  threshold: int
  location: str
  item_id: int
  
  @field_validator("location")
  def check_location(cls, v):
    if not v or v.strip() == "":
      raise ValueError("Location is required")
    return v