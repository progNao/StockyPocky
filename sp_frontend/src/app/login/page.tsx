"use client";

import { useState } from "react";
import { api } from "@/libs/api/client";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "next/navigation";
import { Button, TextField, Box, Typography, Container, IconButton } from "@mui/material";
import Image from "next/image";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

export default function LoginPage() {
  const router = useRouter();
  const { setToken } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      const token = res.data.access_token;

      localStorage.setItem("access_token", token);
      setToken(token);

      router.push("/dashboard");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("メールまたはパスワードが違います");
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
      {/* 戻るボタン */}
      <IconButton
        onClick={() => router.push("/")}
        sx={{
          color: "#154718",
          marginBottom: 1,
          position: "absolute",
          left: 16,
          top: 16,
        }}
      >
        <ArrowBackIosNewIcon />
        <Typography sx={{ fontWeight: 600, marginLeft: 0.5 }}>
          戻る
        </Typography>
      </IconButton>

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

        {error && (
          <Typography color="error" textAlign="center">
            {error}
          </Typography>
        )}

        {/* ユーザー名 */}
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

        {/* パスワードリセット */}
        <Typography
          sx={{
            color: "#1a3d23",
            opacity: 0.8,
            fontSize: "15px",
          }}
        >
          パスワードを忘れた場合
        </Typography>
      </Container>
    </Box>
  );
}
