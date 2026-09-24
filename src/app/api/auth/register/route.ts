import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword, generateToken, setAuthCookie } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name, role } = body;

    // 1. Basic validation
    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { error: "Missing required fields (email, password, name, role)" },
        { status: 400 }
      );
    }

    if (!["student", "teacher", "admin"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role. Must be 'student', 'teacher', or 'admin'" },
        { status: 400 }
      );
    }

    // 2. Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // 3. Create the user
    const passwordHash = hashPassword(password);
    const user = await db.user.create({
      data: {
        email: email.toLowerCase(),
        name,
        role,
        passwordHash,
        profile: JSON.stringify({ bio: `Welcome, ${name}!`, avatar: "" }),
      },
    });

    // 4. Generate JWT & set cookie
    const token = generateToken({
      userId: user.id,
      role: user.role,
      email: user.email,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    // Since setAuthCookie uses cookies() from next/headers, it operates on headers directly.
    // In App Router route handlers, we can just call it, it will modify response cookies.
    await setAuthCookie(token);

    return response;
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
