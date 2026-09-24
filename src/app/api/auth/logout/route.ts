import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/auth";

export async function POST() {
  try {
    const response = NextResponse.json({ success: true, message: "Logged out successfully" });
    await clearAuthCookie();
    return response;
  } catch (error: any) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("edu_portal_token");
    return response;
  } catch (error: any) {
    console.error("Logout GET error:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}
