import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { category, description } = await req.json();
    if (!category || !description) {
      return NextResponse.json({ error: "Category and Description are required" }, { status: 400 });
    }

    const grievance = await db.grievance.create({
      data: {
        studentId: user.id,
        category,
        description,
        status: "pending",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Grievance ticket lodged in ERP registry.",
      grievance,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Grievance log failed" }, { status: 500 });
  }
}
