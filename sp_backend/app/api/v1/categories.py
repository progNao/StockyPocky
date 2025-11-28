from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from app.models.category import Category
from app.models.user import User
from app.repositories.categories_repo import create_category, delete_category, get_categories, get_category_by_id, update_category
from app.schemas.category import CategoryResponse, CreateCategoryRequest, UpdateCategoryRequest
from app.utils.response import error, success

def get_categories_api(db: Session):
  categories = get_categories(db)
  response = [CategoryResponse.model_validate(c) for c in categories]
  return success(response)

def get_category_api(category_id: int, db: Session):
  category = __private_category_check(category_id, db)
  
  if isinstance(category, JSONResponse):
    return category
  
  return success(CategoryResponse.model_validate(category))

def create_category_api(request: CreateCategoryRequest, db: Session, current_user: User):
  new_category = Category(
    name=request.name,
    icon=request.icon,
    user_id=current_user.id
  )

  try:
    create_category(new_category, db)
    return success(CategoryResponse.model_validate(new_category))
  except Exception:
    db.rollback()
    return error("db_error", 500)

def update_category_api(request: UpdateCategoryRequest, db: Session):
  category = __private_category_check(request.id, db)
  
  if isinstance(category, JSONResponse):
    return category

  if request.name:
    category.name = request.name
  if request.icon:
    category.icon = request.icon
    
  try:
    response = update_category(category, db)
    return success(CategoryResponse.model_validate(response))
  except Exception:
    db.rollback()
    return error("db_error", 500)

def delete_category_api(category_id: int, db: Session):
  category = __private_category_check(category_id, db)
  
  if isinstance(category, JSONResponse):
    return category
  
  try:
    delete_category(category, db)
    return success(CategoryResponse.model_validate(category))
  except Exception:
    db.rollback()
    return error("db_error", 500)

# private

def __private_category_check(category_id: int, db: Session):
  category = get_category_by_id(category_id, db)
  
  if not category:
    return error("Category not found", 404)
  else:
    return category
