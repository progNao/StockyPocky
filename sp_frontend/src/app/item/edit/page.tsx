"use client";

import { useEffect, useState } from "react";
import { Box, Snackbar, Alert } from "@mui/material";
import { useRouter } from "next/navigation";
import { api } from "@/libs/api/client";
import axios from "axios";
import { Category } from "@/app/types";
import { uploadImage } from "@/libs/query/imageup";
import imageCompression from "browser-image-compression";
import { useItemStore } from "@/stores/item";
import DangerButton from "@/components/DangerButton";
import { ref, deleteObject } from "firebase/storage";
import { storage } from "@/libs/firebase";
import Header from "@/components/Header";
import FieldInput from "@/components/FieldInput";
import SelectFieldInput from "@/components/SelectFieldInput";
import ImagePicker from "@/components/ImagePicker";
import PrimaryButton from "@/components/PrimaryButton";
import ConfirmDialog from "@/components/ConfirmDialog";

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
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let changeFlg = false;

  const deleteImageByUrl = async (imageUrl: string) => {
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
  };

  const validate = () => {
    if (!name || !categoryId) {
      return "アイテム名、カテゴリは必須です。";
    }
    return null;
  };

  const handleImageChange = async (file: File) => {
    changeFlg = true;
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
      const preview = URL.createObjectURL(compressed);
      setPreviewUrl(preview);
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
      await deleteImageByUrl(item ? item.imageUrl : "");
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        setError("サーバーエラーが発生しました。");
        setOpenErrorSnackbar(true);
        return;
      }
      setError("ネットワークエラーが発生しました。");
      setOpenErrorSnackbar(true);
    } finally {
      setLoading(false);
      setOpenSnackbar(true);
      router.push("/item");
    }
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      await api.delete(`/items/${itemId}`);
      if (item && item.imageUrl) {
        await deleteImageByUrl(item.imageUrl);
      }
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
      <Header
        title="アイテム更新"
        onBackAction={() => router.back()}
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
        onChange={(e) => setCategoryId(Number(e))}
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

      {/* 画像 */}
      <ImagePicker previewUrl={previewUrl} onChange={handleImageChange} />

      {/* メモ */}
      <FieldInput
        label="メモ（任意）"
        value={notes}
        onChange={setNotes}
        placeholder="メモを入力"
        large
      />

      {/* 更新ボタン */}
      <PrimaryButton
        onClick={() => setOpen(true)}
        loading={loading}
        label="更新"
      />

      {/* 削除ボタン */}
      <DangerButton
        onClick={() => setOpenDelete(true)}
        loading={deleteLoading}
        label="削除"
      />

      <Snackbar
        open={openSnackbar}
        autoHideDuration={2500}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity="success">更新しました</Alert>
      </Snackbar>

      <Snackbar
        open={openErrorSnackbar}
        autoHideDuration={2500}
        onClose={() => setOpenErrorSnackbar(false)}
      >
        <Alert severity="error">{error}</Alert>
      </Snackbar>

      <ConfirmDialog
        open={open}
        title="更新確認"
        message="アイテムを更新します。"
        confirmText="更新する"
        onClose={() => setOpen(false)}
        onConfirm={() => {
          handleUpdate();
          setOpen(false);
        }}
      />
      <ConfirmDialog
        open={openDelete}
        title="削除確認"
        message="アイテムを削除します。"
        confirmText="削除する"
        variant="danger"
        onClose={() => setOpenDelete(false)}
        onConfirm={() => {
          handleDelete();
          setOpenDelete(false);
        }}
      />
    </Box>
  );
}
