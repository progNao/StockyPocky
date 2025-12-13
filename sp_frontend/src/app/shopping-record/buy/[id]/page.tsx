"use client";

import { use, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Divider,
  Card,
  Alert,
  Snackbar,
  CardMedia,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { api } from "@/libs/api/client";
import axios from "axios";
import { Item } from "@/app/types";
import LoadingScreen from "@/components/LoadingScreen";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import Header from "@/components/Header";
import PrimaryButton from "@/components/PrimaryButton";
import CountBox from "@/components/CountBox";
import ShoppingRecordEditComponent from "@/components/ShoppingRecordEditComponent";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function ItemBuyPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState<number | null>(null);
  const [store, setStore] = useState("");
  const [boughtAt, setBoughtAt] = useState("");
  const unwrapParams = use(params);
  const [item, setItem] = useState<Item>();
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const validate = () => {
    if (!quantity || !price || !store) {
      return "アイテム名、カテゴリ、初期在庫数は必須です。";
    }
    return null;
  };

  const toDatetimeLocal = (value: string | Date | undefined) => {
    if (!value) return "";
    const date = value instanceof Date ? value : new Date(value);
    const iso = date.toISOString().slice(0, 23);
    return iso;
  };

  const clear = () => {
    setQuantity(1);
    setPrice(null);
    setStore("");
  };

  function toISOStringWithZ(datetimeLocal: string) {
    if (!datetimeLocal) return null;
    const date = new Date(datetimeLocal);
    return date.toISOString();
  }

  const handleBuy = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      setOpenErrorSnackbar(true);
      return;
    }
    try {
      setLoading(true);
      await api.post("/shopping-records", {
        item_id: unwrapParams.id,
        quantity,
        price,
        store,
        bought_at: toISOStringWithZ(boughtAt),
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
      router.push("/item");
    }
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const Item = (await api.get(`/items/${unwrapParams.id}`)).data.data;
        setItem(Item);
      } catch (err) {
        setError("アイテム取得エラー:" + err);
        setOpenErrorSnackbar(true);
      }
    };
    fetch();
  }, [unwrapParams.id]);

  if (loading) return <LoadingScreen />;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#F2FFF5",
        padding: 3,
      }}
    >
      {/* ヘッダー */}
      <Header title="アイテム購入" onBackAction={() => router.back()} />

      {/* 画像 */}
      <Card
        sx={{
          m: 2,
          borderRadius: "24px",
        }}
      >
        <CardMedia
          component="img"
          image={item?.image_url}
          sx={{
            width: "100%",
            height: 360,
            objectFit: "cover",
            borderRadius: "24px",
          }}
        />
      </Card>

      {/* アイテム名 */}
      <Typography
        sx={{
          fontSize: 26,
          fontWeight: 800,
          textAlign: "center",
          mb: 3,
        }}
      >
        {item?.name}
      </Typography>

      {/* カード：購入数/金額 */}
      <Card
        sx={{
          borderRadius: "20px",
          padding: 2,
          mb: 4,
          boxShadow: "0px 2px 12px rgba(0,0,0,0.05)",
        }}
      >
        {/* 購入数 */}
        <CountBox
          label="購入数"
          value={quantity}
          onChange={(v: number) => setQuantity(v)}
        />

        <Divider />

        {/* 金額 */}
        <ShoppingRecordEditComponent
          label="金額"
          type="number"
          value={price ?? ""}
          onChange={(value: string) => setPrice(Number(value))}
          placeholder="500"
          required
        />

        <Divider />

        {/* 購入場所 */}
        <ShoppingRecordEditComponent
          label="購入場所"
          value={store}
          onChange={(value: string) => setStore(value)}
          placeholder="Amazon、ドラッグストア"
          required
        />

        <Divider />

        {/* 購入日時 */}
        <ShoppingRecordEditComponent
          type="datetime-local"
          label="購入日時"
          value={toDatetimeLocal(boughtAt)}
          onChange={(value: string) => setBoughtAt(value)}
          placeholder="2025/12/12 13:00"
          required
        />

        <Divider />

        {/* 合計金額 */}
        <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
          <CreditCardIcon sx={{ color: "#000", mr: 1 }} />
          <Typography sx={{ fontSize: 16, flex: 1 }}>合計金額</Typography>

          <Typography sx={{ fontSize: 18, fontWeight: 700 }}>
            ¥{price ? price * quantity : ""}
          </Typography>
        </Box>
      </Card>

      {/* 購入ボタン */}
      <PrimaryButton
        onClick={() => setOpen(true)}
        loading={loading}
        label="購入"
      />

      <Snackbar
        open={openSnackbar}
        autoHideDuration={2500}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity="success">購入しました</Alert>
      </Snackbar>

      <Snackbar
        open={openErrorSnackbar}
        autoHideDuration={2500}
        onClose={() => setOpenErrorSnackbar(false)}
      >
        <Alert severity="error">{error}</Alert>
      </Snackbar>

      <ConfirmDialog
        open={open}
        title="購入確認"
        message="アイテムを購入します。"
        confirmText="購入する"
        onClose={() => setOpen(false)}
        onConfirm={() => {
          handleBuy();
          setOpen(false);
        }}
      />
    </Box>
  );
}
