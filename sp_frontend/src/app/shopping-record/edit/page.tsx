"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  Alert,
  Divider,
  Snackbar,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useShoppingRecordStoreStore } from "@/stores/shoppingRecord";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import { api } from "@/libs/api/client";
import axios from "axios";
import Header from "@/components/Header";
import ShoppingRecordEditComponent from "@/components/ShoppingRecordEditComponent";
import SelectAction from "@/components/SelectAction";
import PrimaryButton from "@/components/PrimaryButton";
import CountBox from "@/components/CountBox";

export default function ShoppingRecordEdit() {
  const router = useRouter();
  const item = useShoppingRecordStoreStore().selectedItem;
  const [shoppingRecordId] = useState(item ? item.id : 0);
  const [itemId, setItemId] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState<number>();
  const [store, setStore] = useState("");
  const [boughtAt, setBoughtAt] = useState("");
  const [action, setAction] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!quantity || !price || !store || !action || !reason) {
      return "数量、価格、購入店舗、アクション、修正理由は必須です。";
    }
    return null;
  };

  const toDatetimeLocal = (value: string | Date | undefined) => {
    if (!value) return "";
    const date = value instanceof Date ? value : new Date(value);
    const iso = date.toISOString().slice(0, 23);
    return iso;
  };

  const handleUpdate = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      setOpenErrorSnackbar(true);
      return;
    }
    try {
      setLoading(true);
      await api.put(`/shopping-records/${shoppingRecordId}`, {
        item_id: itemId,
        quantity,
        price,
        store,
        bought_at: boughtAt,
        reason,
        action,
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
      setLoading(false);
      setOpenSnackbar(true);
    }
  };

  useEffect(() => {
    const fetchShoppingRecord = async () => {
      try {
        const res = (await api.get(`/shopping-records/${shoppingRecordId}`))
          .data.data;
        setQuantity(res.quantity);
        setPrice(res.price);
        setStore(res.store);
        setBoughtAt(res.bought_at);
        setItemId(res.item_id);
      } catch (err) {
        setError("購入履歴取得エラー:" + err);
        setOpenErrorSnackbar(true);
      }
    };

    fetchShoppingRecord();
  }, [shoppingRecordId]);

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
        title="購入履歴詳細"
        onBackAction={() => router.push("/shopping-record")}
      />

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

        {/* アクション */}
        <SelectAction
          label="アクション"
          value={action}
          onChange={(value: string) => setAction(value)}
        />

        <Divider />

        {/* 修正理由 */}
        <ShoppingRecordEditComponent
          label="修正理由"
          value={reason}
          onChange={(value: string) => setReason(value)}
          placeholder="購入数ミスのため"
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

      {/* 修正ボタン */}
      <PrimaryButton onClick={handleUpdate} loading={loading} label="修正" />

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
    </Box>
  );
}
