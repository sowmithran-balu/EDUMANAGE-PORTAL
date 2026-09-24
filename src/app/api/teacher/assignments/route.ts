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
    const { classId, title, description, maxScore, dueDate } = body;

    if (!classId || !title || !description || !maxScore || !dueDate) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    const assignment = await db.assignment.create({
      data: {
        classId,
        title,
        description,
        maxScore: parseFloat(maxScore),
        dueDate: new Date(dueDate),
      },
    });

    return NextResponse.json({ success: true, assignment });
  } catch (error: any) {
    console.error("Create Assignment API error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
