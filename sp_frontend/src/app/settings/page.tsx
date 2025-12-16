"use client";

import { useEffect, useState } from "react";
import { Box, Snackbar, Alert, Switch } from "@mui/material";
import { useRouter } from "next/navigation";
import axios from "axios";

import { api } from "@/libs/api/client";
import Header from "@/components/Header";
import FieldInput from "@/components/FieldInput";
import PrimaryButton from "@/components/PrimaryButton";
import DangerButton from "@/components/DangerButton";
import ConfirmDialog from "@/components/ConfirmDialog";
import { logout } from "@/libs/logout";

export default function AccountPage() {
  const router = useRouter();

  const [name, setName] = useState("");

  // 通知設定（仮）
  const [stockAlert, setStockAlert] = useState(false);
  const [weeklyReport, setWeeklyReport] = useState(false);

  const [loading, setLoading] = useState(false);
  const [openSave, setOpenSave] = useState(false);
  const [openLogout, setOpenLogout] = useState(false);

  const [error, setError] = useState("");
  const [openError, setOpenError] = useState(false);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = (await api.get("/users/me")).data.data;
        setName(res.name);
      } catch (err) {
        setError("ユーザー情報の取得に失敗しました" + err);
        setOpenError(true);
      }
    };

    fetchMe();
  }, []);

  const handleSave = async () => {
    try {
      setLoading(true);
      await api.put("/users/me", {
        name,
      });
      setOpenSave(true);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError("保存に失敗しました");
      } else {
        setError("ネットワークエラーが発生しました");
      }
      setOpenError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout(router);
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
      <Header
        title="アカウント設定"
        onBackAction={() => router.push("/dashboard")}
      />

      {/* 表示名 */}
      <FieldInput
        label="表示名"
        value={name}
        onChange={setName}
        placeholder="山田 太郎"
        required
      />

      {/* 通知設定 */}
      <Box
        sx={{
          backgroundColor: "#FFFFFF",
          borderRadius: 3,
          padding: 2.5,
          mb: 4,
          boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
        }}
      >
        {/* 在庫不足通知 */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Box>
            <Box sx={{ fontWeight: 600, fontSize: 15 }}>在庫不足通知</Box>
            <Box sx={{ fontSize: 12, color: "#4CAF6A" }}>
              指定数以下になったら通知
            </Box>
          </Box>
          <Switch
            checked={stockAlert}
            onChange={(e) => setStockAlert(e.target.checked)}
            color="success"
          />
        </Box>

        {/* 区切り線 */}
        <Box
          sx={{
            height: 1,
            backgroundColor: "#E6F5EC",
            mb: 2,
          }}
        />

        {/* 週次レポート */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Box sx={{ fontWeight: 600, fontSize: 15 }}>週次レポート</Box>
            <Box sx={{ fontSize: 12, color: "#4CAF6A" }}>
              在庫の使用状況を毎週お知らせ
            </Box>
          </Box>
          <Switch
            checked={weeklyReport}
            onChange={(e) => setWeeklyReport(e.target.checked)}
            color="success"
          />
        </Box>
      </Box>

      {/* 保存 */}
      <PrimaryButton
        label="変更を保存"
        onClick={handleSave}
        loading={loading}
      />

      {/* ログアウト */}
      <DangerButton label="ログアウト" onClick={() => setOpenLogout(true)} />

      {/* Snackbar */}
      <Snackbar
        open={openSave}
        autoHideDuration={2500}
        onClose={() => setOpenSave(false)}
      >
        <Alert severity="success">保存しました</Alert>
      </Snackbar>

      <Snackbar
        open={openError}
        autoHideDuration={2500}
        onClose={() => setOpenError(false)}
      >
        <Alert severity="error">{error}</Alert>
      </Snackbar>

      {/* ログアウト確認 */}
      <ConfirmDialog
        open={openLogout}
        title="ログアウト確認"
        message="ログアウトしますか？"
        confirmText="ログアウト"
        variant="danger"
        onClose={() => setOpenLogout(false)}
        onConfirm={handleLogout}
      />
    </Box>
  );
}
