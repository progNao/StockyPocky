"use client";
import { useEffect, useState } from "react";
import { Box, Snackbar, Alert } from "@mui/material";
import { useRouter } from "next/navigation";
import { api } from "@/libs/api/client";
import axios from "axios";
import { Item } from "@/app/types";
import Header from "@/components/Header";
import PrimaryButton from "@/components/PrimaryButton";
import CountBox from "@/components/CountBox";
import SelectFieldInput from "@/components/SelectFieldInput";

export default function ShoppingListNewPage() {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [itemId, setItemId] = useState(0);
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (itemId == 0) {
      return "アイテムは必須です。";
    }
    return null;
  };

  const clear = () => {
    setQuantity(1);
  };

  const handleCreate = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      setOpenErrorSnackbar(true);
      return;
    }
    try {
      setLoading(true);
      await api.post("/shopping-list", {
        item_id: itemId,
        quantity,
      });
      clear();
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
      setOpenSnackbar(true);
    }
  };

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await api.get("/items");
        const data = await res.data.data;
        setItems(data);
      } catch (err) {
        setError("カテゴリ取得エラー:" + err);
        setOpenErrorSnackbar(true);
      }
    };

    fetchItems();
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#F2FFF5",
        padding: 3,
      }}
    >
      {/* ヘッダー */}
      <Header
        title="買い物リスト登録"
        onBackAction={() => router.push("/shopping-list")}
      />

      {/* アイテム */}
      <SelectFieldInput
        label="アイテム"
        value={itemId}
        onChange={setItemId}
        placeholder="アイテムを選択"
        options={items}
      />

      {/* 購入数 */}
      <CountBox
        label="購入数"
        value={quantity}
        onChange={(v: number) => setQuantity(v)}
      />

      {/* 登録ボタン */}
      <PrimaryButton onClick={handleCreate} loading={loading} label="登録" />

      <Snackbar
        open={openSnackbar}
        autoHideDuration={2500}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity="success">登録しました</Alert>
      </Snackbar>

      <Snackbar
        open={openErrorSnackbar}
        autoHideDuration={2500}
        onClose={() => setOpenErrorSnackbar(false)}
      >
        <Alert severity="error">{error}</Alert>
      </Snackbar>
    </Box>
  );
}
