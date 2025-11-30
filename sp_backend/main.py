from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from app.core.exception_handlers import validation_exception_handler
from app.routers import auth_router, category_router, item_router, shopping_record_router, stock_router, user_router
from app.routers.test import test_router

app = FastAPI(title="StockyPocky")

routers = [user_router, auth_router, category_router, item_router, stock_router, shopping_record_router, test_router]

for r in routers:
  app.include_router(r.router, prefix="/api/v1")

app.add_exception_handler(RequestValidationError, validation_exception_handler)