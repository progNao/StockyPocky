from fastapi import FastAPI
from routers import auth_router, user_router

app = FastAPI()

routers = [user_router, auth_router]

for r in routers:
  app.include_router(r.router, prefix="/api/v1")