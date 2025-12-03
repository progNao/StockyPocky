"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth";
import { Typography, Box } from "@mui/material";

export default function DashboardPage() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    const stored = localStorage.getItem("access_token");

    // 初回ロード時に Zustand に同期
    if (!token && stored) {
      useAuthStore.setState({ token: stored });
    }

    // トークンが無ければログインへ
    if (!stored) {
      router.replace("/login");
    }
  }, [token, router]);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4">Dashboard</Typography>
    </Box>
  );
}