import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "teacher") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await request.json();
    const { classId, title, maxMarks, date } = body;

    if (!classId || !title || !maxMarks || !date) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    const exam = await db.exam.create({
      data: {
        classId,
        title,
        maxMarks: parseFloat(maxMarks),
        date: new Date(date),
      },
    });

    return NextResponse.json({ success: true, exam });
  } catch (error: any) {
    console.error("Create Exam API error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
