"use client";
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  MenuItem,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useRouter } from "next/navigation";
import { api } from "@/libs/api/client";
import axios from "axios";
import { Item } from "@/app/types";

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
    setQuantity(0);
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
      router.push("/shopping-list")
    }
  };

  const handleCount = (
    setter: (v: number) => void,
    value: number,
    diff: number
  ) => {
    const newValue = value + diff;
    if (newValue >= 0) setter(newValue);
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
          買い物リスト登録
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

      {/* カテゴリ */}
      <Typography sx={{ fontWeight: 600, marginBottom: 1 }}>
        アイテム *
      </Typography>
      <TextField
        select
        fullWidth
        value={itemId}
        onChange={(e) => setItemId(Number(e.target.value))}
        placeholder="カテゴリを選択"
        InputProps={{
          sx: {
            backgroundColor: "white",
            borderRadius: "20px",
            paddingY: 0.5,
          },
        }}
        sx={{ marginBottom: 3 }}
      >
        {items.map((c) => (
          <MenuItem key={c.id} value={c.id}>
            {c.name}
          </MenuItem>
        ))}
      </TextField>

      {/* 購入数 */}
      <Box
        sx={{
          backgroundColor: "white",
          padding: 2,
          borderRadius: "20px",
          marginBottom: 3,
          boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography sx={{ fontWeight: 600, marginBottom: 1 }}>
          購入数
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-end",
          }}
        >
          <IconButton
            onClick={() => handleCount(setQuantity, quantity, -1)}
            sx={{
              backgroundColor: "#E9F9ED",
              color: "#1A7F3B",
              marginRight: 4,
            }}
          >
            <RemoveIcon />
          </IconButton>

          <Typography sx={{ fontSize: 22, fontWeight: 700 }}>
            {quantity}
          </Typography>

          <IconButton
            onClick={() => handleCount(setQuantity, quantity, 1)}
            sx={{
              backgroundColor: "#32D26A",
              color: "#FFFFFF",
              marginLeft: 4,
            }}
          >
            <AddIcon />
          </IconButton>
        </Box>
      </Box>

      {/* 登録ボタン */}
      <Button
        fullWidth
        variant="contained"
        sx={{
          backgroundColor: "#32D26A",
          paddingY: 2,
          borderRadius: "40px",
          fontWeight: 700,
          fontSize: "18px",
          color: "#FFFFFF",
          boxShadow: "0 8px 16px rgba(50,210,106,0.4)",
          "&:hover": {
            backgroundColor: "#29C05F",
          },
        }}
        onClick={handleCreate}
        disabled={loading}
      >
        {loading ? (
          <CircularProgress size={26} sx={{ color: "white" }} />
        ) : (
          "登録する"
        )}
      </Button>
    </Box>
  );
}
