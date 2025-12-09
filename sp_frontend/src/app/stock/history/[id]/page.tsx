"use client";

import {
  Box,
  Typography,
  IconButton,
  Card,
  Snackbar,
  Alert,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { StockHistory } from "@/app/types";
import { api } from "@/libs/api/client";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Footer from "@/components/Footer";

export default function StockHistoryPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const router = useRouter();
  const [stockHistory, setStockHistory] = useState<StockHistory[]>([]);
  const unwrapParams = use(params);
  const [error, setError] = useState("");
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [itemName, setItemName] = useState("");

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

  useEffect(() => {
    const fetch = async () => {
      try {
        // 在庫履歴取得
        const stockH = (
          await api.get(`/items/${unwrapParams.id}/stock-history`)
        ).data.data;
        setStockHistory(stockH);
        const Item = (await api.get(`/items/${unwrapParams.id}`)).data.data;
        setItemName(Item.name);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          const status = err.response.status;
          if (status === 404) {
            setStockHistory([]);
            return;
          }
          // その他のサーバーエラー
          setError("ログインに失敗しました。時間をおいて再度お試しください。");
          setOpenErrorSnackbar(true);
          return;
        }
      }
    };
    fetch();
  }, [unwrapParams.id]);

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
          {itemName}
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

      <Box sx={{ px: 3, mt: 4, marginBottom: 10 }}>
        {stockHistory.map((h) => {
          const isIncrease = h.change > 0;

          return (
            <Card
              key={h.id}
              sx={{
                p: 2,
                mb: 2,
                borderRadius: "22px",
                display: "flex",
                alignItems: "center",
                backgroundColor: "#F8FFF8",
                boxShadow: "0 3px 10px rgba(0,0,0,0.05)",
              }}
            >
              {/* 丸背景アイコン */}
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  backgroundColor: isIncrease ? "#E6F8EE" : "#FFECEC",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {isIncrease ? (
                  <AddIcon sx={{ fontSize: 28, color: "#4CAF50" }} />
                ) : (
                  <RemoveIcon sx={{ fontSize: 28, color: "#F44336" }} />
                )}
              </Box>

              {/* テキスト部分 */}
              <Box sx={{ ml: 2, flex: 1 }}>
                <Typography fontSize="13px" fontWeight="bold">
                  {h.reason}
                </Typography>
              </Box>

              {/* 右側：change & 日付 */}
              <Box sx={{ textAlign: "right" }}>
                <Typography
                  fontSize="20px"
                  fontWeight="bold"
                  color={isIncrease ? "#4CAF50" : "#F44336"}
                  sx={{ mb: 0.5 }}
                >
                  {isIncrease ? `+${h.change}` : h.change}
                </Typography>

                <Typography fontSize="12px" color="gray">
                  {formatDate(h.created_at)}
                </Typography>
              </Box>
            </Card>
          );
        })}
      </Box>

      {/* 下部ナビバー（仮） */}
      <Footer />
    </Box>
  );
}
