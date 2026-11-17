import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { ROUTES } from "@/routes";

const protectedPaths = ["/exams", "/questions", "/profile", "/change-password", "/admin"];
const authPaths = ["/login", "/register", "/forget-password", "/forgot-password", "/reset-password"];

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isHome = pathname === "/";
  const isProtected = isHome || protectedPaths.some((path) => pathname.startsWith(path));
  const isAuthPage = authPaths.some((path) => pathname.startsWith(path));

  // If trying to access protected route (including home diplomas) without token, redirect to login
  if (isProtected && !token) {
    const loginUrl = new URL(ROUTES.AUTH.LOGIN, request.url);
    const callback = `${pathname}${search}`;
    loginUrl.searchParams.set("callbackUrl", callback);
    return NextResponse.redirect(loginUrl);
  }

  // If logged in and trying to access auth pages, redirect to home
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL(ROUTES.HOME, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/exams/:path*",
    "/questions/:path*",
    "/profile/:path*",
    "/change-password/:path*",
    "/admin/:path*",
    "/login",
    "/register",
    "/forget-password",
    "/forgot-password",
    "/reset-password",
  ],
};
