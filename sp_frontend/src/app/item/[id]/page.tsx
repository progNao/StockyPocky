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
  Paper,
  TextField,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import EditIcon from "@mui/icons-material/Edit";
import { useRouter } from "next/navigation";
import { useItemStore } from "@/stores/item";
import { api } from "@/libs/api/client";
import { use, useEffect, useState } from "react";
import axios from "axios";
import {
  Category,
  Item,
  ItemListDisplay,
  Stock,
  StockHistory,
} from "@/app/types";
import ErrorPage from "@/components/ErrorPage";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

export default function ItemDetailPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const router = useRouter();
  const item = useItemStore().selectedItem;
  let reason_in_de = "";
  let action = "";
  const quantity_in_de = 1;
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openDialogIncrease, setOpenDialogIncrease] = useState(false);
  const [openDialogDecrease, setOpenDialogDecrease] = useState(false);
  const [openDialogManual, setOpenDialogManual] = useState(false);
  const unwrapParams = use(params);
  const [stock_in_de, setStock_in_de] = useState(item ? item.stockQuantity : 0);
  const [threshold_in_de, setThreshold_in_de] = useState(
    item ? item.threshold : 0
  );
  const [quantity, setQuantity] = useState<number>();
  const [reason, setReason] = useState("");
  const [location, setLocation] = useState("");
  const [threshold, setThreshold] = useState<number>();
  const [memo, setMemo] = useState("");
  const [stockHistory, setStockHistory] = useState<StockHistory[]>([]);

  const validate = () => {
    if (!quantity || !reason || !location || !threshold) {
      return "個数、理由、場所、閾値は必須です。";
    }
    return null;
  };

  const handleIncrease = () => {
    setOpenDialogIncrease(true);
  };

  const handleDecrease = () => {
    setOpenDialogDecrease(true);
  };

  const handleManual = () => {
    setOpenDialogManual(true);
  };

  const handleCancel = () => {
    setOpenDialogIncrease(false);
    setOpenDialogDecrease(false);
    setOpenDialogManual(false);
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);

    const yyyy = d.getFullYear();
    const MM = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    const ss = String(d.getSeconds()).padStart(2, "0");

    return `${yyyy}/${MM}/${dd} ${hh}:${mm}:${ss}`;
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
      categoryId: dataItems.category_id,
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
          const resItem = (await api.get(`/items/${unwrapParams.id}`)).data
            .data;
          const resStock = (await api.get(`/items/${unwrapParams.id}/stock`))
            .data.data;
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
    const history = async () => {
      try {
        // 在庫履歴取得
        const stockH = (
          await api.get(`/items/${unwrapParams.id}/stock-history`)
        ).data.data;
        setStockHistory(stockH);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          const status = err.response.status;
          if (status === 404) {
            setStockHistory([]);
            return;
          }
          // その他のサーバーエラー
          setError("ログインに失敗しました。時間をおいて再度お試しください。");
          return;
        }
      }
    };
    history();
  }, [item, unwrapParams.id]);

  if (!item) return <ErrorPage />;

  const handleStockUpdate = async (mode: string) => {
    if (mode == "increase") {
      reason_in_de = "Increase " + item.name + " Stock";
      action = "increase";
    } else {
      reason_in_de = "Decrease " + item.name + " Stock";
      action = "decrease";
    }

    try {
      setLoading(true);
      await api.put(`/items/${item.id}/stock`, {
        reason: reason_in_de,
        action,
        quantity: quantity_in_de,
        memo: "",
        threshold: item.threshold,
        location: item.location,
      });
      setStock_in_de((prev) => (mode === "increase" ? prev + 1 : prev - 1));
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

  const handleSubmit = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      setOpenErrorSnackbar(true);
      return;
    }
    action = "manual";
    try {
      setLoading(true);
      await api.put(`/items/${item.id}/stock`, {
        reason,
        action,
        quantity,
        memo,
        threshold,
        location,
      });
      setStock_in_de(() => (quantity ? quantity : 0));
      setThreshold_in_de(() => (threshold ? threshold : 0));
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
  const latestHistories = [...stockHistory]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 3);

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
          onClick={() => {
            useItemStore.getState().setSelectedItem(item);
            router.push("/item/edit");
          }}
          
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
          {item.categoryName} - {item.location}
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
              {stock_in_de}個
            </Typography>
          </Box>

          <Divider orientation="vertical" flexItem />

          <Box sx={{ flex: 1 }}>
            <Typography color="gray" fontSize="14px">
              閾値
            </Typography>
            <Typography fontWeight="bold" fontSize="28px">
              {threshold_in_de}個
            </Typography>
          </Box>
        </Box>
      </Card>

      {stockHistory.length != 0 && (
        <Box sx={{ px: 3, mt: 4 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 3,
            }}
          >
            <Typography fontWeight="bold" fontSize="12px">
              最近の在庫履歴
            </Typography>
            <Button
              variant="contained"
              onClick={() => router.push(`/stock/history/${unwrapParams.id}`)}
              sx={{
                backgroundColor: "#25A56A",
                color: "white",
                borderRadius: "24px",
                width: "40%",
                fontSize: "12px",
                boxShadow: "0px 3px 8px rgba(0,0,0,0.1)",
              }}
            >
              在庫履歴一覧へ
            </Button>
          </Box>

          {latestHistories.map((h, index) => (
            <Card
              key={index}
              sx={{
                p: 2,
                mb: 0.5,
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <CalendarMonthIcon sx={{ fontSize: 32, color: "#5AC68D" }} />

              <Box sx={{ ml: 2, flex: 1 }}>
                <Typography fontSize="16px">
                  {formatDate(h.created_at)}
                </Typography>
              </Box>

              <Typography color="gray">{h.change}個変更</Typography>
            </Card>
          ))}
        </Box>
      )}

      <Box sx={{ px: 2 }}>
        <Paper
          elevation={3}
          sx={{
            marginTop: 4,
            padding: 2.5,
            borderRadius: "20px",
            backgroundColor: "#FAFAFA",
          }}
        >
          <Typography
            variant="h6"
            color="green"
            fontWeight="bold"
            fontSize="24px"
            marginBottom={1}
          >
            在庫調整
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            数が大きくずれた時や、修正したい時に使用してください。
          </Typography>

          <Divider sx={{ mb: 2 }} />

          {/* 個数 */}
          <TextField
            label="個数 *"
            type="number"
            fullWidth
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            sx={{ mb: 2 }}
            InputProps={{
              inputProps: { min: 0 },
            }}
          />

          {/* 理由 */}
          <TextField
            label="理由 *"
            fullWidth
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            sx={{ mb: 2 }}
          />

          {/* 場所 */}
          <TextField
            label="場所 *"
            fullWidth
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            sx={{ mb: 2 }}
          />

          {/* 閾値 */}
          <TextField
            label="閾値 *"
            type="number"
            fullWidth
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            sx={{ mb: 2 }}
            InputProps={{
              inputProps: { min: 0 },
            }}
          />

          {/* メモ */}
          <TextField
            label="メモ"
            fullWidth
            multiline
            minRows={2}
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            sx={{ mb: 3 }}
          />

          <Button
            variant="contained"
            color="success"
            fullWidth
            sx={{
              height: 48,
              fontWeight: 700,
              backgroundColor: "#25A56A",
              color: "white",
              borderRadius: "24px",
              fontSize: "18px",
              boxShadow: "0px 3px 8px rgba(0,0,0,0.1)",
            }}
            onClick={handleManual}
          >
            調整確定
          </Button>
        </Paper>
      </Box>

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

      <Dialog open={openDialogManual} onClose={handleCancel}>
        <DialogTitle>確認</DialogTitle>
        <DialogContent>在庫数を{quantity}にしますか？</DialogContent>

        <DialogActions>
          <Button onClick={handleCancel}>キャンセル</Button>
          <Button variant="contained" onClick={() => handleSubmit()}>
            はい
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
