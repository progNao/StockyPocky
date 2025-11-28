from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.v1.items import create_item_api, delete_item_api, get_item_api, get_items_api, update_item_api
from app.models.user import User
from app.schemas.item import ItemRequest
from app.schemas.response import SuccessResponse
from app.utils.auth import get_current_user
from database import get_db

router = APIRouter(prefix="/items", tags=["items"], dependencies=[Depends(get_current_user)])

@router.get("/", response_model=SuccessResponse)
def get_items(category_id: int | None = None, is_favorite: bool | None = None, db: Session = Depends(get_db)):
  return get_items_api(category_id, is_favorite, db)

@router.get("/{item_id}", response_model=SuccessResponse)
def get_item(item_id: int, db: Session = Depends(get_db)):
  return get_item_api(item_id, db)

@router.post("/", response_model=SuccessResponse)
def create_item(request: ItemRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
  return create_item_api(request, db, current_user)

@router.put("/{item_id}", response_model=SuccessResponse)
def update_item(item_id: int, request: ItemRequest, db: Session = Depends(get_db)):
  return update_item_api(item_id, request, db)

@router.delete("/{item_id}", response_model=SuccessResponse)
def delete_item(item_id: int, db: Session = Depends(get_db)):
  return delete_item_api(item_id, db)