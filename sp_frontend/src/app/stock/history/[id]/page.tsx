"use client";

import { Box, Typography, Card, Snackbar, Alert } from "@mui/material";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { StockHistory } from "@/app/types";
import { api } from "@/libs/api/client";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useFormatDate } from "@/hooks/useFormatDate";

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
  const { formatDate } = useFormatDate();

  const sortedItems = [...stockHistory].sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  useEffect(() => {
    const fetchStockHistory = async () => {
      try {
        const stockH = (
          await api.get(`/items/${unwrapParams.id}/stock-history`)
        ).data.data;
        setStockHistory(stockH);
        const Item = (await api.get(`/items/${unwrapParams.id}`)).data.data;
        setItemName(Item.name);
      } catch (err) {
        setError("在庫履歴取得エラー:" + err);
        setOpenErrorSnackbar(true);
      }
    };
    fetchStockHistory();
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
      <Header title={itemName} onBackAction={() => router.back()} />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          marginBottom: 10,
        }}
      >
        {sortedItems.map((h) => {
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

      <Footer />

      <Snackbar
        open={openErrorSnackbar}
        autoHideDuration={2500}
        onClose={() => setOpenErrorSnackbar(false)}
      >
        <Alert severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}
