"use client";

import {
  Box,
  Typography,
  IconButton,
  TextField,
  Chip,
  Card,
  Button,
  Alert,
  Snackbar,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import LoadingScreen from "@/components/LoadingScreen";
import { api } from "@/libs/api/client";
import { Memo } from "../types";
import Footer from "@/components/Footer";
import { useMemoStore } from "@/stores/memo";

export default function MemoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "incomplete" | "complete">(
    "all"
  );
  const [keyword, setKeyword] = useState("");
  const [memos, setMemos] = useState<Memo[]>([]);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [error, setError] = useState("");

  const filteredMemos = memos.filter((m) => {
    if (filter === "complete" && !m.is_done) return false;
    if (filter === "incomplete" && m.is_done) return false;
    if (keyword && !m.title.includes(keyword) && !m.content.includes(keyword))
      return false;
    return true;
  });

  const typeColor = (c: Memo["type"]) => {
    if (c === "消耗品") return "#DDF2FF";
    if (c === "ストック") return "#FFEDE5";
    return "#EEE";
  };

  const typeTextColor = (c: Memo["type"]) => {
    if (c === "消耗品") return "#0A74C4";
    if (c === "ストック") return "#D35B21";
    return "#555";
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        // メモ一覧取得
        const resMemos = (await api.get("/memos")).data.data;
        setMemos(resMemos);
      } catch (err) {
        setError("データ取得エラー：" + err);
        setOpenErrorSnackbar(true);
      } finally {
        // 全て整形し終わってからロード解除
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <Box
      sx={{
        backgroundColor: "#F2FFF5",
        minHeight: "100vh",
        padding: 3,
        maxWidth: "100vw",
        overflowX: "hidden",
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
          メモリスト
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

      {/* Search */}
      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: "14px",
          px: 2,
          py: 1,
          display: "flex",
          alignItems: "center",
          mb: 2,
        }}
      >
        <SearchIcon sx={{ color: "#154718" }} />
        <TextField
          variant="standard"
          placeholder="キーワードで検索"
          InputProps={{ disableUnderline: true }}
          fullWidth
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          sx={{ ml: 1 }}
        />
      </Box>

      {/* Filter Buttons */}
      <Box
        sx={{
          display: "flex",
          gap: 1,
          mb: 3,
        }}
      >
        <Button
          variant="contained"
          onClick={() => setFilter("all")}
          sx={{
            backgroundColor: filter === "all" ? "#3ECF8E" : "#EEE",
            color: filter === "all" ? "white" : "#333",
            borderRadius: "20px",
          }}
        >
          すべて
        </Button>

        <Button
          variant="contained"
          onClick={() => setFilter("incomplete")}
          sx={{
            backgroundColor: filter === "incomplete" ? "#3ECF8E" : "#EEE",
            color: filter === "incomplete" ? "white" : "#333",
            borderRadius: "20px",
          }}
        >
          未完了
        </Button>

        <Button
          variant="contained"
          onClick={() => setFilter("complete")}
          sx={{
            backgroundColor: filter === "complete" ? "#3ECF8E" : "#EEE",
            color: filter === "complete" ? "white" : "#333",
            borderRadius: "20px",
          }}
        >
          完了
        </Button>
      </Box>

      {/* Memo List */}
      <Box>
        {filteredMemos.map((m) => (
          <Card
            key={m.id}
            sx={{
              p: 2,
              mb: 2,
              borderRadius: "22px",
              backgroundColor: "white",
            }}
            onClick={() => {
              useMemoStore.getState().setSelectedItem(m);
              router.push("/memo/edit");
            }}
          >
            {/* Top Row */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {m.is_done ? (
                <CheckCircleIcon sx={{ color: "#3ECF8E", fontSize: 28 }} />
              ) : (
                <RadioButtonUncheckedIcon
                  sx={{ color: "#AAA", fontSize: 28 }}
                />
              )}

              <Typography
                sx={{
                  fontSize: 18,
                  fontWeight: 600,
                  ml: 1,
                  textDecoration: m.is_done ? "line-through" : "none",
                  color: m.is_done ? "#888" : "#154718",
                }}
              >
                {m.title}
              </Typography>

              <Chip
                label={m.type}
                sx={{
                  ml: "auto",
                  backgroundColor: typeColor(m.type),
                  color: typeTextColor(m.type),
                  fontWeight: "bold",
                }}
              />
            </Box>

            {/* Description */}
            <Typography sx={{ mt: 1, fontSize: 14, color: "#555" }}>
              {m.content}
            </Typography>

            {/* Tags */}
            <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
              {m.tags.map((t) => (
                <Chip
                  key={t}
                  label={`#${t}`}
                  sx={{
                    backgroundColor: "#F0F4F0",
                    color: "#154718",
                    fontSize: 12,
                  }}
                />
              ))}
            </Box>
          </Card>
        ))}
      </Box>

      {/* Floating Add Button */}
      <IconButton
        sx={{
          position: "fixed",
          bottom: 40,
          right: 30,
          backgroundColor: "#3ECF8E",
          marginBottom: 10,
        }}
        onClick={() => router.push("/memo/new")}
      >
        <AddIcon sx={{ fontSize: 30, color: "white" }} />
      </IconButton>

      <Footer />
    </Box>
  );
}
