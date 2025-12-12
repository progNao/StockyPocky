"use client";

import {
  Box,
  Typography,
  Card,
  Grid,
  IconButton,
  Stack,
  MenuItem,
  Menu,
  CardMedia,
  CardContent,
  Snackbar,
  Alert,
} from "@mui/material";
import { ShoppingCart, Settings } from "@mui/icons-material";
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
import { useEffect, useState } from "react";
import { useUserStore } from "@/stores/user";
import ListAltIcon from "@mui/icons-material/ListAlt";
import LoadingScreen from "@/components/LoadingScreen";
import FooterDashBoard from "@/components/FooterDashBoard";
import HistoryIcon from "@mui/icons-material/History";

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

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout"); // 正常レスポンスのみ想定
      clearUser();
      localStorage.removeItem("access_token");
      logout(); // ← 画面側でトークン破棄
      document.cookie = "access_token=; Max-Age=0; path=/;";
      router.push("/");
    } catch {
      // エラーがあってもフロント側で破棄してログイン画面へ
      logout();
      router.push("/");
    }
  };

  const isLowStock = (stock: number, threshold: number) => {
    const ratio = stock / threshold;
    if (ratio <= 0.2) return true;

    return false;
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const mergeItemData = (
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
  };

  const mergeShoppingData = (
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
  };

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
  }, [username]);

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
          onClick={handleMenuOpen}
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

      <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
        <MenuItem onClick={handleLogout}>ログアウト</MenuItem>
        <MenuItem onClick={() => router.push("/category")}>カテゴリ一覧</MenuItem>
        <MenuItem onClick={() => router.push("/memo")}>メモ一覧</MenuItem>
      </Menu>

      <Snackbar
        open={openErrorSnackbar}
        autoHideDuration={2500}
        onClose={() => setOpenErrorSnackbar(false)}
      >
        <Alert severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>

      {/* メインメニューカード */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid size={{ xs: 4 }} textAlign="center">
          <Card sx={{ borderRadius: 2, p: 2, textAlign: "center" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box
                onClick={() => router.push("/shopping-record")}
                sx={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  backgroundColor: "rgba(50,210,106,0.15)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <HistoryIcon fontSize="large" sx={{ color: "#32D26A" }} />
              </Box>
            </Box>
            <Typography sx={{ mt: 1, fontSize: 10 }}>購入履歴</Typography>
          </Card>
        </Grid>
        <Grid size={{ xs: 4 }}>
          <Card sx={{ borderRadius: 2, p: 2, textAlign: "center" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box
                onClick={() => router.push("/item")}
                sx={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  backgroundColor: "rgba(50,210,106,0.15)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <ListAltIcon fontSize="large" sx={{ color: "#32D26A" }} />
              </Box>
            </Box>
            <Typography sx={{ mt: 1, fontSize: 10 }}>アイテムリスト</Typography>
          </Card>
        </Grid>
        <Grid size={{ xs: 4 }}>
          <Card sx={{ borderRadius: 2, p: 2, textAlign: "center" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box
                onClick={() => router.push("/shopping-list")}
                sx={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  backgroundColor: "rgba(50,210,106,0.15)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <ShoppingCart fontSize="large" sx={{ color: "#32D26A" }} />
              </Box>
            </Box>
            <Typography sx={{ mt: 1, fontSize: 10 }}>買い物リスト</Typography>
          </Card>
        </Grid>
      </Grid>

      {/* 今日のタスク */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          今日のタスクとメモ
        </Typography>
        <Stack spacing={1}>
          {memoList.map((memo) => (
            <Card
              key={memo.id}
              sx={{
                borderRadius: 2,
                backgroundColor: memo.is_done ? "#e0f7e9" : "#fff",
                p: 2,
              }}
            >
              <Typography
                sx={{ textDecoration: memo.is_done ? "line-through" : "none" }}
              >
                {memo.title}
              </Typography>
            </Card>
          ))}
        </Stack>
      </Box>

      {/* 在庫不足のアイテム */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          在庫不足のアイテム
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {lowStockItemList.length === 0 ? (
            <Typography sx={{ color: "#7A7A7A", textAlign: "center", mt: 4 }}>
              在庫不足のアイテムはありません
            </Typography>
          ) : (
            lowStockItemList.map((item) => (
              <Card
                key={item.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  borderRadius: "16px",
                  padding: 1.5,
                  backgroundColor: "#FFFFFF",
                  boxShadow: "0px 1px 4px rgba(0,0,0,0.05)",
                  border: isLowStock(item.stockQuantity, item.threshold)
                    ? "3px solid #FBBF24"
                    : "none",
                  minHeight: 70,
                }}
              >
                <CardMedia
                  component="img"
                  image={item.imageUrl}
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: "10px",
                    objectFit: "cover",
                  }}
                />

                <CardContent
                  sx={{
                    flex: 1,
                    padding: "8px 0 8px 12px",
                    "&:last-child": { paddingBottom: "8px" },
                  }}
                >
                  <Typography
                    sx={{ fontSize: 12, color: "#4A9160", lineHeight: 1.2 }}
                  >
                    {item.categoryName}
                  </Typography>
                  <Typography
                    sx={{ fontSize: 16, fontWeight: 700, lineHeight: 1.2 }}
                  >
                    {item.name}
                  </Typography>

                  <Typography sx={{ fontSize: 13, lineHeight: 1.2 }}>
                    在庫数：{item.stockQuantity}
                    {isLowStock(item.stockQuantity, item.threshold) && (
                      <span style={{ color: "#D97706", fontWeight: "bold" }}>
                        （残りわずか）
                      </span>
                    )}
                  </Typography>
                </CardContent>
              </Card>
            ))
          )}
        </Box>
      </Box>

      {/* 最近の買い物リスト */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          最近の買い物リスト
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {shoppingList.length === 0 ? (
            <Typography sx={{ color: "#7A7A7A", textAlign: "center", mt: 4 }}>
              買い物リストのアイテムはありません
            </Typography>
          ) : (
            shoppingList.map((item) => (
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
                }}
              >
                {/* 画像 */}
                <CardMedia
                  component="img"
                  image={item.image_url}
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: "10px",
                    objectFit: "cover",
                  }}
                />

                {/* 名称 + 購入数 */}
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
                    購入数：{item.quantity}
                  </Typography>
                  <Typography sx={{ fontSize: 13, lineHeight: 1.2 }}>
                    {formatDate(item.added_at)}
                  </Typography>
                </CardContent>

                {/* メモ */}
                <Box
                  sx={{
                    minWidth: 120,
                    paddingLeft: 1,
                    paddingRight: 1.5,
                    display: "flex",
                    alignItems: "center",
                    border: item.notes ? "1px solid #00000020" : "",
                    borderRadius: "6px",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 12,
                      color: "#555",
                      whiteSpace: "pre-line",
                      wordBreak: "break-word",
                    }}
                  >
                    {item.notes || ""}
                  </Typography>
                </Box>
              </Card>
            ))
          )}
        </Box>
      </Box>

      {/* 下部ナビバー（仮） */}
      <FooterDashBoard />
    </Box>
  );
}
