from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

def validation_exception_handler(request: Request, exc: RequestValidationError):
  # エラー内容を1つ目だけ取得
  first_error = exc.errors()[0]
  field = first_error.get("loc")[-1]  # body → field名
  msg = first_error.get("msg")        # エラーメッセージ

  errors = [f"{e['loc'][-1]}: {e['msg']}" for e in exc.errors()]
  return JSONResponse(
    status_code=422,
    content={
      "success": False,
      "error": "; ".join(errors)
    }
  )