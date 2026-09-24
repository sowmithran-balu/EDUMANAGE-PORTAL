import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "edu_portal_token";
const JWT_SECRET = process.env.JWT_SECRET || "default-fallback-super-secret-key-for-development-only";

// Helper to convert secret to Uint8Array for jose
const secretKey = new TextEncoder().encode(JWT_SECRET);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;

  // 1. Verify token if present
  let payload: any = null;
  if (token) {
    try {
      const { payload: verified } = await jwtVerify(token, secretKey);
      payload = verified;
    } catch (err) {
      // Invalid token, delete cookie and redirect to login if accessing dashboard
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete(COOKIE_NAME);
      return response;
    }
  }

  // 2. Auth protection for Dashboard zones
  const isStudentRoute = pathname.startsWith("/student");
  const isTeacherRoute = pathname.startsWith("/teacher");
  const isAdminRoute = pathname.startsWith("/admin");
  const isDashboardRoute = isStudentRoute || isTeacherRoute || isAdminRoute;

  if (isDashboardRoute) {
    if (!payload) {
      // Not logged in, redirect to login
      const redirectUrl = new URL("/login", request.url);
      redirectUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // Role verification
    const role = payload.role;
    if (isStudentRoute && role !== "student") {
      return NextResponse.redirect(new URL(getDashboardRoute(role), request.url));
    }
    if (isTeacherRoute && role !== "teacher") {
      return NextResponse.redirect(new URL(getDashboardRoute(role), request.url));
    }
    if (isAdminRoute && role !== "admin") {
      return NextResponse.redirect(new URL(getDashboardRoute(role), request.url));
    }
  }

  // 3. Redirect logged-in users away from auth pages
  const isAuthPage = pathname === "/login" || pathname === "/register";
  if (isAuthPage && payload) {
    return NextResponse.redirect(new URL(getDashboardRoute(payload.role), request.url));
  }

  return NextResponse.next();
}

function getDashboardRoute(role: string): string {
  switch (role) {
    case "student":
      return "/student";
    case "teacher":
      return "/teacher";
    case "admin":
      return "/admin";
    default:
      return "/login";
  }
}

export const config = {
  matcher: [
    "/student/:path*",
    "/teacher/:path*",
    "/admin/:path*",
    "/login",
    "/register",
  ],
};
