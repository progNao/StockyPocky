# ===============
# GetItems
# ===============

async def test_get_items_success(auth_client):
  await auth_client.post("/api/v1/categories/", json={
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
    "category_id": 1
  })
  await auth_client.post("/api/v1/categories/", json={
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
    "category_id": 1
  })
  await auth_client.post("/api/v1/categories/", json={
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
    "category_id": 3
  })
  response = await auth_client.get("/api/v1/items/")
  assert response.status_code == 200
  data = response.json()
  assert data["success"]
  assert isinstance(data["data"], list)
  assert len(data["data"]) == 3

async def test_get_items_by_category_success(auth_client):
  await auth_client.post("/api/v1/categories/", json={
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
    "category_id": 1
  })
  await auth_client.post("/api/v1/categories/", json={
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
    "category_id": 2
  })
  await auth_client.post("/api/v1/categories/", json={
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
    "category_id": 2
  })
  response = await auth_client.get("/api/v1/items/?category_id=2")
  assert response.status_code == 200
  data = response.json()
  assert data["success"]
  assert isinstance(data["data"], list)
  assert len(data["data"]) == 2

async def test_get_items_by_favorite_success(auth_client):
  await auth_client.post("/api/v1/categories/", json={
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
    "is_favorite": False,
    "category_id": 1
  })
  await auth_client.post("/api/v1/categories/", json={
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
    "is_favorite": False,
    "category_id": 2
  })
  await auth_client.post("/api/v1/categories/", json={
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
    "category_id": 2
  })
  response = await auth_client.get("/api/v1/items/?is_favorite=false")
  assert response.status_code == 200
  data = response.json()
  assert data["success"]
  assert isinstance(data["data"], list)
  assert len(data["data"]) == 2

# ===============
# GetItem
# ===============

async def test_get_item_success(auth_client):
  await auth_client.post("/api/v1/categories/", json={
    "name": "apple",
    "icon": "🍎"
  })
  item = await auth_client.post("/api/v1/items/", json={
    "name": "testName",
    "brand": "brandName",
    "unit": "unitName",
    "image_url": "http://www.....",
    "default_quantity": 10,
    "notes": "noteName",
    "is_favorite": True,
    "category_id": 1
  })
  
  response = await auth_client.get(f"/api/v1/items/{item.json()["data"]["id"]}")
  assert response.status_code == 200
  data = response.json()
  assert data["success"]
  
async def test_get_item_not_found(auth_client):
  response = await auth_client.get(f"/api/v1/items/{30}")
  assert response.status_code == 404
  data = response.json()
  assert data["success"] is False

# ===============
# CreateItem
# ===============

async def test_create_item_success(auth_client):
  await auth_client.post("/api/v1/categories/", json={
    "name": "apple",
    "icon": "🍎"
  })
  response = await auth_client.post("/api/v1/items/", json={
    "name": "testName",
    "brand": "brandName",
    "unit": "unitName",
    "image_url": "http://www.....",
    "default_quantity": 10,
    "notes": "noteName",
    "is_favorite": True,
    "category_id": 1
  })
  assert response.status_code == 200
  data = response.json()
  assert data["success"]

async def test_create_item_name_required(auth_client):
  await auth_client.post("/api/v1/categories/", json={
    "name": "apple",
    "icon": "🍎"
  })
  response = await auth_client.post("/api/v1/items/", json={
    "name": "",
    "brand": "brandName",
    "unit": "unitName",
    "image_url": "http://www.....",
    "default_quantity": 10,
    "notes": "noteName",
    "is_favorite": True,
    "category_id": 1
  })
  assert response.status_code == 422
  data = response.json()
  assert data["success"] is False

# ===============
# UpdateItem
# ===============

async def test_update_item_success(auth_client):
  await auth_client.post("/api/v1/categories/", json={
    "name": "apple",
    "icon": "🍎"
  })
  item = await auth_client.post("/api/v1/items/", json={
    "name": "testName",
    "brand": "brandName",
    "unit": "unitName",
    "image_url": "http://www.....",
    "default_quantity": 10,
    "notes": "noteName",
    "is_favorite": True,
    "category_id": 1
  })
  response = await auth_client.put(f"/api/v1/items/{item.json()["data"]["id"]}", json={
    "name": "update",
    "brand": "brandName",
    "unit": "unitName",
    "image_url": "http://www.....",
    "default_quantity": 10,
    "notes": "noteName",
    "is_favorite": True,
    "category_id": 1
  })
  assert response.status_code == 200
  data = response.json()
  assert data["success"]
  assert data["data"]["name"] == "update"

async def test_update_item_name_required(auth_client):
  await auth_client.post("/api/v1/categories/", json={
    "name": "apple",
    "icon": "🍎"
  })
  item = await auth_client.post("/api/v1/items/", json={
    "name": "testName",
    "brand": "brandName",
    "unit": "unitName",
    "image_url": "http://www.....",
    "default_quantity": 10,
    "notes": "noteName",
    "is_favorite": True,
    "category_id": 1
  })
  response = await auth_client.put(f"/api/v1/items/{item.json()["data"]["id"]}", json={
    "name": "",
    "brand": "brandName",
    "unit": "unitName",
    "image_url": "http://www.....",
    "default_quantity": 10,
    "notes": "noteName",
    "is_favorite": True,
    "category_id": 1
  })
  assert response.status_code == 422
  data = response.json()
  assert data["success"] is False

async def test_update_item_not_found(auth_client):
  await auth_client.post("/api/v1/categories/", json={
    "name": "apple",
    "icon": "🍎"
  })
  item = await auth_client.post("/api/v1/items/", json={
    "name": "testName",
    "brand": "brandName",
    "unit": "unitName",
    "image_url": "http://www.....",
    "default_quantity": 10,
    "notes": "noteName",
    "is_favorite": True,
    "category_id": 1
  })
  response = await auth_client.put(f"/api/v1/items/{30}", json={
    "name": "testName",
    "brand": "brandName",
    "unit": "unitName",
    "image_url": "http://www.....",
    "default_quantity": 10,
    "notes": "noteName",
    "is_favorite": True,
    "category_id": 1
  })
  assert response.status_code == 404
  data = response.json()
  assert data["success"] is False

# ===============
# DeleteItem
# ===============

async def test_delete_item_success(auth_client):
  await auth_client.post("/api/v1/categories/", json={
    "name": "apple",
    "icon": "🍎"
  })
  item = await auth_client.post("/api/v1/items/", json={
    "name": "testName",
    "brand": "brandName",
    "unit": "unitName",
    "image_url": "http://www.....",
    "default_quantity": 10,
    "notes": "noteName",
    "is_favorite": True,
    "category_id": 1
  })
  response = await auth_client.delete(f"/api/v1/items/{item.json()["data"]["id"]}")
  assert response.status_code == 200
  data = response.json()
  assert data["success"]

async def test_delete_item_not_found(auth_client):
  await auth_client.post("/api/v1/categories/", json={
    "name": "apple",
    "icon": "🍎"
  })
  item = await auth_client.post("/api/v1/items/", json={
    "name": "testName",
    "brand": "brandName",
    "unit": "unitName",
    "image_url": "http://www.....",
    "default_quantity": 10,
    "notes": "noteName",
    "is_favorite": True,
    "category_id": 1
  })
  response = await auth_client.delete(f"/api/v1/items/{50}")
  assert response.status_code == 404
  data = response.json()
  assert data["success"] is False