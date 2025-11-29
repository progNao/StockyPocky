from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.v1.stock_api import get_stocks_api
from app.models.user import User
from app.schemas.response import SuccessResponse
from app.utils.auth import get_current_user
from database import get_db


router = APIRouter(prefix="/stocks", tags=["stocks"], dependencies=[Depends(get_current_user)])

@router.get("", response_model=SuccessResponse)
def get_stocks(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
  return get_stocks_api(db, current_user)