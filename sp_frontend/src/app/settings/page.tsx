"use client";

import { api } from "@/libs/api/client";
import { useAuthStore } from "@/stores/auth";
import { useUserStore } from "@/stores/user";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";

export default function Settings() {
  const router = useRouter();
  const { logout } = useAuthStore();
  const { clearUser } = useUserStore();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout"); // 正常レスポンスのみ想定
      clearUser();
      localStorage.removeItem("access_token");
      logout(); // ← 画面側でトークン破棄
      document.cookie = "access_token=; Max-Age=0; path=/;";
      router.push("/");
    } catch {
      // エラーがあってもフロント側で破棄してログイン画面へ
      logout();
      router.push("/");
    }
  };

  return (
    <div>
      <Button onClick={handleLogout}>ログアウト</Button>
    </div>
  );
}
