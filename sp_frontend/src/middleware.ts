import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token =
    req.cookies.get("access_token")?.value ||
    req.headers.get("Authorization")?.replace("Bearer ", "");

  // 保護したいページのパス
  const protectedRoutes = ["/dashboard", "/category"];

  const pathname = req.nextUrl.pathname;

  const requiresAuth = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (requiresAuth && !token) {
    // ログインしていない → /login へ
    const loginUrl = new URL("/", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// `/dashboard` を対象
export const config = {
  matcher: ["/dashboard/:path*"],
};
