"use client";

import {
  Box,
  Button,
  Typography,
  Container,
  Alert,
  Snackbar,
} from "@mui/material";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function MainPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get("logout") === "1") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpen(true);
      router.replace("/");
    }
  }, [searchParams, router]);
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `
          radial-gradient(circle at top left, #d8fbe3 0%, #e9fff3 40%, #ffffff 80%),
          radial-gradient(circle at bottom right, #d2f5dd 0%, #e9fff3 40%, #ffffff 80%)
        `,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
      }}
    >
      <Container maxWidth="xs" sx={{ textAlign: "center" }}>
        {/* ロゴ画像 */}
        <Box
          sx={{
            width: 200,
            height: 200,
            margin: "0 auto 24px",
            transform: "rotate(-10deg)",
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
          }}
        >
          <Image
            src="/logo.png" // ← public フォルダに logo.png を配置
            width={200}
            height={200}
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
            marginBottom: 2,
            fontFamily: "Nunito, sans-serif",
          }}
        >
          StockyPocky
        </Typography>

        {/* サブテキスト */}
        <Typography
          sx={{
            color: "#1a3d23",
            fontSize: "15px",
            marginBottom: 5,
            lineHeight: 1.7,
            opacity: 0.8,
          }}
        >
          おうちの在庫をかわいく管理。
          <br />
          「あれ、どこだっけ？」をなくそう。
        </Typography>

        {/* ボタン：ログイン */}
        <Button
          fullWidth
          variant="contained"
          href="/login"
          sx={{
            backgroundColor: "#32D26A",
            color: "#0A2A12",
            paddingY: 1.6,
            borderRadius: "40px",
            fontWeight: 700,
            fontSize: "18px",
            boxShadow: "0 6px 16px rgba(50,210,106,0.4)",
            marginBottom: 2,
            "&:hover": {
              backgroundColor: "#2CC15F",
            },
          }}
        >
          ログイン
        </Button>

        {/* ボタン：サインアップ */}
        <Button
          fullWidth
          variant="outlined"
          href="/signup"
          sx={{
            paddingY: 1.6,
            borderRadius: "40px",
            fontWeight: 700,
            fontSize: "18px",
            borderColor: "#32D26A",
            color: "#0A2A12",
            backgroundColor: "#fff",
            boxShadow: "0 6px 16px rgba(0,0,0,0.05)",
            "&:hover": {
              backgroundColor: "#F8FFF9",
              borderColor: "#32D26A",
            },
          }}
        >
          サインアップ
        </Button>
      </Container>

      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled">
          ログアウトしました
        </Alert>
      </Snackbar>
    </Box>
  );
}
