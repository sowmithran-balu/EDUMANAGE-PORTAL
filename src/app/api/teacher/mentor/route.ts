import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "teacher") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { menteeId, category, notes } = await req.json();
    if (!menteeId || !category || !notes) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const meeting = await db.mentorMeeting.create({
      data: {
        mentorId: user.id,
        menteeId,
        category,
        notes,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Mentorship advisory notes logged successfully.",
      meeting,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Mentoring log failed" }, { status: 500 });
  }
}
