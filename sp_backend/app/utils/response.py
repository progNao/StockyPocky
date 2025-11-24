from fastapi.responses import JSONResponse
from app.schemas.response import ErrorResponse

def success(data):
  return {"success": True, "data": data}

def error(message: str, status_code: int = 400):
  return JSONResponse(
    status_code=status_code,
    content=ErrorResponse(error=message).model_dump()
  )
