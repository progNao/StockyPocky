# ===============
# GetStockHistory
# ===============

async def test_get_stock_history_success(auth_client):
  item = await __create_category_item_stock(auth_client)
  await auth_client.post(f"/api/v1/items/{item.json()["data"]["id"]}/stock-history", json={
    "change": 10,
    "reason": "testreason",
    "memo": "test"
  })
  await auth_client.post(f"/api/v1/items/{item.json()["data"]["id"]}/stock-history", json={
    "change": 10,
    "reason": "testreason",
    "memo": "test"
  })
  await auth_client.post(f"/api/v1/items/{item.json()["data"]["id"]}/stock-history", json={
    "change": 10,
    "reason": "testreason",
    "memo": "test"
  })
  response = await auth_client.get(f"/api/v1/items/{item.json()["data"]["id"]}/stock-history")
  assert response.status_code == 200
  data = response.json()
  assert data["success"]
  assert isinstance(data["data"], list)
  assert len(data["data"]) == 3

# ===============
# CreateStockHistory
# ===============

async def test_create_stock_history_success(auth_client):
  item = await __create_category_item_stock(auth_client)
  response = await auth_client.post(f"/api/v1/items/{item.json()["data"]["id"]}/stock-history", json={
    "change": 10,
    "reason": "testreason",
    "memo": "test"
  })
  assert response.status_code == 200
  data = response.json()
  assert data["success"]
  assert data["data"]["change"] == 10
  assert data["data"]["reason"] == "testreason"
  assert data["data"]["memo"] == "test"

async def test_create_stock_history_reason_empty(auth_client):
  item = await __create_category_item_stock(auth_client)
  response = await auth_client.post(f"/api/v1/items/{item.json()["data"]["id"]}/stock-history", json={
    "change": 10,
    "reason": "",
    "memo": "test"
  })
  assert response.status_code == 422
  data = response.json()
  assert data["success"] is False

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