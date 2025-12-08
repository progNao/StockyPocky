"use client";

import { use, useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  Divider,
  Card,
  Alert,
  Snackbar,
  CardMedia,
  TextField,
  CircularProgress,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useRouter } from "next/navigation";
import { api } from "@/libs/api/client";
import axios from "axios";
import { Item } from "@/app/types";
import LoadingScreen from "@/components/LoadingScreen";
import StoreIcon from "@mui/icons-material/Store";
import CreditCardIcon from "@mui/icons-material/CreditCard";

export default function ItemBuyPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState<number | null>(null);
  const [store, setStore] = useState("");
  const unwrapParams = use(params);
  const [item, setItem] = useState<Item>();
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!quantity || !price || !store) {
      return "アイテム名、カテゴリ、初期在庫数は必須です。";
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

  const clear = () => {
    setQuantity(1);
    setPrice(null);
    setStore("");
  };

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
        bought_at: "2025-12-08T14:17:52.941Z",
      });
      setOpenSnackbar(true);
      clear();
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
      router.push("/item");
    }
  };

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const Item = (await api.get(`/items/${unwrapParams.id}`)).data.data;
        setItem(Item);
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
          アイテム購入
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
        onClick={handleBuy}
        disabled={loading}
      >
        {loading ? (
          <CircularProgress size={26} sx={{ color: "white" }} />
        ) : (
          "購入する"
        )}
      </Button>
    </Box>
  );
}
