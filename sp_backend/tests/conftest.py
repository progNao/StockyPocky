import os
import pytest
from httpx import AsyncClient
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from main import app
from database import Base, get_db
from httpx._transports.asgi import ASGITransport 

TEST_DATABASE_URL = os.getenv("TEST_DATABASE_URL")

engine_test = create_engine(TEST_DATABASE_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine_test)

@pytest.fixture(scope="session", autouse=True)
def truncate_test_db():
  yield  # ← テスト実行
  # テスト終了後に全テーブルをtruncate
  with engine_test.begin() as conn:  # begin()でトランザクション + 自動commit
    for table in reversed(Base.metadata.sorted_tables):
      conn.execute(text(f'TRUNCATE TABLE "{table.name}" RESTART IDENTITY CASCADE;'))

# get_db を乗っ取る
def override_get_db():
  db = TestingSessionLocal()
  try:
    yield db
  finally:
    db.close()

app.dependency_overrides[get_db] = override_get_db

# 非同期クライアント
@pytest.fixture
async def client():
  transport = ASGITransport(app=app)
  async with AsyncClient(transport=transport, base_url="http://test") as ac:
    yield ac