from uuid import UUID
from pydantic import BaseModel, field_validator

class StockHistoryResponse(BaseModel):
  id: int
  change: int
  reason: str
  memo: str
  user_id: UUID
  item_id: int
  
  model_config = {
    "from_attributes": True
  }

class StockHistoryRequest(BaseModel):
  change: int
  reason: str
  memo: str
  
  @field_validator("reason")
  def check_location(cls, v):
    if not v or v.strip() == "":
      raise ValueError("Reason is required")
    return v
