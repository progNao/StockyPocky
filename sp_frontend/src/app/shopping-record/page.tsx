"use client";

import { useEffect, useMemo, useState } from "react";
import { Box, Typography, Button, Alert, Snackbar } from "@mui/material";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import { api } from "@/libs/api/client";
import { Item, ShoppingRecord, ShoppingRecordDisplay } from "../types";
import Header from "@/components/Header";
import ShoppingRecordCard from "@/components/ShoppingRecordCard";

export default function ShoppingRecordPage() {
  const router = useRouter();
  const [items, setItems] = useState<ShoppingRecordDisplay[]>([]);
  const [mode, setMode] = useState<"week" | "month">("week");
  const [error, setError] = useState("");
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);

  const getStartOfWeekMonday = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const dayIndex = (d.getDay() + 6) % 7;
    d.setDate(d.getDate() - dayIndex);
    return d;
  };

  const weekly = useMemo(() => {
    const now = new Date();
    const mondayThisWeek = getStartOfWeekMonday(now);
    const mondayLastWeek = new Date(mondayThisWeek);
    mondayLastWeek.setDate(mondayThisWeek.getDate() - 7);
    mondayLastWeek.setHours(0, 0, 0, 0);
    const sundayLastWeek = new Date(mondayThisWeek);
    sundayLastWeek.setDate(mondayThisWeek.getDate() - 1);
    sundayLastWeek.setHours(23, 59, 59, 999);
    const thisWeek: ShoppingRecordDisplay[] = [];
    const lastWeek: ShoppingRecordDisplay[] = [];
    const older: ShoppingRecordDisplay[] = [];

    items.forEach((item) => {
      const date = new Date(item.bought_at);
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

  const monthly = useMemo(() => {
    const now = new Date();

    const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayNextMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      1
    );
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
    const fetchShoppingRecord = async () => {
      try {
        const res = (await api.get("/shopping-records")).data.data;
        const resItems = (await api.get("/items")).data.data;

        const mergeData = mergeItemData(res, resItems);
        setItems(mergeData);
      } catch (err) {
        setError("購入履歴取得エラー：" + err);
        setOpenErrorSnackbar(true);
      }
    };

    fetchShoppingRecord();
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
      <Header
        title="購入履歴リスト"
        onBackAction={() => router.push("/dashboard")}
      />

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
              <ShoppingRecordCard title="今週" list={weekly.thisWeek} />
              <ShoppingRecordCard title="先週" list={weekly.lastWeek} />
              <ShoppingRecordCard title="過去" list={weekly.older} />
            </>
          ) : (
            <>
              <ShoppingRecordCard title="今月" list={monthly.thisMonth} />
              <ShoppingRecordCard title="先月" list={monthly.lastMonth} />
              <ShoppingRecordCard title="過去" list={monthly.older} />
            </>
          )}
        </Box>
      ) : (
        <Box sx={{ textAlign: "center", mt: 10 }}>
          <Typography sx={{ color: "#7A7A7A", textAlign: "center", mt: 4 }}>
            履歴はありません
          </Typography>
        </Box>
      )}

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
