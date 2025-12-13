"use client";

import {
  Box,
  Typography,
  IconButton,
  MenuItem,
  Menu,
  Snackbar,
  Alert,
} from "@mui/material";
import { Settings } from "@mui/icons-material";
import {
  Category,
  Item,
  ItemListDisplay,
  Memo,
  ShoppingList,
  ShoppingListDisplay,
  Stock,
} from "@/app/types";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth";
import { api } from "@/libs/api/client";
import { useCallback, useEffect, useState } from "react";
import { useUserStore } from "@/stores/user";
import LoadingScreen from "@/components/LoadingScreen";
import Footer from "@/components/Footer";
import DashboardMenuCard from "@/components/DashboardMenuCard";
import DashboardStock from "@/components/DashboardStock";
import DashboardShoppingList from "@/components/DashboardShoppingList";
import DashboardMemo from "@/components/DashboardMemo";
import { useFormatDate } from "@/hooks/useFormatDate";

export default function DashboardPage() {
  const router = useRouter();
  const { logout } = useAuthStore();
  const username = useUserStore((state) => state.username);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const { clearUser } = useUserStore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [lowStockItemList, setLowStockItemList] = useState<ItemListDisplay[]>(
    []
  );
  const [, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [error, setError] = useState("");
  const [shoppingList, setShoppingList] = useState<ShoppingListDisplay[]>([]);
  const [memoList, setMemoList] = useState<Memo[]>([]);
  const { formatDate } = useFormatDate();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
    } finally {
      clearUser();
      localStorage.removeItem("access_token");
      logout();
      document.cookie = "access_token=; Max-Age=0; path=/;";

      router.push("/?logout=1");
    }
  };

  const isLowStock = (stock: number, threshold: number) => {
    const ratio = stock / threshold;
    if (ratio <= 0.2) return true;
    return false;
  };

  const mergeItemData = useCallback(
    (
      dataItems: Item[],
      dataCategories: Category[],
      dataStocks: Stock[]
    ): ItemListDisplay[] => {
      const categoryMap = new Map(
        dataCategories.map((c: Category) => [c.id, c.name])
      );
      const stockMap = new Map(dataStocks.map((s: Stock) => [s.item_id, s]));
      const result: ItemListDisplay[] = dataItems.map((item) => {
        const stock = stockMap.get(item.id);
        return {
          id: item.id,
          name: item.name,
          categoryId: item.category_id,
          categoryName: categoryMap.get(item.category_id) ?? "未分類",
          stockQuantity: stock ? stock.quantity : 0,
          isFavorite: item.is_favorite,
          threshold: stock ? stock.threshold : 0,
          imageUrl: item.image_url,
          location: stock ? stock.location : "",
        };
      });
      return result
        .filter((item) => isLowStock(item.stockQuantity, item.threshold))
        .slice(0, 3);
    },
    []
  );

  const mergeShoppingData = useCallback(
    (
      dataItems: Item[],
      dataShopping: ShoppingList[]
    ): ShoppingListDisplay[] => {
      const itemMap = new Map(dataItems.map((i: Item) => [i.id, i]));
      const result: ShoppingListDisplay[] = dataShopping.map((shopping) => {
        const item = itemMap.get(shopping.item_id);
        return {
          id: shopping.id,
          quantity: shopping.quantity,
          checked: shopping.checked,
          user_id: shopping.user_id,
          item_id: shopping.item_id,
          name: item ? item.name : "",
          image_url: item ? item.image_url : "",
          notes: item ? item.notes : "",
          added_at: shopping.added_at,
        };
      });
      return result
        .sort(
          (a, b) =>
            new Date(b.added_at).getTime() - new Date(a.added_at).getTime()
        )
        .slice(0, 3);
    },
    []
  );

  useEffect(() => {
    setDisplayName(username);
    const fetchAll = async () => {
      try {
        setLoading(true);
        // アイテム一覧取得
        const resItems = await api.get("/items");
        const dataItems = resItems.data.data;
        // カテゴリ一覧取得
        const resCategories = await api.get("/categories");
        const dataCategories = resCategories.data.data;
        setCategories(dataCategories);
        // 在庫一覧取得
        const resStocks = await api.get("/stocks");
        const dataStocks = resStocks.data.data;
        // 買い物リスト取得
        const resShopping = await api.get("/shopping-list");
        const dataShopping = resShopping.data.data;
        // メモ一覧取得
        const resMemo = await api.get("/memos");
        const dataMemo = resMemo.data.data;
        setMemoList(dataMemo);

        // 表示アイテムの整形
        const mergeData = mergeItemData(dataItems, dataCategories, dataStocks);
        setLowStockItemList(mergeData);
        const mergeShopping = mergeShoppingData(dataItems, dataShopping);
        setShoppingList(mergeShopping);
      } catch (err) {
        setError("データ取得エラー：" + err);
        setOpenErrorSnackbar(true);
      } finally {
        // 全て整形し終わってからロード解除
        setLoading(false);
      }
    };

    fetchAll();
  }, [username, mergeItemData, mergeShoppingData]);

  if (loading) return <LoadingScreen />;

  return (
    <Box
      sx={{
        p: 3,
        background: `#e9fff3`,
        paddingBottom: "120px",
      }}
    >
      {/* ヘッダー */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 4,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          こんにちは！ {displayName} さん
        </Typography>
        <IconButton
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            bgcolor: "rgba(50,210,106,0.15)",
            "&:hover": { bgcolor: "#e0e0e0" },
          }}
        >
          <Settings />
        </IconButton>
      </Box>

      <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
        <MenuItem onClick={handleLogout}>ログアウト</MenuItem>
      </Menu>

      {/* メインメニューカード */}
      <DashboardMenuCard />

      {/* 今日のタスク */}
      <DashboardMemo memos={memoList} />

      {/* 在庫不足のアイテム */}
      <DashboardStock items={lowStockItemList} isLowStock={isLowStock} />

      {/* 最近の買い物リスト */}
      <DashboardShoppingList items={shoppingList} formatDate={formatDate} />

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
