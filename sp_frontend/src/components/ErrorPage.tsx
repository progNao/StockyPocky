"use client";

import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

const ErrorPage = () => {
  const router = useRouter();

  return (
    <Box
      sx={{
        height: "100vh",
        backgroundColor: "#E9F8EF",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        px: 3,
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          color: "#1A5C3F",
          mb: 4,
        }}
      >
        エラーが発生しました
      </Typography>

      <Button
        variant="contained"
        onClick={() => router.push("/")}
        sx={{
          backgroundColor: "#25A56A",
          color: "white",
          borderRadius: "24px",
          fontSize: "16px",
          px: 4,
          py: 1.5,
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          "&:hover": {
            backgroundColor: "#1E8C59",
          },
        }}
      >
        ホームへ戻る
      </Button>
    </Box>
  );
};

export default ErrorPage;
