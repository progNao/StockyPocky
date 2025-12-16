from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from app.core.exception_handlers import validation_exception_handler
from app.routers import category_router, item_router, memo_router, shopping_list_router, shopping_record_router, stock_router, user_router
from app.routers.test import test_router
from fastapi.middleware.cors import CORSMiddleware

from firebase import init_firebase

app = FastAPI(title="StockyPocky")
init_firebase()

origins = [
  "*",
]

app.add_middleware(
  CORSMiddleware,
  allow_origins=origins,
  # 認証情報のアクセスを許可(今回は必要ない)
  allow_credentials=True,
  # 全てのリクエストメソッドを許可(["GET", "POST"]など個別指定も可能)
  allow_methods=["*"],
  # アクセス可能なレスポンスヘッダーを設定（今回は必要ない）
  allow_headers=["*"],
)

routers = [user_router, category_router, item_router, stock_router, shopping_record_router, shopping_list_router, memo_router, test_router]

for r in routers:
  app.include_router(r.router, prefix="/api/v1")

app.add_exception_handler(RequestValidationError, validation_exception_handler)