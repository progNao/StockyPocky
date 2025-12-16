"use client";

import {
  Box,
  Typography,
  TextField,
  Chip,
  Card,
  Button,
  Alert,
  Snackbar,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/libs/api/client";
import { Memo } from "../types";
import Footer from "@/components/Footer";
import { useMemoStore } from "@/stores/memo";
import Header from "@/components/Header";
import FabButton from "@/components/FabButton";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

export default function MemoPage() {
  const router = useRouter();
  const [memos, setMemos] = useState<Memo[]>([]);
  const [filter, setFilter] = useState<"all" | "incomplete" | "complete">(
    "all"
  );
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);

  const filteredMemos = memos.filter((m) => {
    if (filter === "complete" && !m.is_done) return false;
    if (filter === "incomplete" && m.is_done) return false;
    if (search && !m.title.includes(search) && !m.content.includes(search))
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
    const fetchMemos = async () => {
      try {
        const res = (await api.get("/memos")).data.data;
        setMemos(res);
      } catch (err) {
        setError("メモ取得エラー：" + err);
        setOpenErrorSnackbar(true);
      }
    };

    fetchMemos();
  }, []);

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
      <Header
        title="メモリスト"
        onBackAction={() => router.push("/dashboard")}
      />

      {/* 🔍 検索欄 */}
      <TextField
        placeholder="メモを検索"
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

      {/* フィルターチップ */}
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

      {/* メモ一覧 */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          marginBottom: 10,
        }}
      >
        {filteredMemos.length === 0 ? (
          <Typography sx={{ color: "#7A7A7A", textAlign: "center", mt: 4 }}>
            メモはありません
          </Typography>
        ) : (
          filteredMemos.map((m) => (
            <Card
              key={m.id}
              onClick={() => {
                useMemoStore.getState().setSelectedItem(m);
                router.push("/memo/edit");
              }}
              sx={{
                p: 2,
                borderRadius: "20px",
                backgroundColor: "white",
                cursor: "pointer",
              }}
            >
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

              <Typography sx={{ mt: 1, fontSize: 14, color: "#555" }}>
                {m.content}
              </Typography>

              {/* Tags + Arrow */}
              <Box
                sx={{
                  mt: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                {/* Tags */}
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
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

                {/* Arrow */}
                <ChevronRightIcon
                  sx={{
                    color: "#B0B0B0",
                    fontSize: 26,
                    ml: 1,
                    flexShrink: 0,
                  }}
                />
              </Box>
            </Card>
          ))
        )}
      </Box>

      <FabButton onClick={() => router.push("/memo/new")} />

      <Footer />

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
