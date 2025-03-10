import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicPath = path === "/login" || path === "/signup" || path === "/verifyEmail";
  const token = request.cookies.get("token")?.value || "";

  // Redirect authenticated users from public paths to home
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  // Redirect unauthenticated users from protected paths to login
  if (!isPublicPath && !token && path !== "/") {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }
}

export const config = {
  matcher: ["/profile", "/products", "/login", "/signup", "/verifyEmail"],
};
