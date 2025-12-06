"use client";

import { useState } from "react";
import { api } from "@/libs/api/client";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "next/navigation";
import {
  Button,
  TextField,
  Box,
  Typography,
  Container,
  Alert,
} from "@mui/material";
import Image from "next/image";
import axios from "axios";
import { useUserStore } from "@/stores/user";

export default function LoginPage() {
  const router = useRouter();
  const { setToken } = useAuthStore();
  const { setUsername } = useUserStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const validate = () => {
    if (!email || !password) {
      return "メールアドレス、パスワードは必須です。";
    }
    // メールアドレス形式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "メールアドレスの形式が正しくありません。";
    }
    if (password.length < 8) {
      return "パスワードは8文字以上で入力してください。";
    }
    return null;
  };

  const handleLogin = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });
      const token = res.data.data.token;
      const username = res.data.data.name;
      localStorage.setItem("access_token", token);
      localStorage.setItem("token_issued_at", Date.now().toString());
      setToken(token);
      setUsername(username);
      document.cookie = `access_token=${token}; path=/;`;
      router.push("/dashboard");
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        const status = err.response.status;
        if (status === 404) {
          setError("ユーザーが見つかりません。");
          return;
        }
        if (status === 401) {
          setError("パスワードが違います。");
          return;
        }
        // その他のサーバーエラー
        setError("ログインに失敗しました。時間をおいて再度お試しください。");
        return;
      }
      // axios 以外のエラー（ネットワーク、予期せぬエラーなど）
      setError("ネットワークエラーが発生しました。");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `
          radial-gradient(circle at top left, #d8fbe3 0%, #e9fff3 40%, #ffffff 80%),
          radial-gradient(circle at bottom right, #d2f5dd 0%, #e9fff3 40%, #ffffff 80%)
        `,
        paddingX: 3,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 2,
      }}
    >

      <Container maxWidth="xs" sx={{ textAlign: "center" }}>
        {/* ロゴ（左上に傾けたカード風） */}
        <Box
          sx={{
            width: 120,
            height: 120,
            margin: "0 auto 12px",
            transform: "rotate(-10deg)",
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
          }}
        >
          <Image
            src="/logo.png"
            width={120}
            height={120}
            alt="logo"
            style={{ objectFit: "cover" }}
          />
        </Box>

        {/* タイトル */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: "#154718",
            marginBottom: 4,
            fontFamily: "Nunito, sans-serif",
          }}
        >
          StockyPocky
        </Typography>

        {/* 可愛いエラー表示 */}
        {error && (
          <Alert
            severity="error"
            sx={{
              borderRadius: "20px",
              backgroundColor: "#ffe6e9",
              color: "#b3273a",
              fontWeight: 600,
              marginBottom: 3,
            }}
          >
            {error}
          </Alert>
        )}

        {/* メールアドレス */}
        <Typography
          sx={{ textAlign: "left", marginBottom: 1, fontWeight: 600 }}
        >
          メールアドレス
        </Typography>
        <TextField
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="username@example.com"
          variant="outlined"
          InputProps={{
            sx: {
              backgroundColor: "white",
              borderRadius: "30px",
              paddingY: 0.5,
            },
          }}
          sx={{ marginBottom: 3 }}
        />

        {/* パスワード */}
        <Typography
          sx={{ textAlign: "left", marginBottom: 1, fontWeight: 600 }}
        >
          パスワード
        </Typography>
        <TextField
          fullWidth
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          variant="outlined"
          InputProps={{
            sx: {
              backgroundColor: "white",
              borderRadius: "30px",
              paddingY: 0.5,
            },
          }}
          sx={{ marginBottom: 4 }}
        />

        {/* ログインボタン */}
        <Button
          fullWidth
          variant="contained"
          onClick={handleLogin}
          sx={{
            backgroundColor: "#32D26A",
            paddingY: 1.8,
            borderRadius: "40px",
            fontWeight: 700,
            fontSize: "18px",
            color: "#083614",
            marginBottom: 3,
            boxShadow: "0 8px 16px rgba(50,210,106,0.4)",
            "&:hover": {
              backgroundColor: "#2CC15F",
            },
          }}
        >
          ログイン
        </Button>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => router.back()}
          sx={{
            paddingY: 1.8,
            borderRadius: "40px",
            fontWeight: 700,
            fontSize: "18px",
            color: "#32D26A",
            borderColor: "#32D26A",
            "&:hover": {
              backgroundColor: "rgba(50,210,106,0.1)",
              borderColor: "#2CC15F",
            },
          }}
        >
          メイン画面に戻る
        </Button>
      </Container>
    </Box>
  );
}
