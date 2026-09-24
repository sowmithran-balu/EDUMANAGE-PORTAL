import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { dispatchEvent } from "@/lib/ai/eventDispatcher";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "teacher") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await request.json();
    const { classId, date, records } = body; // records: { studentId, status }[]

    if (!classId || !date || !records || !Array.isArray(records)) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    console.log(`[API] Teacher logged attendance for class ${classId} on date ${date}`);

    // Commit all attendance records within a transaction
    await db.$transaction(
      records.map((rec) =>
        db.attendance.upsert({
          where: {
            classId_studentId_date: {
              classId,
              studentId: rec.studentId,
              date,
            },
          },
          update: {
            status: rec.status,
          },
          create: {
            classId,
            studentId: rec.studentId,
            date,
            status: rec.status,
          },
        })
      )
    );

    // Trigger async AI engine recompute for each student in the class
    records.forEach((rec) => {
      dispatchEvent("ACADEMIC_WRITE", { studentId: rec.studentId, classId });
    });

    return NextResponse.json({ success: true, message: "Attendance logs committed." });
  } catch (error: any) {
    console.error("Attendance API error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
