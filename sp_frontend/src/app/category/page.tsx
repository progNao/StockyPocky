"use client";

import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Card,
  Avatar,
  Snackbar,
  Alert,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useRouter } from "next/navigation";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useEffect, useState } from "react";
import { Category } from "../types";
import { api } from "@/libs/api/client";
import { useCategoryStore } from "@/stores/category";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import FabButton from "@/components/FabButton";

export default function CategoryPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = (await api.get("/categories")).data.data;
        setCategories(res);
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
      <Header title="カテゴリリスト" onBackAction={() => router.push("/dashboard")} />

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
            marginBottom: 2,
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
            カテゴリはありません
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

      <FabButton onClick={() => router.push("/category/new")}/>

      <Footer />

      <Snackbar
        open={openErrorSnackbar}
        autoHideDuration={2500}
        onClose={() => setOpenErrorSnackbar(false)}
      >
        <Alert severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}
