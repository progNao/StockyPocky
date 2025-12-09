"use client";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  IconButton,
  Alert,
  Snackbar,
} from "@mui/material";
import { useRouter } from "next/navigation";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { use, useEffect, useState } from "react";
import { useShoppingRecordStoreStore } from "@/stores/shoppingRecord";
import { api } from "@/libs/api/client";
import { ShoppingRecord, Item, ShoppingRecordDisplay } from "@/app/types";
import axios from "axios";

export default function PurchaseHistoryDetailPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const unwrapParams = use(params);
  const router = useRouter();
  const shoppingRecord = useShoppingRecordStoreStore().selectedItem;
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);
  const date = shoppingRecord?.bought_at
    ? new Date(shoppingRecord.bought_at)
    : null;

  let formattedDate = "";

  if (date) {
    formattedDate = `${date.getFullYear()}年${
      date.getMonth() + 1
    }月${date.getDate()}日`;
  }

  const mergeItemData = (
    dataShoppingRecords: ShoppingRecord,
    dataItems: Item
  ): ShoppingRecordDisplay => {
    return {
      id: dataShoppingRecords.id,
      name: dataItems ? dataItems.name : "",
      quantity: dataShoppingRecords.quantity,
      price: dataShoppingRecords.price,
      store: dataShoppingRecords.store,
      image_url: dataItems ? dataItems.image_url : "",
      bought_at: dataShoppingRecords.bought_at,
    };
  };

  useEffect(() => {
    if (!shoppingRecord) {
      const fetchItem = async () => {
        try {
          setLoading(true);
          const resShoppingRecord = (
            await api.get(`/shopping-record/${unwrapParams.id}`)
          ).data.data;
          const resItem = (await api.get(`/items/${resShoppingRecord.item_id}`))
            .data.data;

          const mergeData = mergeItemData(resShoppingRecord, resItem);
          useShoppingRecordStoreStore.getState().setSelectedItem(mergeData);
        } catch (err: unknown) {
          if (axios.isAxiosError(err) && err.response) {
            // その他のサーバーエラー
            setError("サーバーエラーが発生しました。");
            setOpenErrorSnackbar(true);
            return;
          }
          // axios 以外のエラー（ネットワーク、予期せぬエラーなど）
          setError("ネットワークエラーが発生しました。");
          setOpenErrorSnackbar(true);
        } finally {
          setLoading(false);
        }
      };
      fetchItem();
    }
  }, [shoppingRecord, unwrapParams.id]);

  return (
    <Box
      sx={{
        backgroundColor: "#F2FFF5",
        minHeight: "100vh",
        padding: 3,
        maxWidth: "100vw",
        overflowX: "hidden",
        mb: 8,
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
        <IconButton onClick={() => router.back()} sx={{ color: "#154718" }}>
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
          購入履歴詳細
        </Typography>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={2500}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          登録しました
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

      {/* 日付 */}
      <Typography variant="h4" fontWeight="bold" mb={3}>
        {formattedDate}
      </Typography>

      {/* 購入商品（1つ） */}
      <Card
        sx={{
          borderRadius: 3,
          mb: 3,
        }}
      >
        <CardContent>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            購入した商品
          </Typography>

          <Stack direction="row" alignItems="center" spacing={2}>
            <Box
              component="img"
              src={shoppingRecord?.image_url}
              alt={shoppingRecord?.name}
              sx={{
                width: 110,
                height: 110,
                borderRadius: 2,
                objectFit: "cover",
              }}
            />

            <Box flex={1}>
              <Typography variant="h6">{shoppingRecord?.name}</Typography>
              <Typography variant="body1" sx={{ color: "#4CAF50", mt: 1 }}>
                ¥{shoppingRecord?.price}
              </Typography>
            </Box>

            <Typography variant="body1" sx={{ color: "#555" }}>
              数量: {shoppingRecord?.quantity}
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      {/* 合計金額 */}
      <Card
        sx={{
          borderRadius: 3,
          mb: 3,
        }}
      >
        <CardContent>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" fontWeight="bold">
              合計金額
            </Typography>

            <Typography variant="h5" fontWeight="bold">
              ¥
              {Number(shoppingRecord?.price) * Number(shoppingRecord?.quantity)}
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      {/* 購入店舗 */}
      <Card
        sx={{
          borderRadius: 3,
        }}
      >
        <CardContent>
          <Typography variant="h6" fontWeight="bold" mb={1}>
            購入店舗
          </Typography>

          <Typography variant="body1">{shoppingRecord?.store}</Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
