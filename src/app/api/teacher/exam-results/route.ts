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
    const { examId, classId, results } = body; // results: { studentId, marks, grade }[]

    if (!examId || !classId || !results || !Array.isArray(results)) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    console.log(`[API] Teacher logged exam results for exam ${examId} in class ${classId}`);

    // Commit exam results inside a transaction
    await db.$transaction(
      results.map((r) =>
        db.examResult.upsert({
          where: {
            examId_studentId: {
              examId,
              studentId: r.studentId,
            },
          },
          update: {
            marks: parseFloat(r.marks),
            grade: r.grade,
          },
          create: {
            examId,
            studentId: r.studentId,
            marks: parseFloat(r.marks),
            grade: r.grade,
          },
        })
      )
    );

    // Trigger async AI engine recompute for each student graded
    results.forEach((r) => {
      dispatchEvent("ACADEMIC_WRITE", { studentId: r.studentId, classId });
    });

    return NextResponse.json({ success: true, message: "Exam results successfully committed." });
  } catch (error: any) {
    console.error("Exam Results API error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
