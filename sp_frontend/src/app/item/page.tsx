"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Card,
  CardContent,
  CardMedia,
  Snackbar,
  Alert,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useRouter } from "next/navigation";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { Category, Item, ItemListDisplay, Stock } from "../types";
import { api } from "@/libs/api/client";
import LoadingScreen from "@/components/LoadingScreen";
import CategoryIcon2 from "@mui/icons-material/Category";
import { useItemStore } from "@/stores/item";
import Footer from "@/components/Footer";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Header from "@/components/Header";
import FabButton from "@/components/FabButton";
import ItemFilterChips from "@/components/ItemFilterChip";

export default function ItemsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [itemList, setItemList] = useState<ItemListDisplay[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [error, setError] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [selectedCategoryName, setSelectedCategoryName] = useState("");

  const isLowStock = (stock: number, threshold: number) => {
    const ratio = stock / threshold;
    if (ratio <= 0.2) return true;
    return false;
  };

  const filteredItems = itemList
    .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
    .filter((item) => {
      if (filter === "all") return true;
      if (filter === "favorite") return item.isFavorite === true;
      if (filter === "low")
        return isLowStock(item.stockQuantity, item.threshold);
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
        categoryId: item.category_id,
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
    const fetchItem = async () => {
      try {
        setLoading(true);
        const resItems = await api.get("/items");
        const dataItems = resItems.data.data;
        const resCategories = await api.get("/categories");
        const dataCategories = resCategories.data.data;
        setCategories(dataCategories);
        const resStocks = await api.get("/stocks");
        const dataStocks = resStocks.data.data;

        const mergeData = mergeItemData(dataItems, dataCategories, dataStocks);
        setItemList(mergeData);
      } catch (err) {
        setError("アイテム取得エラー：" + err);
        setOpenErrorSnackbar(true);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
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
      <Header
        title="アイテムリスト"
        onBackAction={() => router.push("/dashboard")}
      />

      {/* 🔍 検索欄 */}
      <TextField
        placeholder="アイテムを検索"
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
      />

      {/* フィルタボタン */}
      <ItemFilterChips
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        filter={filter}
        CategoryIcon={CategoryIcon2}
        onChangeFilter={(f) => setFilter(f)}
        onSelectCategory={(cat) => {
          setSelectedCategoryId(cat ? cat.id : null);
          setSelectedCategoryName(cat ? cat.name : "");
        }}
      />

      {/* アイテムリスト */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          marginBottom: 20,
        }}
      >
        {filteredItems.length === 0 ? (
          <Typography sx={{ color: "#7A7A7A", textAlign: "center", mt: 4 }}>
            アイテムはありません
          </Typography>
        ) : (
          filteredItems.map((item) => (
            <Card
              key={item.id}
              sx={{
                display: "flex",
                alignItems: "center",
                borderRadius: "20px",
                padding: 2,
                backgroundColor: "#FFFFFF",
                boxShadow: "0px 1px 4px rgba(0,0,0,0.05)",
                border: isLowStock(item.stockQuantity, item.threshold)
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
                <Typography sx={{ fontSize: 9, color: "#4A9160" }}>
                  {item.categoryName}
                </Typography>
                <Typography sx={{ fontSize: 10, fontWeight: 700 }}>
                  {item.name}
                </Typography>

                <Typography sx={{ fontSize: 12 }}>
                  在庫数：{item.stockQuantity}
                  {isLowStock(item.stockQuantity, item.threshold) && (
                    <p
                      style={{
                        color: "#D97706",
                        fontWeight: "bold",
                        fontSize: 7,
                      }}
                    >
                      （残りわずか）
                    </p>
                  )}
                </Typography>
              </CardContent>

              {/* お気に入り */}
              <IconButton>
                {item.isFavorite ? (
                  <FavoriteIcon sx={{ color: "pink" }} fontSize="small" />
                ) : (
                  <FavoriteBorderIcon
                    sx={{ color: "#B7B7B7" }}
                    fontSize="small"
                  />
                )}
              </IconButton>

              {/* 購入 */}
              <IconButton
                onClick={() => router.push(`/shopping-record/buy/${item.id}`)}
              >
                <PriceCheckIcon sx={{ color: "blue" }} fontSize="small" />
              </IconButton>

              {/* 詳細画面 */}
              <IconButton
                onClick={() => {
                  useItemStore.getState().setSelectedItem(item);
                  router.push(`/item/${item.id}`);
                }}
                sx={{ color: "#B7B7B7" }}
              >
                <ArrowForwardIosIcon fontSize="small" />
              </IconButton>
            </Card>
          ))
        )}
      </Box>

      <FabButton onClick={() => router.push("/item/new")} />

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
