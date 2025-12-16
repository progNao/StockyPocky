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
} from "@mui/material";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Item, ShoppingList, ShoppingListDisplay } from "../types";
import { api } from "@/libs/api/client";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import FabButton from "@/components/FabButton";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useFormatDate } from "@/hooks/useFormatDate";

export default function ShoppingListPage() {
  const router = useRouter();
  const [lowStockItemList, setLowStockItemList] = useState<
    ShoppingListDisplay[]
  >([]);
  const [checkedItems, setCheckedItems] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const { formatDate } = useFormatDate();

  const handleDeletePush = (id: number) => {
    setDeleteTargetId(id);
    setOpenDelete(true);
  };

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
        added_at: shopping.added_at,
      };
    });
    return result;
  };

  // チェック切り替え
  const handleUpdate = async (id: number) => {
    const newChecked = !checkedItems[id];
    setCheckedItems((prev) => ({
      ...prev,
      [id]: newChecked,
    }));
    try {
      await api.put(`/shopping-list/${id}`, {
        checked: newChecked,
      });
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        setError("サーバーエラーが発生しました。");
        setOpenErrorSnackbar(true);
        return;
      }
      setError("ネットワークエラーが発生しました。");
      setOpenErrorSnackbar(true);
    } finally {
      setOpenSnackbar(true);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/shopping-list/${id}`);
      setLowStockItemList((prev) => prev.filter((item) => item.id !== id));
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        setError("サーバーエラーが発生しました。");
        setOpenErrorSnackbar(true);
        return;
      }
      setError("ネットワークエラーが発生しました。");
      setOpenErrorSnackbar(true);
    } finally {
      setOpenSnackbar(true);
    }
  };

  useEffect(() => {
    const fetchShoppingList = async () => {
      try {
        const res = (await api.get("/shopping-list")).data.data;
        const resItems = (await api.get("/items")).data.data;
        const mergeData = mergeItemData(resItems, res);
        setLowStockItemList(mergeData);
        const initialChecked: { [key: number]: boolean } = {};
        mergeData.forEach((item) => {
          initialChecked[item.id] = item.checked;
        });
        setCheckedItems(initialChecked);
      } catch (err) {
        setError("買い物リスト取得エラー：" + err);
        setOpenErrorSnackbar(true);
      }
    };

    fetchShoppingList();
  }, []);

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
      <Header
        title="買い物リスト"
        onBackAction={() => router.push("/dashboard")}
      />

      {/* アイテムリスト */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          marginBottom: 10,
        }}
      >
        {lowStockItemList.length === 0 ? (
          <Typography sx={{ color: "#7A7A7A", textAlign: "center", mt: 4 }}>
            買い物リストはありません
          </Typography>
        ) : (
          lowStockItemList.map((item) => (
            <Card
              key={item.id}
              sx={{
                p: 2,
                borderRadius: "20px",
                backgroundColor: "white",
                display: "flex",
                alignItems: "center",
              }}
            >
              <CardMedia
                component="img"
                image={item.image_url}
                sx={{
                  width: 50,
                  height: 50,
                  borderRadius: "10px",
                  objectFit: "cover",
                }}
              />
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
                <Typography sx={{ fontSize: 13, lineHeight: 1.2 }}>
                  {formatDate(item.added_at)}
                </Typography>
              </CardContent>

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

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  marginLeft: 1,
                  justifyContent: "space-between",
                  height: "60px",
                }}
              >
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

                <IconButton
                  onClick={() => handleDeletePush(item.id)}
                  sx={{ color: "#D9534F" }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Card>
          ))
        )}
      </Box>

      <FabButton onClick={() => router.push("/shopping-list/new")} />

      <Footer />

      <Snackbar
        open={openSnackbar}
        autoHideDuration={2500}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity="success">更新しました</Alert>
      </Snackbar>

      <Snackbar
        open={openErrorSnackbar}
        autoHideDuration={2500}
        onClose={() => setOpenErrorSnackbar(false)}
      >
        <Alert severity="error">{error}</Alert>
      </Snackbar>

      <ConfirmDialog
        open={openDelete}
        title="削除確認"
        message="買い物リストを削除します。"
        confirmText="削除する"
        variant="danger"
        onClose={() => setOpenDelete(false)}
        onConfirm={() => {
          handleDelete(deleteTargetId!);
          setOpenDelete(false);
        }}
      />
    </Box>
  );
}
