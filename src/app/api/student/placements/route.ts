import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { jobId } = await req.json();
    if (!jobId) {
      return NextResponse.json({ error: "Job ID is required" }, { status: 400 });
    }

    // 1. Fetch placement job details
    const job = await db.placementJob.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return NextResponse.json({ error: "Placement drive not found" }, { status: 404 });
    }

    // 2. Fetch student's profile to extract CGPA
    let cgpa = 7.5; // default fallback
    try {
      if (user.profile) {
        const profileData = JSON.parse(user.profile);
        const match = profileData.bio?.match(/CGPA\s*\(?([0-9.]+)\)?/i);
        if (match && match[1]) {
          cgpa = parseFloat(match[1]);
        }
      }
    } catch {}

    // 3. Verify CGPA eligibility
    if (cgpa < job.eligibilityCgpa) {
      return NextResponse.json(
        { error: `Ineligible: Your CGPA of ${cgpa} is below the ${job.eligibilityCgpa} minimum requirements for ${job.company}.` },
        { status: 400 }
      );
    }

    // 4. Create Placement Application
    const application = await db.placementApplication.create({
      data: {
        jobId,
        studentId: user.id,
        round: "applied",
        feedback: "Application submitted. Undergoing resume screening.",
      },
    });

    return NextResponse.json({
      success: true,
      message: `Successfully applied to ${job.company} for the role of ${job.role}!`,
      application,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Placement application failed" }, { status: 500 });
  }
}
