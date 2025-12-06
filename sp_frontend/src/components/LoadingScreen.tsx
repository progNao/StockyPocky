"use client";

import { Box, CircularProgress, Typography } from "@mui/material";

export default function LoadingScreen() {
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F2FFF5",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 2000, // 画面全体を覆う
      }}
    >
      <CircularProgress size={64} thickness={4} sx={{ color: "#32D26A" }} />
      <Typography
        sx={{
          marginTop: 2,
          fontSize: 18,
          fontWeight: 600,
          color: "#32D26A",
        }}
      >
        読み込み中...
      </Typography>
    </Box>
  );
}
