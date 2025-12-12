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
import { useRouter } from "next/navigation";
import { api } from "@/libs/api/client";
import axios from "axios";
import { Category } from "@/app/types";
import { uploadImage } from "@/libs/query/imageup";
import imageCompression from "browser-image-compression";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useItemStore } from "@/stores/item";
import DangerButton from "@/components/DangerButton";

export default function ItemEditPage() {
  const router = useRouter();
  const item = useItemStore().selectedItem;
  const [itemId] = useState(item ? item.id : 0);
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [unit, setUnit] = useState("");
  const [defaultQuantity, setDefaultQuantity] = useState<number>(0);
  const [notes, setNotes] = useState("");
  const [isFavorite, setIsFavorite] = useState<boolean>();
  const [categoryId, setCategoryId] = useState<number>(
    item ? item.categoryId : 1
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let changeFlg = false;

  const validate = () => {
    if (!name || !categoryId) {
      return "アイテム名、カテゴリは必須です。";
    }
    return null;
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    changeFlg = true;
    const file = e.target.files?.[0];
    if (!file) {
      setPreviewUrl(imageUrl);
      return;
    }

    setImageFile(file);
    setImageUrl(URL.createObjectURL(file));

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

  const handleUpdate = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      setOpenErrorSnackbar(true);
      return;
    }
    try {
      setLoading(true);
      const url = await uploadImage(imageFile);
      await api.put(`/items/${itemId}`, {
        name,
        brand,
        unit,
        image_url: url,
        default_quantity: defaultQuantity,
        notes,
        is_favorite: isFavorite,
        category_id: categoryId,
      });
      setOpenSnackbar(true);
      router.push("/item");
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

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      await api.delete(`/items/${itemId}`);
      router.push("/item");
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        setError("サーバーエラーが発生しました。");
        setOpenErrorSnackbar(true);
        return;
      }
      setError("ネットワークエラーが発生しました。");
      setOpenErrorSnackbar(true);
    } finally {
      setDeleteLoading(false);
      setOpenSnackbar(true);
    }
  };

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await api.get(`/items/${itemId}`);
        const data = await res.data.data;
        setName(data.name);
        setBrand(data.brand);
        setUnit(data.unit);
        setPreviewUrl(data.image_url);
        setImageUrl(data.image_url);
        setDefaultQuantity(data.default_quantity);
        setNotes(data.notes);
        setIsFavorite(data.is_favorite);

        // カテゴリ取得
        const categoriesRes = (await api.get("/categories")).data.data;
        setCategories(categoriesRes);
      } catch (err) {
        setError("カテゴリ取得エラー:" + err);
        setOpenErrorSnackbar(true);
      }
    };

    fetchItem();
  }, [itemId]);

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
          アイテム更新
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

      {/* 更新ボタン */}
      <Button
        fullWidth
        variant="contained"
        sx={{
          backgroundColor: "#32D26A",
          paddingY: 2,
          marginY: 3,
          borderRadius: "40px",
          fontWeight: 700,
          fontSize: "18px",
          color: "#FFFFFF",
          boxShadow: "0 8px 16px rgba(50,210,106,0.4)",
          "&:hover": {
            backgroundColor: "#29C05F",
          },
        }}
        onClick={handleUpdate}
        disabled={loading}
      >
        {loading ? (
          <CircularProgress size={26} sx={{ color: "white" }} />
        ) : (
          "更新する"
        )}
      </Button>

      {/* 削除ボタン */}
      <DangerButton
        onClick={handleDelete}
        loading={deleteLoading}
        label="削除"
      />
    </Box>
  );
}
