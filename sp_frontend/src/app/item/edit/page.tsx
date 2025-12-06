"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Card,
  CardMedia,
  MenuItem,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { useRouter } from "next/navigation";
import EditRoundedIcon from '@mui/icons-material/EditRounded';

export default function ItemEditPage() {
  const router = useRouter();
  //
  // 🔹 モックデータ（後でここを API から取得する）
  //
  const mockItem = {
    id: 1,
    name: "ミネラルウォーター 2L",
    category_id: 2,
    image_url:
      "https://images.unsplash.com/photo-1611095972694-c42f1b2f3f2c?w=800",
    brand: "サンプルブランド",
    unit: "個",
    default_quantity: 1,
    notes: "災害用にストック",
    is_favorite: false,
  };

  const mockCategories = [
    { id: 1, name: "食品" },
    { id: 2, name: "飲料" },
    { id: 3, name: "日用品" },
  ];

  //
  // 🔹 フォーム state
  //
  const [name, setName] = useState(mockItem.name);
  const [categoryId, setCategoryId] = useState(mockItem.category_id);
  const [brand, setBrand] = useState(mockItem.brand);
  const [unit, setUnit] = useState(mockItem.unit);
  const [notes, setNotes] = useState(mockItem.notes);
  const [defaultQuantity, setDefaultQuantity] = useState(
    mockItem.default_quantity
  );
  const [imageUrl, setImageUrl] = useState(mockItem.image_url);

  //
  // 🔹 保存処理（API は後で組む）
  //
  const handleSave = () => {
    const payload = {
      name,
      category_id: categoryId,
      brand,
      unit,
      notes,
      default_quantity: defaultQuantity,
      image_url: imageUrl,
    };

    console.log("送信データ:", payload);
    alert("保存ボタンが押されました（API 未実装）");
  };

  //
  // 🔹 ダミー画像アップロード
  //
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const localUrl = URL.createObjectURL(file); // プレビュー用
    setImageUrl(localUrl);
  };

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
          アイテム詳細
        </Typography>

        {/* 左スペース（戻るボタン） */}
        <IconButton
          onClick={() => router.push("/dashboard")}
          sx={{ color: "#154718" }}
        >
          <EditRoundedIcon />
        </IconButton>
      </Box>

      {/* Image Upload */}
      <Box sx={{ width: "92%", margin: "0 auto" }}>
        <Card
          sx={{
            borderRadius: "24px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <CardMedia
            component="img"
            image={imageUrl}
            sx={{
              height: 220,
              objectFit: "cover",
            }}
          />

          {/* アップロードボタン */}
          <label>
            <IconButton
              component="span"
              sx={{
                position: "absolute",
                bottom: 12,
                right: 12,
                backgroundColor: "rgba(0,0,0,0.6)",
                color: "white",
                "&:hover": { backgroundColor: "rgba(0,0,0,0.8)" },
              }}
            >
              <PhotoCameraIcon />
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </IconButton>
          </label>
        </Card>
      </Box>

      {/* Form */}
      <Box sx={{ width: "92%", margin: "0 auto", marginTop: 3 }}>

        <TextField
          label="アイテム名"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          sx={{ marginBottom: 2 }}
        />

        <TextField
          label="カテゴリ"
          select
          value={categoryId}
          onChange={(e) => setCategoryId(Number(e.target.value))}
          fullWidth
          sx={{ marginBottom: 2 }}
        >
          {mockCategories.map((c) => (
            <MenuItem key={c.id} value={c.id}>
              {c.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="ブランド"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          fullWidth
          sx={{ marginBottom: 2 }}
        />

        <TextField
          label="単位"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          fullWidth
          sx={{ marginBottom: 2 }}
        />

        <TextField
          label="デフォルト個数"
          type="number"
          value={defaultQuantity}
          onChange={(e) => setDefaultQuantity(Number(e.target.value))}
          fullWidth
          sx={{ marginBottom: 2 }}
        />

        <TextField
          label="メモ"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          multiline
          minRows={3}
          fullWidth
          sx={{ marginBottom: 2 }}
        />
      </Box>

      {/* 保存ボタン */}
      <Box
        sx={{
          marginTop: 4,
          width: "92%",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <Button
          variant="contained"
          fullWidth
          sx={{
            backgroundColor: "#2FA866",
            paddingY: 1.6,
            borderRadius: "12px",
            fontSize: "18px",
            fontWeight: 700,
          }}
          onClick={handleSave}
        >
          保存する
        </Button>
      </Box>
    </Box>
  );
}