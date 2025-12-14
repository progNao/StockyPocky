// lib/logout.ts
import { useAuthStore } from "@/stores/auth";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "./firebase";
import { useUserStore } from "@/stores/user";

export async function logout(router: ReturnType<typeof useRouter>) {
  try {
    // ① Firebase からログアウト
    await signOut(auth);
  } finally {
    // ② フロントの状態を完全リセット
    localStorage.removeItem("access_token");

    useAuthStore.getState().setToken(null);
    useUserStore.getState().setUsername("");

    // ③ ログイン画面へ
    router.replace("/?logout=1");
  }
}