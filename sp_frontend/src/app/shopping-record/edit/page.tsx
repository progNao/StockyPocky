"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  TextField,
  Card,
  CardMedia,
  Alert,
  CircularProgress,
  Divider,
  Snackbar,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useRouter } from "next/navigation";
import { useShoppingRecordStoreStore } from "@/stores/shoppingRecord";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StoreIcon from "@mui/icons-material/Store";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import { api } from "@/libs/api/client";
import LoadingScreen from "@/components/LoadingScreen";
import axios from "axios";

export default function ShoppingRecordEdit() {
  const router = useRouter();
  const item = useShoppingRecordStoreStore().selectedItem;
  const [shoppingRecordId] = useState(item ? item.id : 0);
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState<number | null>(null);
  const [store, setStore] = useState("");
  const [boughtAt, setBoughtAt] = useState("");
  const [action, setAction] = useState("");
  const [reason, setReason] = useState("");
  const [itemId, setItemId] = useState(0);

  // datetime-local 用に整形する関数
  const toDatetimeLocal = (value: string | Date | undefined) => {
    if (!value) return "";

    const date = value instanceof Date ? value : new Date(value);

    // yyyy-MM-ddTHH:mm:ss.SSS まで
    const iso = date.toISOString().slice(0, 23);

    // datetime-local は Z を受け付けない
    return iso;
  };

  const validate = () => {
    if (!quantity || !price || !store || !action || !reason) {
      return "数量、価格、購入店舗、アクション、修正理由は必須です。";
    }
    return null;
  };

  const handleCount = (
    setter: (v: number) => void,
    value: number,
    diff: number
  ) => {
    const newValue = value + diff;
    if (newValue >= 0) setter(newValue);
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
      setOpenSnackbar(true);
      router.push("/shopping-record");
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

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await api.get(`/shopping-records/${shoppingRecordId}`);
        const data = await res.data.data;
        setQuantity(data.quantity);
        setPrice(data.price);
        setStore(data.store);
        setBoughtAt(data.bought_at);
        setItemId(data.item_id);
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
  }, [shoppingRecordId]);

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
          購入履歴編集
        </Typography>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={2500}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          購入しました
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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 2,
            justifyContent: "space-between",
          }}
        >
          <ShoppingCartIcon sx={{ color: "#000", mr: 1 }} />
          <Typography sx={{ fontSize: 16, flex: 1 }}>購入数</Typography>

          <IconButton
            onClick={() => handleCount(setQuantity, quantity, -1)}
            sx={{
              backgroundColor: "#E9F9ED",
              color: "#1A7F3B",
              marginRight: 2,
            }}
          >
            <RemoveIcon />
          </IconButton>

          <Typography sx={{ fontSize: 20, width: 30, textAlign: "center" }}>
            {quantity}
          </Typography>

          <IconButton
            onClick={() => handleCount(setQuantity, quantity, 1)}
            sx={{
              backgroundColor: "#32D26A",
              color: "#FFFFFF",
              marginLeft: 2,
            }}
          >
            <AddIcon />
          </IconButton>
        </Box>

        <Divider />

        {/* 金額 */}
        <Box sx={{ mb: 2 }}>
          <Typography sx={{ fontSize: 16, mb: 1 }}>金額</Typography>
          <TextField
            fullWidth
            placeholder="例: 500"
            type="number"
            value={price}
            onChange={(e) =>
              setPrice(e.target.value === "" ? null : Number(e.target.value))
            }
          />
        </Box>

        <Divider />

        {/* 購入場所 */}
        <Box sx={{ mt: 2, mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <StoreIcon sx={{ mr: 1 }} />
            <Typography sx={{ fontSize: 16 }}>購入場所</Typography>
          </Box>

          <TextField
            fullWidth
            placeholder="例: Amazon、ドラッグストア"
            value={store}
            onChange={(e) => setStore(e.target.value)}
          />
        </Box>

        <Divider />

        {/* 購入日時 */}
        <Box sx={{ mt: 2, mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <StoreIcon sx={{ mr: 1 }} />
            <Typography sx={{ fontSize: 16 }}>購入日時</Typography>
          </Box>

          <TextField
            type="datetime-local"
            fullWidth
            placeholder="例: 2025/12/12 13:00"
            value={toDatetimeLocal(boughtAt)}
            onChange={(e) => setBoughtAt(e.target.value)}
          />
        </Box>

        <Divider />

        {/* アクション */}
        <Box sx={{ mt: 2, mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <StoreIcon sx={{ mr: 1 }} />
            <Typography sx={{ fontSize: 16 }}>アクション</Typography>
          </Box>

          <FormControl fullWidth>
            <InputLabel id="action-label">アクション</InputLabel>
            <Select
              labelId="action-label"
              value={action}
              label="アクション"
              onChange={(e) => setAction(e.target.value)}
            >
              <MenuItem value="increase">増加</MenuItem>
              <MenuItem value="decrease">減少</MenuItem>
              <MenuItem value="manual">マニュアル</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Divider />

        {/* 修正理由 */}
        <Box sx={{ mt: 2, mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <StoreIcon sx={{ mr: 1 }} />
            <Typography sx={{ fontSize: 16 }}>修正理由</Typography>
          </Box>

          <TextField
            fullWidth
            placeholder="購入数ミスのため"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </Box>

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
      <Button
        fullWidth
        sx={{
          backgroundColor: "#32D26A",
          color: "#000",
          fontSize: 16,
          fontWeight: 700,
          borderRadius: "50px",
          paddingY: 1.5,
          "&:hover": { backgroundColor: "#29C05F" },
        }}
        onClick={handleUpdate}
        disabled={loading}
      >
        {loading ? (
          <CircularProgress size={26} sx={{ color: "white" }} />
        ) : (
          "修正する"
        )}
      </Button>
    </Box>
  );
}
