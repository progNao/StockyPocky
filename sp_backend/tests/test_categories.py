# ===============
# GetCategories
# ===============

async def test_get_categories_success(auth_client):
  await auth_client.post("/api/v1/categories/", json={
    "name": "apple",
    "icon": "🍎"
  })
  await auth_client.post("/api/v1/categories/", json={
    "name": "orange",
    "icon": "🍊"
  })
  await auth_client.post("/api/v1/categories/", json={
    "name": "grapes",
    "icon": "🍇"
  })
  response = await auth_client.get("/api/v1/categories/")
  assert response.status_code == 200
  data = response.json()
  assert data["success"]
  assert isinstance(data["data"], list)

# ===============
# GetCategory
# ===============

async def test_get_category_success(auth_client):
  category = await auth_client.post("/api/v1/categories/", json={
    "name": "apple",
    "icon": "🍎"
  })
  response = await auth_client.get(f"/api/v1/categories/{category.json()["data"]["id"]}")
  assert response.status_code == 200
  data = response.json()
  assert data["success"]

# ===============
# CreateCategory
# ===============

async def test_create_category_success(auth_client):
  response = await auth_client.post("/api/v1/categories/", json={
    "name": "apple",
    "icon": "🍎"
  })
  assert response.status_code == 200
  data = response.json()
  assert data["success"]

async def test_create_category_name_check(auth_client):
  response = await auth_client.post("/api/v1/categories/", json={
    "name": "",
    "icon": "🍎"
  })
  assert response.status_code == 422
  data = response.json()
  assert data["success"] is False

async def test_create_category_name_null_check(auth_client):
  response = await auth_client.post("/api/v1/categories/", json={
    "icon": "🍎"
  })
  assert response.status_code == 422
  data = response.json()
  assert data["success"] is False

# ===============
# UpdateCategory
# ===============

async def test_update_category_success(auth_client):
  category = await auth_client.post("/api/v1/categories/", json={
    "name": "apple",
    "icon": "🍎"
  })
  response = await auth_client.put("/api/v1/categories/", json={
    "id": category.json()["data"]["id"],
    "name": "orange",
    "icon": "🍊"
  })
  assert response.status_code == 200
  data = response.json()
  assert data["success"]

async def test_update_category_name_check(auth_client):
  category = await auth_client.post("/api/v1/categories/", json={
    "name": "apple",
    "icon": "🍎"
  })
  response = await auth_client.put("/api/v1/categories/", json={
    "id": category.json()["data"]["id"],
    "name": "",
    "icon": "🍎"
  })
  assert response.status_code == 422
  data = response.json()
  assert data["success"] is False

async def test_update_category_name_null_check(auth_client):
  category = await auth_client.post("/api/v1/categories/", json={
    "name": "apple",
    "icon": "🍎"
  })
  response = await auth_client.put("/api/v1/categories/", json={
    "id": category.json()["data"]["id"],
    "icon": "🍎"
  })
  assert response.status_code == 422
  data = response.json()
  assert data["success"] is False

# ===============
# DeleteCategory
# ===============

async def test_delete_category_success(auth_client):
  category = await auth_client.post("/api/v1/categories/", json={
    "name": "apple",
    "icon": "🍎"
  })
  response = await auth_client.delete(f"/api/v1/categories/{category.json()["data"]["id"]}")
  assert response.status_code == 200
  data = response.json()
  assert data["success"]

async def test_delete_category_used_item(auth_client):
  category = await auth_client.post("/api/v1/categories/", json={
    "name": "apple",
    "icon": "🍎"
  })
  await auth_client.post("/api/v1/items/", json={
    "name": "testName",
    "brand": "brandName",
    "unit": "unitName",
    "image_url": "http://www.....",
    "default_quantity": 10,
    "notes": "noteName",
    "is_favorite": True,
    "category_id": category.json()["data"]["id"]
  })
  response = await auth_client.delete(f"/api/v1/categories/{category.json()["data"]["id"]}")
  assert response.status_code == 400
  data = response.json()
  assert data["success"] is False