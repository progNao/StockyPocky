# ===============
# GetShoppingLists
# ===============

async def test_get_shopping_lists_success(auth_client):
  item = await __create_category_item_stock(auth_client)
  await auth_client.post("/api/v1/shopping-list", json={
    "item_id": item.json()["data"]["id"],
    "quantity": 10
  })
  await auth_client.post("/api/v1/shopping-list", json={
    "item_id": item.json()["data"]["id"],
    "quantity": 10
  })
  await auth_client.post("/api/v1/shopping-list", json={
    "item_id": item.json()["data"]["id"],
    "quantity": 10
  })
  response = await auth_client.get("/api/v1/shopping-list")
  assert response.status_code == 200
  data = response.json()
  assert data["success"]
  assert isinstance(data["data"], list)
  assert len(data["data"]) == 1

# ===============
# GetShoppingList
# ===============

async def test_get_shopping_list_success(auth_client):
  item = await __create_category_item_stock(auth_client)
  list = await auth_client.post("/api/v1/shopping-list", json={
    "item_id": item.json()["data"]["id"],
    "quantity": 10
  })
  response = await auth_client.get(f"/api/v1/shopping-list/{list.json()["data"]["id"]}")
  assert response.status_code == 200
  data = response.json()
  assert data["success"]
  assert data["data"]["quantity"] == 10

# ===============
# CreateShoppingList
# ===============

async def test_create_shopping_list_success(auth_client):
  item = await __create_category_item_stock(auth_client)
  response = await auth_client.post("/api/v1/shopping-list", json={
    "item_id": item.json()["data"]["id"],
    "quantity": 10
  })
  assert response.status_code == 200
  data = response.json()
  assert data["success"]
  assert data["data"]["quantity"] == 10

# ===============
# UpdateShoppingList
# ===============

async def test_update_shopping_list_success(auth_client):
  item = await __create_category_item_stock(auth_client)
  list = await auth_client.post("/api/v1/shopping-list", json={
    "item_id": item.json()["data"]["id"],
    "quantity": 10
  })
  response = await auth_client.put(f"/api/v1/shopping-list/{list.json()["data"]["id"]}", json={
    "checked": True
  })
  assert response.status_code == 200
  data = response.json()
  assert data["success"]
  assert data["data"]["checked"] == True

async def test_delete_shopping_list_success(auth_client):
  item = await __create_category_item_stock(auth_client)
  list = await auth_client.post("/api/v1/shopping-list", json={
    "item_id": item.json()["data"]["id"],
    "quantity": 10
  })
  response = await auth_client.delete(f"/api/v1/shopping-list/{list.json()["data"]["id"]}")
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