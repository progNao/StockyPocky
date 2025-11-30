from uuid import UUID
from pydantic import BaseModel

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
  reason: str
  memo: str
