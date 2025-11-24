import pytest

# ===============
# Signup
# ===============

async def test_signup_success(client):
  response = await client.post("/api/v1/auth/signup", json={
    "email": "test@example.com",
    "password": "password",
    "name": "SuccessSignup"
  })
  assert response.status_code == 200
  data = response.json()
  assert data["success"]
  assert data["data"]["email"] == "test@example.com"


async def test_signup_duplicate_email(client):
  # 1回目成功
  await client.post("/api/v1/auth/signup", json={
    "email": "dup@example.com",
    "password": "password",
    "name": "dup_email_first"
  })
  # 2回目失敗
  response = await client.post("/api/v1/auth/signup", json={
      "email": "dup@example.com",
      "password": "password",
      "name": "dup_email_second"
  })
  assert response.status_code == 409
  data = response.json()
  assert data["success"] is False
  assert "email already registered" in data["error"].lower()


async def test_signup_duplicate_name(client):
  # 1回目成功
  await client.post("/api/v1/auth/signup", json={
    "email": "dupFirst@example.com",
    "password": "password",
    "name": "dupName"
  })
  # 2回目失敗
  response = await client.post("/api/v1/auth/signup", json={
      "email": "dupSecond@example.com",
      "password": "password",
      "name": "dupName"
  })
  assert response.status_code == 409
  data = response.json()
  assert data["success"] is False
  assert "name already registered" in data["error"].lower()


async def test_signup_invalid_email(client):
  response = await client.post("/api/v1/auth/signup", json={
    "email": "invalid-email",
    "password": "password",
    "name": "invalidEmailSignup"
  })
  assert response.status_code == 422


async def test_signup_short_password(client):
  response = await client.post("/api/v1/auth/signup", json={
    "email": "short@example.com",
    "password": "1",
    "name": "shortPasswordSignup"
  })
  assert response.status_code == 422


# ===============
# Login
# ===============

async def test_login_success(client):
  # 事前にユーザー作成
  await client.post("/api/v1/auth/signup", json={
    "email": "login@example.com",
    "password": "password",
    "name": "loginSuccess"
  })
  response = await client.post("/api/v1/auth/login", json={
    "email": "login@example.com",
    "password": "password"
  })
  assert response.status_code == 200
  data = response.json()
  assert data["success"]
  token = data["data"]
  assert isinstance(token, str)
  assert token.startswith("Bearer ")


async def test_login_wrong_password(client):
  # 事前にユーザー作成
  await client.post("/api/v1/auth/signup", json={
    "email": "wrongpass@example.com",
    "password": "password",
    "name": "loginWrongPassword"
  })
  response = await client.post("/api/v1/auth/login", json={
    "email": "wrongpass@example.com",
    "password": "incorrect"
  })
  assert response.status_code == 401
  assert not response.json()["success"]


async def test_login_not_found(client):
  response = await client.post("/api/v1/auth/login", json={
    "email": "notfound@example.com",
    "password": "password"
  })
  assert response.status_code == 404


async def test_login_invalid_email_format(client):
  response = await client.post("/api/v1/auth/login", json={
    "email": "invalid-format",
    "password": "password"
  })
  assert response.status_code == 422


async def test_login_short_password(client):
  # 事前にユーザー作成
  await client.post("/api/v1/auth/signup", json={
    "email": "shortpass@example.com",
    "password": "password",
    "name": "loginShortPassword"
  })
  response = await client.post("/api/v1/auth/login", json={
    "email": "shortpass@example.com",
    "password": "1"
  })
  assert response.status_code == 422