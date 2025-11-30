# ===============
# GetShoppingRecords
# ===============

async def test_get_shopping_records_success(auth_client):
  item = await __create_category_item_stock(auth_client)
  await auth_client.post("/api/v1/shopping-records", json={
    "item_id": item.json()["data"]["id"],
    "quantity": 10,
    "price": 1000,
    "store": "test",
    "bought_at": "2025-11-30"
  })
  await auth_client.post("/api/v1/shopping-records", json={
    "item_id": item.json()["data"]["id"],
    "quantity": 10,
    "price": 1000,
    "store": "test",
    "bought_at": "2025-11-30"
  })
  await auth_client.post("/api/v1/shopping-records", json={
    "item_id": item.json()["data"]["id"],
    "quantity": 10,
    "price": 1000,
    "store": "test",
    "bought_at": "2025-11-30"
  })
  response = await auth_client.get("/api/v1/shopping-records")
  assert response.status_code == 200
  data = response.json()
  assert data["success"]
  assert isinstance(data["data"], list)
  assert len(data["data"]) == 3

# ===============
# GetShoppingRecord
# ===============

async def test_get_shopping_record_success(auth_client):
  item = await __create_category_item_stock(auth_client)
  record = await auth_client.post("/api/v1/shopping-records", json={
    "item_id": item.json()["data"]["id"],
    "quantity": 10,
    "price": 1000,
    "store": "test",
    "bought_at": "2025-11-30"
  })
  response = await auth_client.get(f"/api/v1/shopping-records/{record.json()["data"]["id"]}")
  assert response.status_code == 200
  data = response.json()
  assert data["success"]
  assert data["data"]["quantity"] == 10
  assert data["data"]["price"] == 1000
  assert data["data"]["store"] == "test"

# ===============
# CreateShoppingRecord
# ===============

async def test_create_shopping_record_success(auth_client):
  item = await __create_category_item_stock(auth_client)
  response = await auth_client.post("/api/v1/shopping-records", json={
    "item_id": item.json()["data"]["id"],
    "quantity": 10,
    "price": 1000,
    "store": "test",
    "bought_at": "2025-11-30"
  })
  assert response.status_code == 200
  data = response.json()
  assert data["success"]
  assert data["data"]["quantity"] == 10
  assert data["data"]["price"] == 1000
  assert data["data"]["store"] == "test"

async def test_create_shopping_record_store_empty(auth_client):
  item = await __create_category_item_stock(auth_client)
  response = await auth_client.post("/api/v1/shopping-records", json={
    "item_id": item.json()["data"]["id"],
    "quantity": 10,
    "price": 1000,
    "store": "",
    "bought_at": "2025-11-30"
  })
  assert response.status_code == 422
  data = response.json()
  assert data["success"] is False

# ===============
# UpdateShoppingRecord
# ===============

async def test_update_shopping_record_success(auth_client):
  item = await __create_category_item_stock(auth_client)
  record = await auth_client.post("/api/v1/shopping-records", json={
    "item_id": item.json()["data"]["id"],
    "quantity": 10,
    "price": 1000,
    "store": "test",
    "bought_at": "2025-11-30"
  })
  response = await auth_client.put(f"/api/v1/shopping-records/{record.json()["data"]["id"]}", json={
    "item_id": item.json()["data"]["id"],
    "quantity": 10,
    "price": 1000,
    "store": "update",
    "bought_at": "2025-11-30"
  })
  assert response.status_code == 200
  data = response.json()
  assert data["success"]
  assert data["data"]["quantity"] == 10
  assert data["data"]["price"] == 1000
  assert data["data"]["store"] == "update"

async def test_update_shopping_record_store_empty(auth_client):
  item = await __create_category_item_stock(auth_client)
  record = await auth_client.post("/api/v1/shopping-records", json={
    "item_id": item.json()["data"]["id"],
    "quantity": 10,
    "price": 1000,
    "store": "test",
    "bought_at": "2025-11-30"
  })
  response = await auth_client.put(f"/api/v1/shopping-records/{record.json()["data"]["id"]}", json={
    "item_id": item.json()["data"]["id"],
    "quantity": 10,
    "price": 1000,
    "store": "",
    "bought_at": "2025-11-30"
  })
  assert response.status_code == 422
  data = response.json()
  assert data["success"] is False

# ===============
# DeleteShoppingRecord
# ===============

async def test_delete_shopping_record_success(auth_client):
  item = await __create_category_item_stock(auth_client)
  record = await auth_client.post("/api/v1/shopping-records", json={
    "item_id": item.json()["data"]["id"],
    "quantity": 10,
    "price": 1000,
    "store": "test",
    "bought_at": "2025-11-30"
  })
  response = await auth_client.delete(f"/api/v1/shopping-records/{record.json()["data"]["id"]}")
  assert response.status_code == 200
  data = response.json()
  assert data["success"]

# Private

async def __create_category_item_stock(auth_client):
  category = await auth_client.post("/api/v1/categories", json={
    "name": "apple",
    "icon": "🍎"
  })
  item = await auth_client.post("/api/v1/items", json={
    "name": "testName",
    "brand": "brandName",
    "unit": "unitName",
    "image_url": "http://www.....",
    "default_quantity": 10,
    "notes": "noteName",
    "is_favorite": True,
    "category_id": category.json()["data"]["id"]
  })
  return item