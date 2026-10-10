import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { SettingsService } from "@/lib/services/settings.service";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { category } = await params;

  try {
    const data = await SettingsService.getSettings(user.id, category, user.role);
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to load settings" }, { status: 403 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { category } = await params;
  const body = await req.json();

  try {
    const saved = await SettingsService.saveSettings(user.id, category, user.role, body);
    
    // Create response and set cookie for appearance theme if applicable
    const response = NextResponse.json({ success: true, message: "Settings saved successfully", data: saved });
    
    if (category === "appearance") {
      response.cookies.set("edu_theme_mode", saved.mode, { path: "/", maxAge: 60 * 60 * 24 * 365 });
      response.cookies.set("edu_theme_color", saved.primaryColor, { path: "/", maxAge: 60 * 60 * 24 * 365 });
    }

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to save settings" }, { status: 400 });
  }
}
