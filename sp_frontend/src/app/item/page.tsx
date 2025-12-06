"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Card,
  CardContent,
  CardMedia,
  Fab,
  Snackbar,
  Alert,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/navigation";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { Category, Item, ItemListDisplay, Stock } from "../types";
import { api } from "@/libs/api/client";
import LoadingScreen from "@/components/LoadingScreen";
import CategoryIcon2 from '@mui/icons-material/Category';
import { useItemStore } from "@/stores/item";

export default function ItemsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [itemList, setItemList] = useState<ItemListDisplay[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [error, setError] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState("");

  const filteredItems = itemList.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  )
  .filter((item) => {
    if (filter === "all") return true;
    if (filter === "favorite") return item.isFavorite === true;
    if (filter === "low") return item.stockQuantity < item.threshold;
    if (filter === "category") {
      if (!selectedCategoryName) return true; // カテゴリ未選択なら全て表示
      return item.categoryName === selectedCategoryName;
    }
    return true;
  });

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
        categoryName: categoryMap.get(item.category_id) ?? "未分類",
        stockQuantity: stock ? stock.quantity : 0,
        isFavorite: item.is_favorite,
        threshold: stock ? stock.threshold : 0,
        imageUrl: item.image_url,
        location: stock ? stock.location : "",
      };
    });
    return result;
  };

  useEffect(() => {
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
        setItemList(mergeData);
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
          アイテム一覧
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

      {/* 🔍 検索欄 */}
      <TextField
        placeholder="アイテムを検索"
        fullWidth
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        InputProps={{
          sx: {
            backgroundColor: "white",
            borderRadius: "40px",
            marginBottom: 2,
            height: 48,
          },
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: "#7BA087" }} />
            </InputAdornment>
          ),
        }}
      />

      {/* フィルタボタン */}
      <Box sx={{ display: "flex", gap: 1.5, marginBottom: 3 }}>
        {/* カテゴリ */}
        {categories.map((cat) => (
          <Chip
            icon={
              <CategoryIcon2
                sx={{ color: selectedCategoryId === cat.id ? "white" : "#32D26A" }}
              />
            }
            key={cat.id}
            label={cat.name}
            onClick={() => {
              setFilter(selectedCategoryId === cat.id ? "all" : "category");
              setSelectedCategoryId(selectedCategoryId === cat.id ? null : cat.id);
              setSelectedCategoryName(cat.name);
            }}
            sx={{
              height: 36,
              fontSize: 14,
              fontWeight: 700,
              borderRadius: "18px",
              paddingX: 1,
              backgroundColor: selectedCategoryId === cat.id ? "#32D26A" : "#ffffff",
              color: selectedCategoryId === cat.id ? "white" : "#333",
              boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
              "& .MuiChip-icon": {
                color: selectedCategoryId === cat.id ? "white" : "#32D26A",
              },
            }}
          />
        ))}

        {/* 低在庫 */}
        <Chip
          icon={
            <Inventory2Icon
              sx={{ color: filter === "low" ? "white" : "#32D26A" }}
            />
          }
          label="低在庫"
          onClick={() => setFilter(filter === "low" ? "all" : "low")}
          sx={{
            height: 40,
            fontSize: 15,
            fontWeight: 700,
            borderRadius: "20px",
            paddingX: 1,
            backgroundColor: filter === "low" ? "#32D26A" : "#ffffff",
            color: filter === "low" ? "white" : "#333",
            boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
            "& .MuiChip-icon": {
              color: filter === "low" ? "white" : "#32D26A",
            },
          }}
        />

        {/* お気に入り */}
        <Chip
          icon={
            <FavoriteBorderIcon
              sx={{ color: filter === "favorite" ? "white" : "#32D26A" }}
            />
          }
          label="お気に入り"
          onClick={() => setFilter(filter === "favorite" ? "all" : "favorite")}
          sx={{
            height: 40,
            fontSize: 15,
            fontWeight: 700,
            borderRadius: "20px",
            paddingX: 1,
            backgroundColor: filter === "favorite" ? "#32D26A" : "#ffffff",
            color: filter === "favorite" ? "white" : "#333",
            boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
            "& .MuiChip-icon": {
              color: filter === "favorite" ? "white" : "#32D26A",
            },
          }}
        />
      </Box>

      {/* アイテムリスト */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {filteredItems.length === 0 ? (
          <Typography sx={{ color: "#7A7A7A", textAlign: "center", mt: 4 }}>
            一致するカテゴリがありません
          </Typography>
        ) : (
          filteredItems.map((item) => (
            <Card
              key={item.id}
              onClick={() => {
                useItemStore.getState().setSelectedItem(item);
                router.push(`/item/${item.id}`);
              }}
              sx={{
                display: "flex",
                alignItems: "center",
                borderRadius: "20px",
                padding: 2,
                backgroundColor: "#FFFFFF",
                boxShadow: "0px 1px 4px rgba(0,0,0,0.05)",
                border:
                  item.stockQuantity < item.threshold
                    ? "3px solid #FBBF24"
                    : "none",
                cursor: "pointer",
              }}
            >
              <CardMedia
                component="img"
                image={item.imageUrl}
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "12px",
                  objectFit: "cover",
                }}
              />

              <CardContent sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: 13, color: "#4A9160" }}>
                  {item.categoryName}
                </Typography>
                <Typography sx={{ fontSize: 18, fontWeight: 700 }}>
                  {item.name}
                </Typography>

                <Typography sx={{ fontSize: 14 }}>
                  在庫数：{item.stockQuantity}
                  {item.stockQuantity < item.threshold && (
                    <span style={{ color: "#D97706", fontWeight: "bold" }}>
                      （残りわずか）
                    </span>
                  )}
                </Typography>
              </CardContent>

              {/* お気に入り */}
              <IconButton sx={{ marginRight: 1 }}>
                {item.isFavorite ? (
                  <FavoriteIcon sx={{ color: "pink" }} />
                ) : (
                  <FavoriteBorderIcon sx={{ color: "#B7B7B7" }} />
                )}
              </IconButton>
            </Card>
          ))
        )}
      </Box>

      {/* 右下の追加ボタン */}
      <Fab
        color="success"
        onClick={() => router.push("/item/new")}
        sx={{
          position: "fixed",
          bottom: 40,
          right: 30,
          backgroundColor: "#3ECF8E",
        }}
      >
        <AddIcon sx={{ fontSize: 32 }} />
      </Fab>
    </Box>
  );
}
