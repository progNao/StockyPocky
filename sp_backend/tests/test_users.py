# ===============
# GetUsers
# ===============

async def test_get_users_success(auth_client):
  await auth_client.post("/api/v1/auth/signup", json={
    "email": "test1@example.com",
    "password": "password",
    "name": "get_users_1"
  })
  await auth_client.post("/api/v1/auth/signup", json={
    "email": "test2@example.com",
    "password": "password",
    "name": "get_users_2"
  })
  await auth_client.post("/api/v1/auth/signup", json={
    "email": "test3@example.com",
    "password": "password",
    "name": "get_users_3"
  })
  response = await auth_client.get("/api/v1/users")
  assert response.status_code == 200
  data = response.json()
  assert data["success"]
  assert isinstance(data["data"], list)
  assert len(data["data"]) == 4

# ===============
# GetUser
# ===============

async def test_get_user_success(auth_client):
  json={
    "email": "getUser@example.com",
    "password": "password",
    "name": "getUser"
  }
  uuid = await __create_user_get_id(json, auth_client)
  response = await auth_client.get(f"/api/v1/users/{uuid}")
  assert response.status_code == 200
  data = response.json()
  assert data["success"]
  assert data["data"]["email"] == "getUser@example.com"
  assert data["data"]["name"] == "getUser"

# ===============
# UpdateUser
# ===============

async def test_update_user_success(auth_client):
  json={
    "email": "updateUser@example.com",
    "password": "password",
    "name": "updateUser"
  }
  uuid = await __create_user_get_id(json, auth_client)
  response = await auth_client.put(f"/api/v1/users/{uuid}", json={
    "email": "Update@example.com",
    "password": "password",
    "name": "Update"
  })
  assert response.status_code == 200
  data = response.json()
  assert response.json()["success"]
  assert data["data"]["email"] == "Update@example.com"
  assert data["data"]["name"] == "Update"

async def test_update_duplicate_email(auth_client):
  await auth_client.post("/api/v1/auth/signup", json={
    "email": "duptest@example.com",
    "password": "password",
    "name": "duptest"
  })
  json={
    "email": "dupemail@example.com",
    "password": "password",
    "name": "dupEmail"
  }
  uuid = await __create_user_get_id(json, auth_client)
  response = await auth_client.put(f"/api/v1/users/{uuid}", json={
    "email": "duptest@example.com",
    "password": "password",
    "name": "dupdup"
  })
  assert response.status_code == 409
  data = response.json()
  assert data["success"] is False
  assert "email already registered" in data["error"].lower()

async def test_update_duplicate_name(auth_client):
  await auth_client.post("/api/v1/auth/signup", json={
    "email": "duptest2_user@example.com",
    "password": "password",
    "name": "duptest2_user"
  })
  json={
    "email": "dupname_user@example.com",
    "password": "password",
    "name": "dupNameUser"
  }
  uuid = await __create_user_get_id(json, auth_client)
  response = await auth_client.put(f"/api/v1/users/{uuid}", json={
    "email": "dupname_user@example.com",
    "password": "password",
    "name": "duptest2_user"
  })
  assert response.status_code == 409
  data = response.json()
  assert data["success"] is False
  assert "name already registered" in data["error"].lower()

async def test_update_invalid_email(auth_client):
  json={
    "email": "invalidEmail@example.com",
    "password": "password",
    "name": "invalidEmail"
  }
  uuid = await __create_user_get_id(json, auth_client)
  response = await auth_client.put(f"/api/v1/users/{uuid}", json={
    "email": "aaexampleacom",
    "password": "password",
    "name": "invalidEmail"
  })
  assert response.status_code == 422
  data = response.json()
  assert data["success"] is False

async def test_update_short_password(auth_client):
  json={
    "email": "shortPass@example.com",
    "password": "password",
    "name": "shortPass"
  }
  uuid = await __create_user_get_id(json, auth_client)
  response = await auth_client.put(f"/api/v1/users/{uuid}", json={
    "email": "shortPass@example.com",
    "password": "pass",
    "name": "shortPass"
  })
  assert response.status_code == 422
  data = response.json()
  assert data["success"] is False

# ===============
# DeleteUser
# ===============

async def test_delete_user_success(auth_client):
  json={
    "email": "deleteUser@example.com",
    "password": "password",
    "name": "deleteUser"
  }
  uuid = await __create_user_get_id(json, auth_client)
  response = await auth_client.delete(f"/api/v1/users/{uuid}")
  assert response.status_code == 200
  data = response.json()
  assert data["success"]
  assert data["data"]["email"] == "deleteUser@example.com"

async def test_delete_notfound_user(auth_client):
  json={
    "email": "notfoundUser@example.com",
    "password": "password",
    "name": "notfound"
  }
  uuid = "3fa85f64-5717-4562-b3fc-2c963f66afa6"
  response = await auth_client.delete(f"/api/v1/users/{uuid}")
  assert response.status_code == 404
  assert response.json()["success"] is False

# private

async def __create_user_get_id(obj, auth_client):
  await auth_client.post("/api/v1/auth/signup", json=obj)
  users = await auth_client.get("/api/v1/users")
  uuid = users.json()["data"][-1]['id']
  return uuid