"use client";
import { api } from "@/libs/api/client";
import { useCategoryStore } from "@/stores/category";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

export default function CategoryEditPage() {
  const categoryId = useCategoryStore((s) => s.selectedCategoryId);
  const router = useRouter();
  const [id, setId] = useState<number | null>();
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const validate = () => {
    if (!name) {
      return "カテゴリ名は必須です。";
    }
    return null;
  };

  const clear = () => {
    setName("");
    setIcon("");
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
      await api.put("/categories", {
        id,
        name,
        icon,
      });
      setOpenSnackbar(true);
      clear();
      router.push("/category");
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

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      await api.delete(`/categories/${id}`);
      setOpenSnackbar(true);
      clear();
      router.push("/category");
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
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await api.get(`/categories/${categoryId}`);
        const data = await res.data.data;
        setId(categoryId);
        setName(data.name);
        setIcon(data.icon);
      } catch (err) {
        setError("カテゴリ取得エラー:" + err);
        setOpenErrorSnackbar(true);
      }
    };

    fetchCategory();
  }, [categoryId]);

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
          カテゴリ更新
        </Typography>
      </Box>

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

      {/* カテゴリ名 */}
      <Typography sx={{ fontWeight: 600, marginBottom: 1 }}>
        カテゴリ名 *
      </Typography>
      <TextField
        fullWidth
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="日用品"
        InputProps={{
          sx: {
            backgroundColor: "white",
            borderRadius: "20px",
            paddingY: 0.5,
          },
        }}
        sx={{ marginBottom: 3 }}
      />

      {/* アイコン */}
      <Typography sx={{ fontWeight: 600, marginBottom: 1 }}>
        アイコン
      </Typography>
      <TextField
        fullWidth
        value={icon}
        onChange={(e) => setIcon(e.target.value)}
        placeholder="🧻"
        InputProps={{
          sx: {
            backgroundColor: "white",
            borderRadius: "20px",
            paddingY: 0.5,
          },
        }}
        sx={{ marginBottom: 3 }}
      />

      {/* 更新ボタン */}
      <Button
        fullWidth
        variant="contained"
        sx={{
          backgroundColor: "#32D26A",
          paddingY: 2,
          marginY: 3,
          borderRadius: "40px",
          fontWeight: 700,
          fontSize: "18px",
          color: "#FFFFFF",
          boxShadow: "0 8px 16px rgba(50,210,106,0.4)",
          "&:hover": {
            backgroundColor: "#29C05F",
          },
        }}
        onClick={handleUpdate}
      >
        {loading ? (
          <CircularProgress size={26} sx={{ color: "white" }} />
        ) : (
          "更新する"
        )}
      </Button>
      
      {/* 削除ボタン */}
      <Button
        fullWidth
        variant="contained"
        sx={{
          backgroundColor: "#FF6B6B",
          paddingY: 2,
          borderRadius: "40px",
          fontWeight: 700,
          fontSize: "18px",
          color: "#ffffff",
          boxShadow: "0 8px 16px rgba(255, 107, 107, 0.4)",
          transition: "0.2s",
          "&:hover": {
            backgroundColor: "#FF5A5A",
            boxShadow: "0 6px 12px rgba(255, 107, 107, 0.6)",
          },
          "&:active": {
            backgroundColor: "#E14B4B",
          },
        }}
        onClick={handleDelete}
      >
        {deleteLoading ? (
          <CircularProgress size={26} sx={{ color: "white" }} />
        ) : (
          "削除する"
        )}
      </Button>
    </Box>
  );
}
