"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  IconButton,
  Switch,
  CircularProgress,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useRouter } from "next/navigation";
import { api } from "@/libs/api/client";
import axios from "axios";
import { useMemoStore } from "@/stores/memo";

export default function MemoEditPage() {
  const router = useRouter();
  const memo = useMemoStore().selectedItem;
  const [memoId] = useState(memo ? memo.id : 0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("");
  const [isDone, setIsDone] = useState(false);
  const [tags, setTags] = useState("");

  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [error, setError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  const validate = () => {
    if (!title) {
      return "タイトルは必須です。";
    }
    return null;
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
      await api.put(`/memos/${memoId}`, {
        title,
        content,
        type,
        is_done: isDone,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t.length > 0),
      });
      setOpenSnackbar(true);
      router.push("/memo");
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        // その他のサーバーエラー
        setError("サーバーエラーが発生しました。");
        setOpenErrorSnackbar(true);
        return;
      }
      // axios 以外のエラー（ネットワーク、予期せぬエラーなど）
      setError("ネットワークエラーが発生しました。");
      console.log(err);
      setOpenErrorSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      await api.delete(`/memos/${memoId}`);
      setOpenSnackbar(true);
      router.push("/memo");
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
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    const fetchMemo = async () => {
      try {
        const res = await api.get(`/memos/${memoId}`);
        const data = await res.data.data;
        setTitle(data.title);
        setContent(data.content);
        setType(data.type);
        setIsDone(data.is_done);
        setTags(data.tags.join(", "));
      } catch (err) {
        setError("カテゴリ取得エラー:" + err);
        setOpenErrorSnackbar(true);
      }
    };

    fetchMemo();
  }, [memoId]);

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
        <IconButton onClick={() => router.back()} sx={{ color: "#154718" }}>
          <ArrowBackIosNewIcon />
        </IconButton>

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
          メモ登録
        </Typography>

        {/* 右側ダミー（位置合わせ用） */}
        <Box sx={{ width: 40 }} />
      </Box>

      {/* 成功 */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2500}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          登録しました
        </Alert>
      </Snackbar>

      {/* エラー */}
      <Snackbar
        open={openErrorSnackbar}
        autoHideDuration={2500}
        onClose={() => setOpenErrorSnackbar(false)}
      >
        <Alert severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>

      {/* タイトル */}
      <Typography sx={{ fontWeight: 600, marginBottom: 1 }}>
        タイトル *
      </Typography>
      <TextField
        fullWidth
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="例：買い物メモ"
        InputProps={{
          sx: {
            backgroundColor: "white",
            borderRadius: "20px",
            paddingY: 0.5,
          },
        }}
        sx={{ marginBottom: 3 }}
      />

      {/* 内容 */}
      <Typography sx={{ fontWeight: 600, marginBottom: 1 }}>内容</Typography>
      <TextField
        fullWidth
        multiline
        minRows={3}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="内容を入力"
        InputProps={{
          sx: {
            backgroundColor: "white",
            borderRadius: "20px",
            paddingY: 1,
          },
        }}
        sx={{ marginBottom: 3 }}
      />

      {/* タイプ */}
      <Typography sx={{ fontWeight: 600, marginBottom: 1 }}>タイプ</Typography>
      <TextField
        fullWidth
        value={type}
        onChange={(e) => setType(e.target.value)}
        placeholder="例：消耗品"
        InputProps={{
          sx: {
            backgroundColor: "white",
            borderRadius: "20px",
            paddingY: 0.5,
          },
        }}
        sx={{ marginBottom: 3 }}
      />

      {/* 完了フラグ */}
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
        <Typography sx={{ fontWeight: 600 }}>完了フラグ</Typography>

        <Switch
          checked={isDone}
          onChange={(e) => setIsDone(e.target.checked)}
          sx={{
            "& .MuiSwitch-switchBase.Mui-checked": {
              color: "#32D26A",
            },
            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
              backgroundColor: "#32D26A",
            },
          }}
        />
      </Box>

      {/* タグ */}
      <Typography sx={{ fontWeight: 600, marginBottom: 1 }}>
        タグ（カンマ区切り）
      </Typography>
      <TextField
        fullWidth
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="例：日用品, セール"
        InputProps={{
          sx: {
            backgroundColor: "white",
            borderRadius: "20px",
            paddingY: 0.5,
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
      <Button
        fullWidth
        variant="contained"
        sx={{
          backgroundColor: "#FF6B6B",
          paddingY: 2,
          borderRadius: "40px",
          fontWeight: 700,
          fontSize: "18px",
          color: "#ffffff",
          boxShadow: "0 8px 16px rgba(255, 107, 107, 0.4)",
          transition: "0.2s",
          "&:hover": {
            backgroundColor: "#FF5A5A",
            boxShadow: "0 6px 12px rgba(255, 107, 107, 0.6)",
          },
          "&:active": {
            backgroundColor: "#E14B4B",
          },
        }}
        onClick={handleDelete}
      >
        {deleteLoading ? (
          <CircularProgress size={26} sx={{ color: "white" }} />
        ) : (
          "削除する"
        )}
      </Button>
    </Box>
  );
}
