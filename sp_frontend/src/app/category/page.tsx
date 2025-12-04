"use client";

import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Card,
  Fab,
  Avatar,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useRouter } from "next/navigation";
import AddIcon from "@mui/icons-material/Add";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useEffect, useState } from "react";
import { Category } from "../types";
import { api } from "@/libs/api/client";
import { useCategoryStore } from "@/stores/category";

export default function CategoryPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [error, setError] = useState("");

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        const data = await res.data.data;
        setCategories(data);
      } catch (err) {
        setError("カテゴリ取得エラー:" + err);
        setOpenErrorSnackbar(true);
      }
    };

    fetchCategories();
  }, []);

  return (
    <Box
      sx={{
        backgroundColor: "#F2FFF5",
        minHeight: "100vh",
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
        <IconButton
          onClick={() => router.push("/dashboard")}
          sx={{ color: "#154718" }}
        >
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
          カテゴリ一覧
        </Typography>
      </Box>

      <Snackbar
        open={openErrorSnackbar}
        autoHideDuration={2500}
        onClose={() => setOpenErrorSnackbar(false)}
      >
        <Alert severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>

      {/* 🔍 検索欄 */}
      <TextField
        placeholder="カテゴリを検索"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        fullWidth
        InputProps={{
          sx: {
            borderRadius: "40px",
            backgroundColor: "white",
            height: 48,
          },
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: "#7BA087" }} />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />

      {/* カテゴリ一覧 */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {filteredCategories.length === 0 ? (
          <Typography sx={{ color: "#7A7A7A", textAlign: "center", mt: 4 }}>
            一致するカテゴリがありません
          </Typography>
        ) : (
          filteredCategories.map((cat) => (
            <Card
              key={cat.id}
              onClick={() => {
                useCategoryStore.getState().setSelectedCategoryId(cat.id);
                router.push("/category/edit");
              }}
              sx={{
                p: 2,
                borderRadius: "20px",
                backgroundColor: "white",
                display: "flex",
                alignItems: "center",
                boxShadow: "0px 1px 4px rgba(0,0,0,0.05)",
                cursor: "pointer",
              }}
            >
              <Avatar
                sx={{
                  width: 50,
                  height: 50,
                  backgroundColor: "#9BC3AB",
                  fontSize: 22,
                  fontWeight: 700,
                  mr: 2,
                }}
              >
                {cat.icon}
              </Avatar>

              <Typography
                sx={{
                  fontSize: 18,
                  color: "#3C5244",
                  fontWeight: 600,
                  flexGrow: 1,
                }}
              >
                {cat.name}
              </Typography>

              <ChevronRightIcon sx={{ color: "#8AA096" }} />
            </Card>
          ))
        )}
      </Box>

      {/* 右下の追加ボタン */}
      <Fab
        color="primary"
        onClick={() => router.push("/category/new")}
        sx={{
          position: "fixed",
          bottom: 40,
          right: 30,
          backgroundColor: "#3ECF8E",
        }}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
}
