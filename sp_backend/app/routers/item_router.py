from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.v1.items_api import create_item_api, delete_item_api, get_item_api, get_items_api, get_stock_by_item_id_api, update_item_api, update_stock_api
from app.models.user import User
from app.schemas.item import ItemRequest
from app.schemas.response import SuccessResponse
from app.schemas.stock import StockRequest
from app.utils.auth import get_current_user
from database import get_db

router = APIRouter(prefix="/items", tags=["items"], dependencies=[Depends(get_current_user)])

@router.get("", response_model=SuccessResponse)
def get_items(category_id: int | None = None, is_favorite: bool | None = None, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
  return get_items_api(category_id, is_favorite, db, current_user)

@router.get("/{item_id}", response_model=SuccessResponse)
def get_item(item_id: int, db: Session = Depends(get_db)):
  return get_item_api(item_id, db)

@router.post("", response_model=SuccessResponse)
def create_item(request: ItemRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
  return create_item_api(request, db, current_user)

@router.put("/{item_id}", response_model=SuccessResponse)
def update_item(item_id: int, request: ItemRequest, db: Session = Depends(get_db)):
  return update_item_api(item_id, request, db)

@router.delete("/{item_id}", response_model=SuccessResponse)
def delete_item(item_id: int, db: Session = Depends(get_db)):
  return delete_item_api(item_id, db)

@router.get("/{item_id}/stock", response_model=SuccessResponse)
def get_stock_by_item_id(item_id: int, db: Session = Depends(get_db)):
  return get_stock_by_item_id_api(item_id, db)

@router.put("/{item_id}/stock", response_model=SuccessResponse)
def update_stock(item_id: int, request: StockRequest, db: Session = Depends(get_db)):
  return update_stock_api(item_id, request, db)