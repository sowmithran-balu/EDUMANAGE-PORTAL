import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { dispatchEvent } from "@/lib/ai/eventDispatcher";

export async function POST(request: Request) {
  try {
    // 1. Get logged-in user
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized. Please log in first." }, { status: 401 });
    }

    if (user.role !== "student") {
      return NextResponse.json({ error: "Access denied. Only students can enroll in classes." }, { status: 403 });
    }

    // 2. Parse body (supports JSON and form urlencoded)
    let classId = "";
    const contentType = request.headers.get("content-type") || "";
    
    if (contentType.includes("application/json")) {
      const body = await request.json();
      classId = body.classId;
    } else {
      const formData = await request.formData();
      classId = formData.get("classId") as string;
    }

    if (!classId) {
      return NextResponse.json({ error: "Missing classId parameter" }, { status: 400 });
    }

    // 3. Verify class exists
    const targetClass = await db.class.findUnique({
      where: { id: classId },
    });

    if (!targetClass) {
      return NextResponse.json({ error: "Specified class does not exist" }, { status: 404 });
    }

    // 4. Check if already enrolled
    const existingEnrollment = await db.enrollment.findUnique({
      where: {
        studentId_classId: {
          studentId: user.id,
          classId: classId,
        },
      },
    });

    if (!existingEnrollment) {
      // 5. Create new enrollment
      await db.enrollment.create({
        data: {
          studentId: user.id,
          classId: classId,
          status: "active",
        },
      });

      // 6. Trigger async AI Engine recomputation (Learning Data initialization)
      dispatchEvent("ACADEMIC_WRITE", { studentId: user.id, classId });
    }

    // 7. Check if request expects redirect (e.g. form post) or json
    if (contentType.includes("application/json")) {
      return NextResponse.json({ success: true, message: "Enrolled successfully" });
    } else {
      // HTML Form redirect
      return NextResponse.redirect(new URL("/student", request.url), 303);
    }
  } catch (error: any) {
    console.error("Enrollment API error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
