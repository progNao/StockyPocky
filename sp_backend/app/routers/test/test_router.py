# Test用
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.test.test_api import create_stock_test_api
from app.models.user import User
from app.schemas.response import SuccessResponse
from app.schemas.stock import StockTestRequest
from app.utils.auth import get_current_user
from database import get_db

router = APIRouter(prefix="/test", tags=["test"], dependencies=[Depends(get_current_user)])

@router.post("/{item_id}", response_model=SuccessResponse)
def create_stock_test(item_id, request: StockTestRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
  return create_stock_test_api(item_id, request, db, current_user)