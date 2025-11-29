# ===============
# GetStocks
# ===============

async def test_get_stocks_success(auth_client):
  await __create_category_item_stock(auth_client)
  await __create_category_item_stock(auth_client)
  await __create_category_item_stock(auth_client)
  response = await auth_client.get("/api/v1/stocks")
  assert response.status_code == 200
  data = response.json()
  assert data["success"]
  assert isinstance(data["data"], list)
  assert len(data["data"]) == 3

# ===============
# GetStock
# ===============

async def test_get_stock_success(auth_client):
  item = await __create_category_item_stock(auth_client)
  response = await auth_client.get(f"/api/v1/items/{item.json()["data"]["id"]}/stock")
  assert response.status_code == 200
  data = response.json()
  assert data["success"]
  assert data["data"]["location"] =="test"

# ===============
# UpdateStock
# ===============

async def test_update_stock_success(auth_client):
  item = await __create_category_item_stock(auth_client)
  response = await auth_client.put(f"/api/v1/items/{item.json()["data"]["id"]}/stock", json={
    "quantity": 100,
    "threshold": 200,
    "location": "update"
  })
  assert response.status_code == 200
  data = response.json()
  assert data["success"]
  assert data["data"]["quantity"] == 100
  assert data["data"]["threshold"] == 200
  assert data["data"]["location"] == "update"

async def test_update_stock_location_empty(auth_client):
  item = await __create_category_item_stock(auth_client)
  response = await auth_client.put(f"/api/v1/items/{item.json()["data"]["id"]}/stock", json={
    "quantity": 100,
    "threshold": 200,
    "location": ""
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
  await auth_client.post(f"/api/v1/test/{item.json()["data"]["id"]}", json={
    "quantity": 10,
    "threshold": 20,
    "location": "test"
  })
  return item