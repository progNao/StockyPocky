"use client";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { useShoppingRecordStoreStore } from "@/stores/shoppingRecord";
import { api } from "@/libs/api/client";
import { ShoppingRecord, Item, ShoppingRecordDisplay } from "@/app/types";
import axios from "axios";
import Header from "@/components/Header";

export default function ShoppingRecordDetail({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const router = useRouter();
  const unwrapParams = use(params);
  const shoppingRecord = useShoppingRecordStoreStore().selectedItem;
  const date = shoppingRecord?.bought_at
    ? new Date(shoppingRecord.bought_at)
    : null;
  const [error, setError] = useState("");
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);

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
          const resShoppingRecord = (
            await api.get(`/shopping-record/${unwrapParams.id}`)
          ).data.data;
          const resItem = (await api.get(`/items/${resShoppingRecord.item_id}`))
            .data.data;

          const mergeData = mergeItemData(resShoppingRecord, resItem);
          useShoppingRecordStoreStore.getState().setSelectedItem(mergeData);
        } catch (err: unknown) {
          if (axios.isAxiosError(err) && err.response) {
            setError("サーバーエラーが発生しました。");
            setOpenErrorSnackbar(true);
            return;
          }
          setError("ネットワークエラーが発生しました。");
          setOpenErrorSnackbar(true);
        }
      };
      fetchItem();
    }
  }, [shoppingRecord, unwrapParams.id]);

  if (!shoppingRecord) return;

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
        onEditPage={() => {
          useShoppingRecordStoreStore
            .getState()
            .setSelectedItem(shoppingRecord);
          router.push("/shopping-record/edit");
        }}
      />

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
