import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { feeId } = await req.json();
    if (!feeId) {
      return NextResponse.json({ error: "Fee ID is required" }, { status: 400 });
    }

    const fee = await db.fee.findUnique({
      where: { id: feeId },
    });

    if (!fee || fee.studentId !== user.id) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    // Process payment (mock ERP update)
    await db.fee.update({
      where: { id: feeId },
      data: {
        paid: fee.amount, // fully paid
        status: "paid",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Payment processed successfully through ERP gateway.",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Payment failure" }, { status: 500 });
  }
}
