"use client";

import { useState } from "react";
import { Box, Snackbar, Alert } from "@mui/material";
import { useRouter } from "next/navigation";
import { api } from "@/libs/api/client";
import axios from "axios";
import Header from "@/components/Header";
import FieldInput from "@/components/FieldInput";
import ToggleSwitch from "@/components/ToggleSwitch";
import PrimaryButton from "@/components/PrimaryButton";

export default function MemoNewPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("");
  const [isDone, setIsDone] = useState(false);
  const [tags, setTags] = useState("");
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!title) {
      return "タイトルは必須です。";
    }
    return null;
  };

  const clear = () => {
    setTitle("");
    setContent("");
    setType("");
    setIsDone(false);
    setTags("");
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
      await api.post("/memos", {
        title,
        content,
        type,
        is_done: isDone,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t.length > 0),
      });
      clear();
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
      <Header title="メモ登録" onBackAction={() => router.push("/memo")} />

      {/* タイトル */}
      <FieldInput
        label="メモタイトル"
        value={title}
        onChange={setTitle}
        placeholder="買い物メモ"
        required
      />

      {/* 内容 */}
      <FieldInput
        label="内容"
        value={content}
        onChange={setContent}
        placeholder="内容を入力"
        large
      />

      {/* タイプ */}
      <FieldInput
        label="タイプ"
        value={type}
        onChange={setType}
        placeholder="消耗品"
      />

      {/* 完了フラグ */}
      <ToggleSwitch label="完了フラグ" checked={isDone} onChange={setIsDone} />

      {/* タグ */}
      <FieldInput
        label="タグ（カンマ区切り）"
        value={tags}
        onChange={setTags}
        placeholder="日用品, セール"
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
