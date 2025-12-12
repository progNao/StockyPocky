"use client";
import { useState } from "react";
import { api } from "@/libs/api/client";
import { useRouter } from "next/navigation";
import { Box, Alert, Snackbar } from "@mui/material";
import axios from "axios";
import Header from "@/components/Header";
import FieldInput from "@/components/FieldInput";
import PrimaryButton from "@/components/PrimaryButton";

export default function CategoryNewPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleCreate = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      setOpenErrorSnackbar(true);
      return;
    }
    try {
      setLoading(true);
      await api.post("/categories", {
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

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#F2FFF5",
        padding: 3,
      }}
    >
      {/* ヘッダー */}
      <Header title="カテゴリ登録" onBackAction={() => router.push("/category")} />

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

      {/* 登録ボタン */}
      <PrimaryButton onClick={handleCreate} loading={loading} label="登録" />

      <Snackbar
        open={openSnackbar}
        autoHideDuration={2500}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity="success">登録しました</Alert>
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
