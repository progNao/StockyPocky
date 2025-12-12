"use client";
import { api } from "@/libs/api/client";
import { useCategoryStore } from "@/stores/category";
import { Alert, Box, Snackbar } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import FieldInput from "@/components/FieldInput";
import PrimaryButton from "@/components/PrimaryButton";
import DangerButton from "@/components/DangerButton";

export default function CategoryEditPage() {
  const router = useRouter();
  const categoryId = useCategoryStore((s) => s.selectedCategoryId);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const validate = () => {
    if (!name) {
      return "カテゴリ名は必須です。";
    }
    return null;
  };

  const clear = () => {
    setName("");
    setIcon("");
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
      await api.put(`/categories/${categoryId}`, {
        name,
        icon,
      });
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
      setOpenSnackbar(true);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      await api.delete(`/categories/${categoryId}`);
      clear();
      router.push("/category");
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        const status = err.response.status;
        if (status === 400) {
          setError("アイテムに紐づいているため、削除できません。");
          setOpenErrorSnackbar(true);
          return;
        }
        // その他のサーバーエラー
        setError("サーバーエラーが発生しました。");
        setOpenErrorSnackbar(true);
        return;
      }
      // axios 以外のエラー（ネットワーク、予期せぬエラーなど）
      setError("ネットワークエラーが発生しました。");
      setOpenErrorSnackbar(true);
    } finally {
      setDeleteLoading(false);
      setOpenSnackbar(true);
    }
  };

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await api.get(`/categories/${categoryId}`);
        const data = await res.data.data;
        setName(data.name);
        setIcon(data.icon);
      } catch (err) {
        setError("カテゴリ取得エラー:" + err);
        setOpenErrorSnackbar(true);
      }
    };

    fetchCategory();
  }, [categoryId]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#F2FFF5",
        padding: 3,
      }}
    >
      {/* ヘッダー */}
      <Header title="カテゴリ更新" onBackAction={() => router.push("/category")} />

      {/* カテゴリ名 */}
      <FieldInput
        label="カテゴリ名"
        value={name}
        onChange={setName}
        placeholder="日用品"
        required
      />

      {/* アイコン */}
      <FieldInput
        label="アイコン"
        value={icon}
        onChange={setIcon}
        placeholder="🧻"
      />

      {/* 更新ボタン */}
      <PrimaryButton onClick={handleUpdate} loading={loading} label="更新" />

      {/* 削除ボタン */}
      <DangerButton
        onClick={handleDelete}
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
    </Box>
  );
}
