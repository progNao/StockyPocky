"use client";

import {
  Box,
  Typography,
  Card,
  Grid,
  IconButton,
  Stack,
  Button,
  MenuItem,
  Menu,
  Fab,
  CardMedia,
  CardContent,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  ShoppingCart,
  Inventory2,
  Description,
  Home as HomeIcon,
  Settings,
  Add,
} from "@mui/icons-material";
import {
  Category,
  DashboardData,
  Item,
  ItemListDisplay,
  Stock,
} from "@/app/types";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth";
import { api } from "@/libs/api/client";
import { useEffect, useState } from "react";
import { useUserStore } from "@/stores/user";
import ListAltIcon from "@mui/icons-material/ListAlt";
import LoadingScreen from "@/components/LoadingScreen";

// モックデータ（後で API データに差し替え）
const mockData: DashboardData = {
  userName: "ユーザー名",
  tasks: [
    { id: "t1", title: "キッチンの掃除", done: true },
    { id: "t2", title: "トイレットペーパーを補充", done: false },
    { id: "t3", title: "週末の買い出し計画", done: false },
  ],
  lowStockItems: [],
  recentShoppingLists: [
    { id: "s1", name: "週末の買い出し", itemCount: 8 },
    { id: "s2", name: "ドラッグストア", itemCount: 3 },
  ],
};

export default function DashboardPage() {
  const data = mockData;
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

  const handleCategory = () => {
    router.push("/category");
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
    return result.filter((item) =>
      isLowStock(item.stockQuantity, item.threshold)
    );
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

        // 表示アイテムの整形
        const mergeData = mergeItemData(dataItems, dataCategories, dataStocks);
        setLowStockItemList(mergeData);
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
        <MenuItem onClick={handleCategory}>カテゴリ一覧</MenuItem>
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
                sx={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  backgroundColor: "rgba(50,210,106,0.15)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Inventory2 fontSize="large" sx={{ color: "#32D26A" }} />
              </Box>
            </Box>
            <Typography sx={{ mt: 1, fontSize: 10 }}>在庫</Typography>
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
                sx={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  backgroundColor: "rgba(50,210,106,0.15)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
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
          {data.tasks.map((task) => (
            <Card
              key={task.id}
              sx={{
                borderRadius: 2,
                backgroundColor: task.done ? "#e0f7e9" : "#fff",
                p: 2,
              }}
            >
              <Typography
                sx={{ textDecoration: task.done ? "line-through" : "none" }}
              >
                {task.title}
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
                  cursor: "pointer",
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

                {/* 買い物リストに追加 */}
              </Card>
            ))
          )}
        </Box>
      </Box>

      {/* 最近の買い物リスト */}
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            最近の買い物リスト
          </Typography>
          <Button size="small">すべて表示</Button>
        </Box>
        <Grid container spacing={2}>
          {data.recentShoppingLists.map((list) => (
            <Grid size={{ xs: 6 }} key={list.id}>
              <Card sx={{ borderRadius: 2, p: 2, backgroundColor: "#e9fff3" }}>
                <Typography sx={{ fontWeight: 600 }}>{list.name}</Typography>
                <Typography variant="body2">{list.itemCount}品</Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* 下部ナビバー（仮） */}
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "rgba(255,255,255,0.95)",
          borderTopLeftRadius: "28px",
          borderTopRightRadius: "28px",
          boxShadow: "0 -6px 20px rgba(0,0,0,0.08)",
          paddingTop: 2,
          paddingBottom: 3,
          zIndex: 1000,
        }}
      >
        <Grid
          container
          justifyContent="space-around"
          alignItems="center"
          sx={{ position: "relative" }}
        >
          {/* ホーム */}
          <Grid>
            <Box
              sx={{ textAlign: "center", cursor: "pointer" }}
              onClick={() => router.push("/dashboard")}
            >
              <HomeIcon sx={{ color: "#32D26A", fontSize: 28 }} />
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#32D26A",
                  mt: 0.5,
                }}
              >
                ホーム
              </Typography>
            </Box>
          </Grid>

          {/* 在庫 */}
          <Grid>
            <Box
              sx={{ textAlign: "center", cursor: "pointer" }}
              onClick={() => router.push("/inventory")}
            >
              <Inventory2 sx={{ color: "#7A7A7A", fontSize: 28 }} />
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#7A7A7A",
                  mt: 0.5,
                }}
              >
                在庫
              </Typography>
            </Box>
          </Grid>

          {/* 中央の丸ボタン（デザイン完全一致） */}
          <Grid>
            <Fab
              onClick={() => router.push("/item/new")}
              sx={{
                backgroundColor: "#32D26A",
                color: "#FFFFFF",
                width: 70,
                height: 70,
                position: "absolute",
                left: "50%",
                top: "-30px",
                transform: "translateX(-50%)",
                boxShadow: "0 8px 18px rgba(50,210,106,0.35)",
                "&:hover": { backgroundColor: "#29C05F" },
              }}
            >
              <Add sx={{ fontSize: 34 }} />
            </Fab>
          </Grid>

          {/* リスト */}
          <Grid>
            <Box
              sx={{ textAlign: "center", cursor: "pointer" }}
              onClick={() => router.push("/list")}
            >
              <ShoppingCart sx={{ color: "#7A7A7A", fontSize: 28 }} />
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#7A7A7A",
                  mt: 0.5,
                }}
              >
                リスト
              </Typography>
            </Box>
          </Grid>

          {/* 分析 */}
          <Grid>
            <Box
              sx={{ textAlign: "center", cursor: "pointer" }}
              onClick={() => router.push("/analysis")}
            >
              <Description sx={{ color: "#7A7A7A", fontSize: 28 }} />
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#7A7A7A",
                  mt: 0.5,
                }}
              >
                メモ
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
