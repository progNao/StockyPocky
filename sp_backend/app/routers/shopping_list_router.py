from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.v1.shopping_list_api import create_shopping_list_api, delete_shopping_list_api, get_shopping_list_api, get_shopping_lists_api, update_shopping_list_api
from app.models.user import User
from app.schemas.response import SuccessResponse
from app.schemas.shopping_list import ShoppingListCheckRequest, ShoppingListRequest
from app.utils.auth import get_current_user
from database import get_db

router = APIRouter(prefix="/shopping-list", tags=["shopping-list"], dependencies=[Depends(get_current_user)])

@router.get("", response_model=SuccessResponse)
def get_shopping_lists(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
  return get_shopping_lists_api(db, current_user)

@router.get("/{shopping_list_id}", response_model=SuccessResponse)
def get_shopping_list(shopping_list_id: int, db: Session = Depends(get_db)):
  return get_shopping_list_api(shopping_list_id, db)

@router.post("", response_model=SuccessResponse)
def create_shopping_list(request: ShoppingListRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
  return create_shopping_list_api(request, db, current_user)

@router.put("/{shopping_list_id}", response_model=SuccessResponse)
def update_shopping_list(shopping_list_id: int, request: ShoppingListCheckRequest, db: Session = Depends(get_db)):
  return update_shopping_list_api(shopping_list_id, request, db)

@router.delete("/{shopping_list_id}", response_model=SuccessResponse)
def delete_shopping_list(shopping_list_id: int, db: Session = Depends(get_db)):
  return delete_shopping_list_api(shopping_list_id, db)