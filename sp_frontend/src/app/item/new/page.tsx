/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  MenuItem,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useRouter } from "next/navigation";
import { api } from "@/libs/api/client";
import axios from "axios";
import { Category } from "@/app/types";
import { uploadImage } from "@/libs/query/imageup";
import imageCompression from "browser-image-compression";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

export default function ItemNewPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [unit, setUnit] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [defaultQuantity, setDefaultQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [categoryId, setCategoryId] = useState(1);
  const [threshold, setThreshold] = useState(1);
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!name || !categoryId || !defaultQuantity) {
      return "アイテム名、カテゴリ、初期在庫数は必須です。";
    }
    return null;
  };

  const clear = () => {
    setName("");
    setBrand("");
    setUnit("");
    setImageUrl("");
    setDefaultQuantity(0);
    setNotes("");
    setIsFavorite(false);
    setCategoryId(0);
    setImageFile(null);
    setPreviewUrl(null);
    setThreshold(0);
    setLocation("");
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 800,
      useWebWorker: true,
    };

    try {
      const compressed = await imageCompression(file, options);

      // プレビュー用のURL
      const preview = URL.createObjectURL(compressed);
      setPreviewUrl(preview);

      // Firebase Storage にアップロードする用の File
      setImageFile(compressed);
    } catch (err) {
      console.error("画像圧縮エラー:", err);
    }
  };

  const handleCreate = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      setOpenErrorSnackbar(true);
      return;
    }
    try {
      setLoading(true);
      const url = await uploadImage(imageFile);
      const response = await api.post("/items", {
        name,
        brand,
        unit,
        image_url: url,
        default_quantity: defaultQuantity,
        notes,
        is_favorite: isFavorite,
        category_id: categoryId,
      });
      const itemId = response.data.data.id;
      await api.post("/stocks", {
        item_id: itemId,
        quantity: defaultQuantity,
        threshold: threshold,
        location: location,
      });
      setOpenSnackbar(true);
      clear();
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        // その他のサーバーエラー
        setError("サーバーエラーが発生しました。");
        setOpenErrorSnackbar(true);
        return;
      }
      // axios 以外のエラー（ネットワーク、予期せぬエラーなど）
      setError("ネットワークエラーが発生しました。");
      setOpenErrorSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        const data = await res.data.data;
        setCategories(data);
      } catch (err) {
        setError("カテゴリ取得エラー:" + err);
        setOpenErrorSnackbar(true);
      }
    };

    fetchCategories();
  }, []);

  const handleCount = (
    setter: (v: number) => void,
    value: number,
    diff: number
  ) => {
    const newValue = value + diff;
    if (newValue >= 0) setter(newValue);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#F2FFF5",
        padding: 3,
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
          アイテム登録
        </Typography>

        {/* お気に入りアイコン */}
        <IconButton
          onClick={() => setIsFavorite(!isFavorite)}
          sx={{
            color: isFavorite ? "red" : "gray",
            transition: "0.2s",
          }}
        >
          {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={2500}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          登録しました
        </Alert>
      </Snackbar>

      <Snackbar
        open={openErrorSnackbar}
        autoHideDuration={2500}
        onClose={() => setOpenErrorSnackbar(false)}
      >
        <Alert severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>

      {/* アイテム名 */}
      <Typography sx={{ fontWeight: 600, marginBottom: 1 }}>
        アイテム名 *
      </Typography>
      <TextField
        fullWidth
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="例：トイレットペーパー"
        InputProps={{
          sx: {
            backgroundColor: "white",
            borderRadius: "20px",
            paddingY: 0.5,
          },
        }}
        sx={{ marginBottom: 3 }}
      />

      {/* カテゴリ */}
      <Typography sx={{ fontWeight: 600, marginBottom: 1 }}>
        カテゴリ *
      </Typography>
      <TextField
        select
        fullWidth
        value={categoryId}
        onChange={(e) => setCategoryId(Number(e.target.value))}
        placeholder="カテゴリを選択"
        InputProps={{
          sx: {
            backgroundColor: "white",
            borderRadius: "20px",
            paddingY: 0.5,
          },
        }}
        sx={{ marginBottom: 3 }}
      >
        {categories.map((c) => (
          <MenuItem key={c.id} value={c.id}>
            {c.icon}
            {c.name}
          </MenuItem>
        ))}
      </TextField>

      {/* ブランド名 */}
      <Typography sx={{ fontWeight: 600, marginBottom: 1 }}>
        ブランド名
      </Typography>
      <TextField
        fullWidth
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
        placeholder="例：カインズ"
        InputProps={{
          sx: {
            backgroundColor: "white",
            borderRadius: "20px",
            paddingY: 0.5,
          },
        }}
        sx={{ marginBottom: 3 }}
      />

      {/* 単位 */}
      <Typography sx={{ fontWeight: 600, marginBottom: 1 }}>単位</Typography>
      <TextField
        fullWidth
        value={unit}
        onChange={(e) => setUnit(e.target.value)}
        placeholder="例：個"
        InputProps={{
          sx: {
            backgroundColor: "white",
            borderRadius: "20px",
            paddingY: 0.5,
          },
        }}
        sx={{ marginBottom: 3 }}
      />

      {/* 場所 */}
      <Typography sx={{ fontWeight: 600, marginBottom: 1 }}>場所</Typography>
      <TextField
        fullWidth
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="例：キッチンの棚"
        InputProps={{
          sx: {
            backgroundColor: "white",
            borderRadius: "20px",
            paddingY: 0.5,
          },
        }}
        sx={{ marginBottom: 3 }}
      />

      {/* 画像 */}
      <Box sx={{ marginBottom: 3 }}>
        <Button
          variant="contained"
          component="label"
          sx={{
            backgroundColor: "#32D26A",
            borderRadius: "20px",
            fontWeight: 700,
            paddingY: 1.5,
          }}
        >
          画像を選択する
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageChange}
          />
        </Button>

        {previewUrl && (
          <Box
            sx={{
              marginTop: 2,
              width: "200px", // 👈 固定幅に変更
              height: "200px",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              mx: "auto", // 👈 中央寄せ
            }}
          >
            <img
              src={previewUrl}
              alt="preview"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover", // 👈 トリミングして綺麗に見せる
                display: "block",
              }}
            />
          </Box>
        )}
      </Box>

      {/* 初期在庫数 */}
      <Box
        sx={{
          backgroundColor: "white",
          padding: 2,
          borderRadius: "20px",
          marginBottom: 3,
          boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography sx={{ fontWeight: 600, marginBottom: 1 }}>
          初期在庫数
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-end",
          }}
        >
          <IconButton
            onClick={() => handleCount(setDefaultQuantity, defaultQuantity, -1)}
            sx={{
              backgroundColor: "#E9F9ED",
              color: "#1A7F3B",
              marginRight: 4,
            }}
          >
            <RemoveIcon />
          </IconButton>

          <Typography sx={{ fontSize: 22, fontWeight: 700 }}>
            {defaultQuantity}
          </Typography>

          <IconButton
            onClick={() => handleCount(setDefaultQuantity, defaultQuantity, 1)}
            sx={{
              backgroundColor: "#32D26A",
              color: "#FFFFFF",
              marginLeft: 4,
            }}
          >
            <AddIcon />
          </IconButton>
        </Box>
      </Box>

      {/* 閾値 */}
      <Box
        sx={{
          backgroundColor: "white",
          padding: 2,
          borderRadius: "20px",
          marginBottom: 3,
          boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography sx={{ fontWeight: 600, marginBottom: 1 }}>閾値</Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-end",
          }}
        >
          <IconButton
            onClick={() => handleCount(setThreshold, threshold, -1)}
            sx={{
              backgroundColor: "#E9F9ED",
              color: "#1A7F3B",
              marginRight: 4,
            }}
          >
            <RemoveIcon />
          </IconButton>

          <Typography sx={{ fontSize: 22, fontWeight: 700 }}>
            {threshold}
          </Typography>

          <IconButton
            onClick={() => handleCount(setThreshold, threshold, 1)}
            sx={{
              backgroundColor: "#32D26A",
              color: "#FFFFFF",
              marginLeft: 4,
            }}
          >
            <AddIcon />
          </IconButton>
        </Box>
      </Box>

      {/* メモ */}
      <Typography sx={{ fontWeight: 600, marginBottom: 1 }}>
        メモ（任意）
      </Typography>
      <TextField
        fullWidth
        multiline
        minRows={3}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="メモを入力"
        InputProps={{
          sx: {
            backgroundColor: "white",
            borderRadius: "20px",
            paddingY: 1,
          },
        }}
        sx={{ marginBottom: 4 }}
      />

      {/* 登録ボタン */}
      <Button
        fullWidth
        variant="contained"
        sx={{
          backgroundColor: "#32D26A",
          paddingY: 2,
          borderRadius: "40px",
          fontWeight: 700,
          fontSize: "18px",
          color: "#FFFFFF",
          boxShadow: "0 8px 16px rgba(50,210,106,0.4)",
          "&:hover": {
            backgroundColor: "#29C05F",
          },
        }}
        onClick={handleCreate}
        disabled={loading}
      >
        {loading ? (
          <CircularProgress size={26} sx={{ color: "white" }} />
        ) : (
          "登録する"
        )}
      </Button>
    </Box>
  );
}
