"use client";
import { useEffect, useState } from "react";
import {
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { api } from "@/libs/api/client";
import axios from "axios";
import { Category } from "@/app/types";
import { uploadImage } from "@/libs/query/imageup";
import imageCompression from "browser-image-compression";
import Header from "@/components/Header";
import PrimaryButton from "@/components/PrimaryButton";
import ConfirmDialog from "@/components/ConfirmDialog";
import FieldInput from "@/components/FieldInput";
import SelectFieldInput from "@/components/SelectFieldInput";
import CountBox from "@/components/CountBox";
import ImagePicker from "@/components/ImagePicker";

export default function ItemNewPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [unit, setUnit] = useState("");
  const [, setImageUrl] = useState("");
  const [defaultQuantity, setDefaultQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [categoryId, setCategoryId] = useState(1);
  const [threshold, setThreshold] = useState(1);
  const [location, setLocation] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const validate = () => {
    if (!name || !categoryId || !location) {
      return "アイテム名、カテゴリ、場所は必須です。";
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

  const handleImageChange = async (file: File) => {
    if (!file) return;

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 800,
      useWebWorker: true,
    };

    try {
      const compressed = await imageCompression(file, options);
      const preview = URL.createObjectURL(compressed);
      setPreviewUrl(preview);
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

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#F2FFF5",
        padding: 3,
      }}
    >
      {/* ヘッダー */}
      <Header
        title="アイテム登録"
        onBackAction={() => router.push("/item")}
        onFavoriteAction={() => {
          setIsFavorite(!isFavorite);
        }}
        isFavorite={isFavorite}
      />

      {/* アイテム名 */}
      <FieldInput
        label="アイテム名"
        value={name}
        onChange={setName}
        placeholder="トイレットペーパー"
        required
      />

      {/* カテゴリ */}
      <SelectFieldInput
        label="カテゴリ"
        value={categoryId}
        onChange={setCategoryId}
        placeholder="カテゴリを選択"
        options={categories}
        required
      />

      {/* ブランド名 */}
      <FieldInput
        label="ブランド名"
        value={brand}
        onChange={setBrand}
        placeholder="カインズ"
      />

      {/* 単位 */}
      <FieldInput
        label="単位"
        value={unit}
        onChange={setUnit}
        placeholder="個"
      />

      {/* 場所 */}
      <FieldInput
        label="場所"
        value={location}
        onChange={setLocation}
        placeholder="キッチンの棚"
        required
      />

      {/* 画像 */}
      <ImagePicker
        previewUrl={previewUrl}
        onChange={handleImageChange}
      />

      {/* 初期在庫数 */}
      <CountBox
        label="初期在庫数"
        value={defaultQuantity}
        onChange={(v: number) => setDefaultQuantity(v)}
      />

      {/* 閾値 */}
      <CountBox
        label="閾値"
        value={threshold}
        onChange={(v: number) => setThreshold(v)}
      />

      {/* メモ */}
      <FieldInput
        label="メモ（任意）"
        value={notes}
        onChange={setNotes}
        placeholder="メモを入力"
        large
      />

      {/* 登録ボタン */}
      <PrimaryButton
        onClick={() => setOpen(true)}
        loading={loading}
        label="登録"
      />

      <Snackbar
        open={openSnackbar}
        autoHideDuration={2500}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity="success">
          登録しました
        </Alert>
      </Snackbar>

      <Snackbar
        open={openErrorSnackbar}
        autoHideDuration={2500}
        onClose={() => setOpenErrorSnackbar(false)}
      >
        <Alert severity="error">
          {error}
        </Alert>
      </Snackbar>

      <ConfirmDialog
        open={open}
        title="登録確認"
        message="アイテムを登録します。"
        confirmText="登録する"
        onClose={() => setOpen(false)}
        onConfirm={() => {
          handleCreate();
          setOpen(false);
        }}
      />
    </Box>
  );
}
