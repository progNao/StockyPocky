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
} from "@mui/material";
import {
  ShoppingCart,
  Inventory2,
  Description,
  Home as HomeIcon,
  Settings,
} from "@mui/icons-material";
import { DashboardData } from "@/app/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth";
import { api } from "@/libs/api/client";
import { useEffect, useState } from "react";
import { useUserStore } from "@/stores/user";

// モックデータ（後で API データに差し替え）
const mockData: DashboardData = {
  userName: "ユーザー名",
  tasks: [
    { id: "t1", title: "キッチンの掃除", done: true },
    { id: "t2", title: "トイレットペーパーを補充", done: false },
    { id: "t3", title: "週末の買い出し計画", done: false },
  ],
  lowStockItems: [
    { id: "i1", name: "牛乳", remaining: 1, imageUrl: "/images/milk.jpg" },
    { id: "i2", name: "たまご", remaining: 2, imageUrl: "/images/eggs.jpg" },
  ],
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

  useEffect(() => {
    setDisplayName(username);
  }, [username]);

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

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCategory = () => {
    router.push("/category")
  }

  return (
    <Box
      sx={{
        p: 3,
        background: `#e9fff3`,
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
            <Typography sx={{ mt: 1, fontSize: 10 }}>在庫一覧</Typography>
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
                <Description fontSize="large" sx={{ color: "#32D26A" }} />
              </Box>
            </Box>
            <Typography sx={{ mt: 1, fontSize: 10 }}>メモ</Typography>
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
        <Stack spacing={2}>
          {data.lowStockItems.map((item) => (
            <Card
              key={item.id}
              sx={{
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                p: 1,
              }}
            >
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  position: "relative",
                  borderRadius: 1,
                  overflow: "hidden",
                  mr: 2,
                }}
              >
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Typography sx={{ fontWeight: 600 }}>{item.name}</Typography>
                <Typography variant="body2">
                  残り {item.remaining}
                  {item.remaining > 1 ? "個" : "本"}
                </Typography>
              </Box>
              <IconButton sx={{ color: "#32D26A" }}>
                <ShoppingCart />
              </IconButton>
            </Card>
          ))}
        </Stack>
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
          backgroundColor: "#ffffff",
          boxShadow: "0 -2px 8px rgba(0,0,0,0.1)",
          p: 1,
        }}
      >
        <Grid container>
          <Grid sx={{ textAlign: "center" }} size={{ xs: 3 }}>
            <IconButton>
              <HomeIcon />
            </IconButton>
            <Typography variant="caption">ホーム</Typography>
          </Grid>
          <Grid sx={{ textAlign: "center" }} size={{ xs: 3 }}>
            <IconButton>
              <Inventory2 />
            </IconButton>
            <Typography variant="caption">在庫</Typography>
          </Grid>
          <Grid sx={{ textAlign: "center" }} size={{ xs: 3 }}>
            <IconButton>
              <ShoppingCart />
            </IconButton>
            <Typography variant="caption">リスト</Typography>
          </Grid>
          <Grid sx={{ textAlign: "center" }} size={{ xs: 3 }}>
            <IconButton>
              <Description />
            </IconButton>
            <Typography variant="caption">分析</Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
