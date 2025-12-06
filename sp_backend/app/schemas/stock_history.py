from uuid import UUID
from pydantic import BaseModel
from datetime import datetime

class StockHistoryResponse(BaseModel):
  id: int
  change: int
  reason: str
  memo: str
  user_id: UUID
  item_id: int
  created_at: datetime
  
  model_config = {
    "from_attributes": True
  }

class StockHistoryRequest(BaseModel):
  reason: str
  memo: str
