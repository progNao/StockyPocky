from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends
from app.api.v1.categories_api import create_category_api, delete_category_api, get_categories_api, get_category_api, update_category_api
from app.models.user import User
from app.schemas.category import CreateCategoryRequest
from app.schemas.response import SuccessResponse
from app.utils.auth import get_current_user
from database import get_db


router = APIRouter(prefix="/categories", tags=["categories"], dependencies=[Depends(get_current_user)])

@router.get("", response_model=SuccessResponse)
def get_categories(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
  return get_categories_api(db, current_user)

@router.get("/{category_id}", response_model=SuccessResponse)
def get_category(category_id: int, db: Session = Depends(get_db)):
  return get_category_api(category_id, db)

@router.post("", response_model=SuccessResponse)
def create_category(request: CreateCategoryRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
  return create_category_api(request, db, current_user)

@router.put("/{category_id}", response_model=SuccessResponse)
def update_category(category_id, request: CreateCategoryRequest, db: Session = Depends(get_db)):
  return update_category_api(category_id, request, db)

@router.delete("/{category_id}", response_model=SuccessResponse)
def delete_category(category_id: int, db: Session = Depends(get_db)):
  return delete_category_api(category_id, db)
