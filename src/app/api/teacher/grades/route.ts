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
    const { assignmentId, classId, grades } = body; // grades: { studentId, score, feedback }[]

    if (!assignmentId || !classId || !grades || !Array.isArray(grades)) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    console.log(`[API] Teacher logged grades for assignment ${assignmentId} in class ${classId}`);

    // Commit submissions inside a transaction
    await db.$transaction(
      grades.map((g) =>
        db.submission.upsert({
          where: {
            assignmentId_studentId: {
              assignmentId,
              studentId: g.studentId,
            },
          },
          update: {
            score: parseFloat(g.score),
            feedback: g.feedback,
            submittedAt: new Date(),
          },
          create: {
            assignmentId,
            studentId: g.studentId,
            score: parseFloat(g.score),
            feedback: g.feedback,
            submittedAt: new Date(),
          },
        })
      )
    );

    // Trigger async AI engine recompute for each student graded
    grades.forEach((g) => {
      dispatchEvent("ACADEMIC_WRITE", { studentId: g.studentId, classId });
    });

    return NextResponse.json({ success: true, message: "Grades successfully recorded." });
  } catch (error: any) {
    console.error("Grades API error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
