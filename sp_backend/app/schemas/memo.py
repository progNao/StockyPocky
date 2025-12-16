from typing import Optional
from uuid import UUID
from pydantic import BaseModel, field_validator

class MemoResponse(BaseModel):
  id: int
  title: str
  content: Optional[str] = None
  type: Optional[str] = None
  is_done: bool
  tags: Optional[list[str]] = None
  user_id: UUID
  
  model_config = {
    "from_attributes": True
  }

class CreateMemoRequest(BaseModel):
  title: str
  content: Optional[str] = None
  type: Optional[str] = None
  is_done: bool
  tags: Optional[list[str]] = None
  
  @field_validator("title")
  def check_title(cls, v):
    if not v or v.strip() == "":
      raise ValueError("Title is required")
    return v
