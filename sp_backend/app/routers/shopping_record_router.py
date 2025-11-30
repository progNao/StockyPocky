from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.v1.shopping_records_api import create_shopping_record_api, delete_shopping_record_api, get_monthly_spending_api, get_shopping_record_api, get_shopping_records_api, get_spending_by_category_api, get_spending_by_item_api, update_shopping_record_api
from app.models.user import User
from app.schemas.response import SuccessResponse
from app.schemas.shopping_record import ShoppingRecordRequest
from app.utils.auth import get_current_user
from database import get_db

router = APIRouter(prefix="/shopping-records", tags=["shopping-records"], dependencies=[Depends(get_current_user)])

@router.get("", response_model=SuccessResponse)
def get_shopping_records(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
  return get_shopping_records_api(db, current_user)

@router.get("/{shopping_record_id}", response_model=SuccessResponse)
def get_shopping_record(shopping_record_id: int, db: Session = Depends(get_db)):
  return get_shopping_record_api(shopping_record_id, db)

@router.post("", response_model=SuccessResponse)
def create_shopping_record(request: ShoppingRecordRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
  return create_shopping_record_api(request, db, current_user)

@router.put("/{shopping_record_id}", response_model=SuccessResponse)
def update_shopping_record(shopping_record_id: int, request: ShoppingRecordRequest, db: Session = Depends(get_db)):
  return update_shopping_record_api(shopping_record_id, request, db)

@router.delete("/{shopping_record_id}", response_model=SuccessResponse)
def delete_shopping_record(shopping_record_id: int, db: Session = Depends(get_db)):
  return delete_shopping_record_api(shopping_record_id, db)

@router.get("/summary/monthly")
def monthly_summary(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
  return get_monthly_spending_api(db, current_user)

@router.get("/summary/items")
def item_summary(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
  return get_spending_by_item_api(db, current_user)

@router.get("/summary/categories")
def category_summary(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
  return get_spending_by_category_api(db, current_user)
