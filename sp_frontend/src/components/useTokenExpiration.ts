import { useEffect } from "react";
import { useRouter } from "next/navigation";

const EXPIRE_TIME = 2.5 * 60 * 60 * 1000; // 2時間30分（ミリ秒）

export function useTokenExpiration() {
  const router = useRouter();
  useEffect(() => {
    const check = () => {
      const issued = localStorage.getItem("token_issued_at");
      const token = localStorage.getItem("token");

      if (!issued || !token) return;

      const issuedTime = Number(issued);
      const now = Date.now();

      if (now - issuedTime > EXPIRE_TIME) {
        console.log("🔐 Token expired → Removing...");
        localStorage.removeItem("token");
        localStorage.removeItem("token_issued_at");
        router.push("/login?expired=1");
      }
    };

    // ページ読み込み時にチェック
    check();

    // 1分ごとにチェック（軽い）
    const interval = setInterval(check, 60 * 1000);

    return () => clearInterval(interval);
  }, [router]);
}