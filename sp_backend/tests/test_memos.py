# ===============
# GetMemos
# ===============

async def test_get_memos_success(auth_client):
  await __create_memo(auth_client)
  await __create_memo(auth_client)
  await __create_memo(auth_client)
  response = await auth_client.get("/api/v1/memos")
  assert response.status_code == 200
  data = response.json()
  assert data["success"]
  assert isinstance(data["data"], list)
  assert len(data["data"]) == 3

# ===============
# GetMemo
# ===============

async def test_get_memo_success(auth_client):
  res = await __create_memo(auth_client)
  response = await auth_client.get(f"/api/v1/memos/{res.json()["data"]["id"]}")
  assert response.status_code == 200
  data = response.json()
  assert data["success"]
  assert data["data"]["title"] == "title"
  assert data["data"]["content"] == "content"

# ===============
# CreateMemo
# ===============

async def test_create_memo_success(auth_client):
  response = await __create_memo(auth_client)
  assert response.status_code == 200
  data = response.json()
  assert data["success"]
  assert data["data"]["title"] == "title"
  assert data["data"]["content"] == "content"

async def test_create_category_title_check(auth_client):
  response = await auth_client.post("/api/v1/memos", json={
    "title": "",
    "content": "content",
    "type": "type",
    "is_done": False,
    "tags": [
      "test",
      "test2"
    ]
  })
  assert response.status_code == 422
  data = response.json()
  assert data["success"] is False

# ===============
# UpdateMemo
# ===============

async def test_update_memo_success(auth_client):
  memo = await __create_memo(auth_client)
  response = await auth_client.put(f"/api/v1/memos/{memo.json()["data"]["id"]}", json={
    "title": "update",
    "content": "content",
    "type": "type",
    "is_done": True,
    "tags": [
      "test",
      "test2"
    ]
  })
  assert response.status_code == 200
  data = response.json()
  assert data["success"]
  assert data["data"]["title"] == "update"
  assert data["data"]["is_done"] == True
  

async def test_update_memo_title_check(auth_client):
  memo = await __create_memo(auth_client)
  response = await auth_client.put(f"/api/v1/memos/{memo.json()["data"]["id"]}", json={
    "title": "",
    "content": "content",
    "type": "type",
    "is_done": True,
    "tags": [
      "test",
      "test2"
    ]
  })
  assert response.status_code == 422
  data = response.json()
  assert data["success"] is False

# ===============
# DeleteMemo
# ===============

async def test_delete_memo_success(auth_client):
  memo = await __create_memo(auth_client)
  response = await auth_client.delete(f"/api/v1/memos/{memo.json()["data"]["id"]}")
  assert response.status_code == 200
  data = response.json()
  assert data["success"]

# private

async def __create_memo(auth_client):
  memo = await auth_client.post("/api/v1/memos", json={
    "title": "title",
    "content": "content",
    "type": "type",
    "is_done": False,
    "tags": [
      "test",
      "test2"
    ]
  })
  return memo