"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  Alert,
  Snackbar,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useShoppingRecordStoreStore } from "@/stores/shoppingRecord";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import { api } from "@/libs/api/client";
import LoadingScreen from "@/components/LoadingScreen";
import { Item, ShoppingRecord, ShoppingRecordDisplay } from "../types";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

export default function ShoppingRecordPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"week" | "month">("week");
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<ShoppingRecordDisplay[]>([]);

  // ヘルパー：渡した日付の「その週の月曜（ローカル時間・00:00）」を返す
  const getStartOfWeekMonday = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    // (getDay() + 6) % 7 : Mon->0, Tue->1, ..., Sun->6
    const dayIndex = (d.getDay() + 6) % 7;
    d.setDate(d.getDate() - dayIndex);
    return d;
  };

  const weekly = useMemo(() => {
    const now = new Date();
    // 今週の月曜（ローカルの 00:00）
    const mondayThisWeek = getStartOfWeekMonday(now);

    // 先週の月曜（今週の月曜 - 7日）
    const mondayLastWeek = new Date(mondayThisWeek);
    mondayLastWeek.setDate(mondayThisWeek.getDate() - 7);
    mondayLastWeek.setHours(0, 0, 0, 0);

    // 先週の日曜 = 今週の月曜の前日の 23:59:59.999
    const sundayLastWeek = new Date(mondayThisWeek);
    sundayLastWeek.setDate(mondayThisWeek.getDate() - 1);
    sundayLastWeek.setHours(23, 59, 59, 999);

    const thisWeek: ShoppingRecordDisplay[] = [];
    const lastWeek: ShoppingRecordDisplay[] = [];
    const older: ShoppingRecordDisplay[] = [];

    items.forEach((item) => {
      // bought_at は ISO 文字列 ("2025-12-08T14:17:52.941Z") と仮定
      const date = new Date(item.bought_at);

      // 比較は ms 単位（UTC ↔ ローカルは Date オブジェクトが調整する）
      if (date >= mondayThisWeek && date <= now) {
        thisWeek.push(item);
      } else if (date >= mondayLastWeek && date <= sundayLastWeek) {
        lastWeek.push(item);
      } else {
        older.push(item);
      }
    });

    return { thisWeek, lastWeek, older };
  }, [items]);

  // ==============================
  // 月ごと分類
  // ==============================
  const monthly = useMemo(() => {
    const now = new Date();

    // 今月
    const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayNextMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      1
    );

    // 先月
    const firstDayLastMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1
    );
    const lastDayLastMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      0,
      23,
      59,
      59,
      999
    );

    const thisMonth: ShoppingRecordDisplay[] = [];
    const lastMonth: ShoppingRecordDisplay[] = [];
    const older: ShoppingRecordDisplay[] = [];

    items.forEach((item) => {
      const date = new Date(item.bought_at);

      if (date >= firstDayThisMonth && date < firstDayNextMonth) {
        thisMonth.push(item);
      } else if (date >= firstDayLastMonth && date <= lastDayLastMonth) {
        lastMonth.push(item);
      } else {
        older.push(item);
      }
    });

    return { thisMonth, lastMonth, older };
  }, [items]);

  const hasData =
    weekly.thisWeek.length + weekly.lastWeek.length + weekly.older.length > 0;

  const mergeItemData = (
    dataShoppingRecords: ShoppingRecord[],
    dataItems: Item[]
  ): ShoppingRecordDisplay[] => {
    const itemMap = new Map(dataItems.map((i: Item) => [i.id, i]));
    const result: ShoppingRecordDisplay[] = dataShoppingRecords.map(
      (shopping) => {
        const item = itemMap.get(shopping.item_id);
        return {
          id: shopping.id,
          name: item ? item.name : "",
          quantity: shopping.quantity,
          price: shopping.price,
          store: shopping.store,
          image_url: item ? item.image_url : "",
          bought_at: shopping.bought_at,
        };
      }
    );
    return result;
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        // 購入履歴一覧取得
        const resRecords = (await api.get("/shopping-records")).data.data;
        // アイテム取得
        const resItems = (await api.get("/items")).data.data;

        // 表示アイテムの整形
        const mergeData = mergeItemData(resRecords, resItems);
        setItems(mergeData);
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

  const ShoppingRecordCard = (title: string, list: ShoppingRecordDisplay[]) => {
    if (list.length === 0) return null;
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const router = useRouter();

    return (
      <>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            fontSize: 16,
            fontWeight: 700,
            mt: 2,
            mb: 1,
          }}
        >
          {title}
        </Box>

        {list.map((item) => (
          <Card
            key={item.id}
            sx={{
              display: "flex",
              alignItems: "center",
              borderRadius: "16px",
              padding: 1.5,
              backgroundColor: "#FFFFFF",
              boxShadow: "0px 1px 4px rgba(0,0,0,0.05)",
              minHeight: 70,
              fontWeight: 700,
              mt: 2,
              mb: 1,
            }}
          >
            <CardMedia
              component="img"
              image={item.image_url}
              sx={{
                width: 40,
                height: 40,
                borderRadius: "10px",
                objectFit: "cover",
              }}
            />
            <CardContent
              sx={{
                flex: 1,
                padding: "8px 0 8px 12px",
                "&:last-child": { paddingBottom: "8px" },
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography
                sx={{ fontSize: 16, fontWeight: 700, lineHeight: 1.2 }}
              >
                {item.name}
              </Typography>
              <Typography sx={{ fontSize: 13, lineHeight: 1.2 }}>
                数量: {item.quantity} / 合計金額: ¥{item.price * item.quantity}
              </Typography>
            </CardContent>

            {/* 詳細画面 */}
            <IconButton
              onClick={() => {
                useShoppingRecordStoreStore.getState().setSelectedItem(item);
                router.push(`/shopping-record/${item.id}`);
              }}
              sx={{ color: "#B7B7B7" }}
            >
              <ArrowForwardIosIcon fontSize="small" />
            </IconButton>
          </Card>
        ))}
      </>
    );
  };

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
          marginBottom: 3,
        }}
      >
        <IconButton
          onClick={() => router.push("/dashboard")}
          sx={{ color: "#154718" }}
        >
          <ArrowBackIosNewIcon />
        </IconButton>

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
          購入履歴一覧
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

      {/* 週ごと / 月ごと */}
      <Box
        sx={{
          display: "flex",
          backgroundColor: "#F0F0F0",
          borderRadius: "50px",
          p: 0.6,
          mb: 3,
        }}
      >
        <Button
          fullWidth
          onClick={() => setMode("week")}
          sx={{
            backgroundColor: mode === "week" ? "#3ECF8E" : "transparent",
            borderRadius: "50px",
            textTransform: "none",
            fontWeight: 700,
            fontSize: 14,
            color: mode === "week" ? "#000" : "#7A7A7A",
          }}
        >
          週ごと
        </Button>

        <Button
          fullWidth
          onClick={() => setMode("month")}
          sx={{
            backgroundColor: mode === "month" ? "#3ECF8E" : "transparent",
            borderRadius: "50px",
            textTransform: "none",
            fontWeight: 700,
            fontSize: 14,
            color: mode === "month" ? "#000" : "#7A7A7A",
          }}
        >
          月ごと
        </Button>
      </Box>

      {/* データ表示 */}
      {hasData ? (
        <Box sx={{ px: 3, mt: 4, marginBottom: 10 }}>
          {mode === "week" ? (
            <>
              {ShoppingRecordCard("今週", weekly.thisWeek)}
              {ShoppingRecordCard("先週", weekly.lastWeek)}
              {ShoppingRecordCard("過去", weekly.older)}
            </>
          ) : (
            <>
              {ShoppingRecordCard("今月", monthly.thisMonth)}
              {ShoppingRecordCard("先月", monthly.lastMonth)}
              {ShoppingRecordCard("過去", monthly.older)}
            </>
          )}
        </Box>
      ) : (
        <Box sx={{ textAlign: "center", mt: 10 }}>
          <Typography sx={{ color: "#7A7A7A", textAlign: "center", mt: 4 }}>
            履歴がありません
          </Typography>
        </Box>
      )}

      <Footer />
    </Box>
  );
}
