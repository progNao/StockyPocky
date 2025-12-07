"use client";

import {
  Box,
  Typography,
  IconButton,
  Card,
  CardMedia,
  CardContent,
  Snackbar,
  Alert,
  Fab,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AddIcon from "@mui/icons-material/Add";
import { Item, ShoppingList, ShoppingListDisplay } from "../types";
import { api } from "@/libs/api/client";
import LoadingScreen from "@/components/LoadingScreen";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

export default function ShoppingListPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [lowStockItemList, setLowStockItemList] = useState<
    ShoppingListDisplay[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  // チェック状態を item.id ごとに管理
  const [checkedItems, setCheckedItems] = useState<{ [key: number]: boolean }>(
    {}
  );

  const mergeItemData = (
    dataItems: Item[],
    dataShopping: ShoppingList[]
  ): ShoppingListDisplay[] => {
    const itemMap = new Map(dataItems.map((i: Item) => [i.id, i]));
    const result: ShoppingListDisplay[] = dataShopping.map((shopping) => {
      const item = itemMap.get(shopping.item_id);
      return {
        id: shopping.id,
        quantity: shopping.quantity,
        checked: shopping.checked,
        user_id: shopping.user_id,
        item_id: shopping.item_id,
        name: item ? item.name : "",
        image_url: item ? item.image_url : "",
        notes: item ? item.notes : "",
      };
    });
    return result;
  };

  // チェック切り替え
  const handleUpdate = async (id: number) => {
    setLoading(true);

    // 更新後の値を計算（ここが重要）
    const newChecked = !checkedItems[id];

    // UI の更新
    setCheckedItems((prev) => ({
      ...prev,
      [id]: newChecked,
    }));

    try {
      // 👈 PUT には newChecked を送る（最新値）
      await api.put(`/shopping-list/${id}`, {
        checked: newChecked,
      });

      setOpenSnackbar(true);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        setError("サーバーエラーが発生しました。");
        setOpenErrorSnackbar(true);
        return;
      }
      setError("ネットワークエラーが発生しました。");
      setOpenErrorSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setLoading(true);

      // APIへ削除リクエスト
      await api.delete(`/shopping-list/${id}`);

      // UI側から削除（再取得しないでOK）
      setLowStockItemList((prev) => prev.filter((item) => item.id !== id));

      setOpenSnackbar(true);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        setError("削除に失敗しました。");
        setOpenErrorSnackbar(true);
        return;
      }
      setError("ネットワークエラーが発生しました。");
      setOpenErrorSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);

        const resShopping = await api.get("/shopping-list");
        const dataShopping = resShopping.data.data;

        const resItems = await api.get("/items");
        const dataItems = resItems.data.data;

        const mergeData = mergeItemData(dataItems, dataShopping);

        // UI に表示
        setLowStockItemList(mergeData);

        // 👉 checkedItems の初期値をセット
        const initialChecked: { [key: number]: boolean } = {};
        mergeData.forEach((item) => {
          initialChecked[item.id] = item.checked; // API 値そのまま反映
        });
        setCheckedItems(initialChecked);
      } catch (err) {
        setError("データ取得エラー：" + err);
        setOpenErrorSnackbar(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <Box
      sx={{
        backgroundColor: "#F2FFF5",
        minHeight: "100vh",
        padding: 3,
        maxWidth: "100vw",
        overflowX: "hidden",
      }}
    >
      {/* ヘッダー */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 3,
        }}
      >
        {/* 左スペース（戻るボタン） */}
        <IconButton
          onClick={() => router.push("/dashboard")}
          sx={{ color: "#154718" }}
        >
          <ArrowBackIosNewIcon />
        </IconButton>

        {/* タイトル */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            textAlign: "center",
            color: "#154718",
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          買い物リスト
        </Typography>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={2500}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          更新しました
        </Alert>
      </Snackbar>

      <Snackbar
        open={openErrorSnackbar}
        autoHideDuration={2500}
        onClose={() => setOpenErrorSnackbar(false)}
      >
        <Alert severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>

      {/* アイテムリスト */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {lowStockItemList.length === 0 ? (
          <Typography sx={{ color: "#7A7A7A", textAlign: "center", mt: 4 }}>
            在庫不足のアイテムはありません
          </Typography>
        ) : (
          lowStockItemList.map((item) => (
            <Card
              key={item.id}
              sx={{
                display: "flex",
                alignItems: "center",
                borderRadius: "16px",
                padding: 1.5,
                backgroundColor: "#FFFFFF",
                boxShadow: "0px 1px 4px rgba(0,0,0,0.05)",
                minHeight: 70,
              }}
            >
              {/* 画像 */}
              <CardMedia
                component="img"
                image={item.image_url}
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "10px",
                  objectFit: "cover",
                }}
              />

              {/* 名称 + 購入数 */}
              <CardContent
                sx={{
                  flex: 1,
                  padding: "8px 0 8px 12px",
                  "&:last-child": { paddingBottom: "8px" },
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Typography
                  sx={{ fontSize: 16, fontWeight: 700, lineHeight: 1.2 }}
                >
                  {item.name}
                </Typography>
                <Typography sx={{ fontSize: 13, lineHeight: 1.2 }}>
                  購入数：{item.quantity}
                </Typography>
              </CardContent>

              {/* メモ */}
              <Box
                sx={{
                  minWidth: 120,
                  paddingLeft: 1,
                  paddingRight: 1.5,
                  display: "flex",
                  alignItems: "center",
                  border: item.notes ? "1px solid #00000020" : "",
                  borderRadius: "6px",
                }}
              >
                <Typography
                  sx={{
                    fontSize: 12,
                    color: "#555",
                    whiteSpace: "pre-line",
                    wordBreak: "break-word",
                  }}
                >
                  {item.notes || ""}
                </Typography>
              </Box>

              {/* 右側：チェック（上）＋ 削除（下） */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  marginLeft: 1,
                  justifyContent: "space-between",
                  height: "60px",
                }}
              >
                {/* ✔ チェック */}
                <IconButton
                  onClick={() => handleUpdate(item.id)}
                  sx={{
                    color: checkedItems[item.id] ? "#32D26A" : "#B7B7B7",
                  }}
                >
                  {checkedItems[item.id] ? (
                    <CheckBoxIcon />
                  ) : (
                    <CheckBoxOutlineBlankIcon />
                  )}
                </IconButton>

                {/* 🗑 削除 */}
                <IconButton
                  onClick={() => handleDelete(item.id)}
                  sx={{ color: "#D9534F" }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Card>
          ))
        )}
      </Box>

      {/* 右下の追加ボタン */}
      <Fab
        color="success"
        onClick={() => router.push("/shopping-list/new")}
        sx={{
          position: "fixed",
          bottom: 40,
          right: 30,
          backgroundColor: "#3ECF8E",
        }}
      >
        <AddIcon sx={{ fontSize: 32 }} />
      </Fab>
    </Box>
  );
}
