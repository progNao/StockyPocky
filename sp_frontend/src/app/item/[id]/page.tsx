"use client";

import {
  Box,
  Typography,
  IconButton,
  Card,
  CardMedia,
  Divider,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import EditIcon from "@mui/icons-material/Edit";
import { useRouter } from "next/navigation";
import { useItemStore } from "@/stores/item";
import { api } from "@/libs/api/client";
import { use, useEffect, useState } from "react";
import axios from "axios";
import { Category, Item, ItemListDisplay, Stock } from "@/app/types";
import ErrorPage from "@/components/ErrorPage";

export default function ItemDetailPage({ params }: { params: Promise<{ id: number }> }) {
  const router = useRouter();
  const item = useItemStore().selectedItem;
  let reason = "";
  let action = "";
  const quantity = 1;
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openDialogIncrease, setOpenDialogIncrease] = useState(false);
  const [openDialogDecrease, setOpenDialogDecrease] = useState(false);
  const unwrapParams = use(params);
  const [stock, setStock] = useState<number>(item ? item.stockQuantity : 0);

  const handleIncrease = () => {
    setOpenDialogIncrease(true);
  };

  const handleDecrease = () => {
    setOpenDialogDecrease(true);
  };

  const handleCancel = () => {
    setOpenDialogIncrease(false);
    setOpenDialogDecrease(false);
  };

  const mergeItemData = (
    dataItems: Item,
    dataCategories: Category[],
    dataStocks: Stock
  ): ItemListDisplay => {
    const categoryMap = new Map(
      dataCategories.map((c: Category) => [c.id, c.name])
    );
    return {
      id: dataItems.id,
      name: dataItems.name,
      categoryName: categoryMap.get(dataItems.category_id) ?? "未分類",
      stockQuantity: dataStocks ? dataStocks.quantity : 0,
      isFavorite: dataItems.is_favorite,
      threshold: dataStocks ? dataStocks.threshold : 0,
      imageUrl: dataItems.image_url,
      location: dataStocks ? dataStocks.location : "",
    };
  };

  useEffect(() => {
    if (!item) {
      const fetchItem = async () => {
        try {
          setLoading(true);
          const resItem = (await api.get(`/items/${unwrapParams.id}`)).data.data;
          const resStock = (await api.get(`/items/${unwrapParams.id}/stock`)).data.data;
          const resCategory = (await api.get("/categories")).data.data;

          const mergeData = mergeItemData(resItem, resCategory, resStock);
          useItemStore.getState().setSelectedItem(mergeData);
        } catch (err) {
          console.error("アイテム取得エラー:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchItem();
    }
  }, [item, unwrapParams.id]);

  if (!item) return <ErrorPage />;

  const handleStockUpdate = async (mode: string) => {
    if (mode == "increase") {
      reason = "Increase " + item.name + " Stock";
      action = "increase";
    } else {
      reason = "Decrease " + item.name + " Stock";
      action = "decrease";
    }

    try {
      setLoading(true);
      await api.put("/items/" + item.id + "/stock", {
        reason,
        action,
        quantity,
        memo: "",
        threshold: item.threshold,
        location: item.location,
      });
      setStock((prev) => (mode === "increase" ? prev + 1 : prev - 1));
      setOpenSnackbar(true);
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
      handleCancel();
    }
  };

  // ---- Mock Data ----
  // const item = {
  //   image:
  //     "https://firebasestorage.googleapis.com/v0/b/sample/o/bottle.png?alt=media",
  //   category: "飲料",
  //   name: "ミネラルウォーター 2L",
  //   stock: 6,
  //   threshold: 3,
  //   history: [
  //     {
  //       date: "2023年10月26日",
  //       detail: "6個購入 (¥98)",
  //     },
  //     {
  //       date: "2023年9月15日",
  //       detail: "6個購入 (¥98)",
  //     },
  //   ],
  //   memo: {
  //     title: "災害備蓄用メモ",
  //     subtitle: "賞味期限の管理について",
  //   },
  // };

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
          アイテム詳細
        </Typography>

        {/* 更新画面 */}
        <IconButton
          onClick={() => router.push("/item/edit")}
          sx={{ color: "#154718" }}
        >
          <EditIcon />
        </IconButton>
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

      {/* --- Main Image --- */}
      <Card
        sx={{
          m: 2,
          borderRadius: "24px",
        }}
      >
        <CardMedia
          component="img"
          image={item.imageUrl}
          sx={{
            width: "100%",
            height: 360,
            objectFit: "cover",
            borderRadius: "24px",
          }}
        />
      </Card>

      {/* --- Category --- */}
      <Box sx={{ px: 3 }}>
        <Typography color="green" fontWeight="bold" fontSize="18px">
          {item.categoryName}
        </Typography>

        <Typography fontWeight="bold" fontSize="28px" sx={{ mt: 1 }}>
          {item.name}
        </Typography>
      </Box>

      {/* --- Stock Info Card --- */}
      <Card
        sx={{
          mx: 2,
          mt: 3,
          p: 2,
          borderRadius: "20px",
        }}
      >
        <Box sx={{ display: "flex", textAlign: "center" }}>
          <Box sx={{ flex: 1 }}>
            <Typography color="gray" fontSize="14px">
              現在の在庫数
            </Typography>
            <Typography fontWeight="bold" fontSize="28px">
              {stock}個
            </Typography>
          </Box>

          <Divider orientation="vertical" flexItem />

          <Box sx={{ flex: 1 }}>
            <Typography color="gray" fontSize="14px">
              閾値
            </Typography>
            <Typography fontWeight="bold" fontSize="28px">
              {item.threshold}個
            </Typography>
          </Box>
        </Box>
      </Card>

      {/* --- Purchase History --- */}
      {/* <Box sx={{ px: 3, mt: 4 }}>
        <Typography fontWeight="bold" fontSize="18px" sx={{ mb: 2 }}>
          最近の購入履歴
        </Typography>

        {item.history.map((h, index) => (
          <Card
            key={index}
            sx={{
              p: 2,
              mb: 1.5,
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <CalendarMonthIcon sx={{ fontSize: 32, color: "#5AC68D" }} />

            <Box sx={{ ml: 2, flex: 1 }}>
              <Typography fontSize="16px">{h.date}</Typography>
            </Box>

            <Typography color="gray">{h.detail}</Typography>
          </Card>
        ))}
      </Box> */}

      {/* --- Related Memo --- */}
      {/* <Box sx={{ px: 3, mt: 4 }}>
        <Typography fontWeight="bold" fontSize="18px" sx={{ mb: 1 }}>
          関連メモ
        </Typography>

        <Card
          sx={{
            p: 2,
            borderRadius: "16px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <DescriptionIcon sx={{ fontSize: 32, color: "#5AC68D" }} />

          <Box sx={{ ml: 2 }}>
            <Typography fontWeight="bold" fontSize="17px">
              {item.memo.title}
            </Typography>
            <Typography fontSize="14px" color="gray">
              {item.memo.subtitle}
            </Typography>
          </Box>

          <Box sx={{ flex: 1 }} />

          <Typography fontSize="22px" color="gray">
            ＞
          </Typography>
        </Card>
      </Box> */}

      {/* --- Bottom Fixed Buttons --- */}
      <Box
        sx={{
          position: "fixed",
          insetInline: 0,
          bottom: `calc(env(safe-area-inset-bottom) + 20px)`,
          display: "flex",
          justifyContent: "space-between",
          px: 3,
          zIndex: 100,
        }}
      >
        <Button
          variant="contained"
          onClick={handleDecrease}
          sx={{
            backgroundColor: "white",
            color: "#25A56A",
            borderRadius: "24px",
            width: "45%",
            fontSize: "18px",
            boxShadow: "0px 3px 8px rgba(0,0,0,0.1)",
          }}
        >
          {loading ? (
            <CircularProgress size={26} sx={{ color: "white" }} />
          ) : (
            "ー 減らす"
          )}
        </Button>

        <Button
          variant="contained"
          onClick={handleIncrease}
          sx={{
            backgroundColor: "#25A56A",
            color: "white",
            borderRadius: "24px",
            width: "45%",
            fontSize: "18px",
            boxShadow: "0px 3px 8px rgba(0,0,0,0.1)",
          }}
        >
          {loading ? (
            <CircularProgress size={26} sx={{ color: "white" }} />
          ) : (
            "＋ 増やす"
          )}
        </Button>
      </Box>

      {/* --- 確認ダイアログ --- */}
      <Dialog open={openDialogIncrease} onClose={handleCancel}>
        <DialogTitle>確認</DialogTitle>
        <DialogContent>在庫数を 1 個増やしますか？</DialogContent>

        <DialogActions>
          <Button onClick={handleCancel}>キャンセル</Button>
          <Button
            variant="contained"
            onClick={() => handleStockUpdate("increase")}
          >
            はい
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDialogDecrease} onClose={handleCancel}>
        <DialogTitle>確認</DialogTitle>
        <DialogContent>在庫数を 1 個減らしますか？</DialogContent>

        <DialogActions>
          <Button onClick={handleCancel}>キャンセル</Button>
          <Button
            variant="contained"
            onClick={() => handleStockUpdate("decrease")}
          >
            はい
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
