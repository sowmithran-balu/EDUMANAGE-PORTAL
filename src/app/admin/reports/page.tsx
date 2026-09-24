import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import AdminReportsCenter from "@/components/AdminReportsCenter";

async function getAdminReportsData() {
  // Fetch all students
  const students = await db.user.findMany({
    where: { role: "student" },
    include: {
      enrollments: {
        include: {
          class: {
            include: {
              course: {
                include: { teacher: true },
              },
            },
          },
        },
      },
      attendance: true,
      submissions: {
        include: { assignment: true },
        orderBy: { submittedAt: "desc" },
        take: 5,
      },
      aiInsights: {
        orderBy: { generatedAt: "desc" },
      },
    },
  });

  const studentsReportData = students.map((student) => {
    // 1. Calculate overall attendance
    const totalAtt = student.attendance.length;
    const presentCount = student.attendance.filter((a) => a.status === "present").length;
    const lateCount = student.attendance.filter((a) => a.status === "late").length;
    const attendanceRate = totalAtt > 0 ? (presentCount + 0.5 * lateCount) / totalAtt : 1.0;

    // 2. Fetch latest AI Insights
    const riskInsight = student.aiInsights.find((i) => i.type === "risk");
    const recInsight = student.aiInsights.find((i) => i.type === "recommendation");

    let riskScore = 0;
    let riskLevel = "Low";
    let riskFactors: string[] = [];

    if (riskInsight) {
      try {
        const payload = JSON.parse(riskInsight.payloadJson);
        riskScore = payload.score ?? 0;
        riskLevel = payload.level ?? "Low";
        riskFactors = payload.factors ?? [];
      } catch {}
    }

    let recommendations = "No recommendations computed yet.";
    if (recInsight) {
      try {
        const payload = JSON.parse(recInsight.payloadJson);
        recommendations = payload.recommendations || recommendations;
      } catch {}
    }

    // 3. Generate dynamic narrative paragraph based on risk
    const attPercent = Math.round(attendanceRate * 100);
    let narrativeSummary = "";
    if (riskScore >= 60) {
      narrativeSummary = `${student.name} is currently flagged as High Academic Risk (${riskScore}/100) inside the Aether Academic Intelligence Engine. This critical rating is primarily driven by: ${riskFactors.join(", ")}. Their overall attendance rate stands at ${attPercent}%, and recent exam results suggest significant performance challenges. We recommend immediate academic intervention, private tutoring blocks, and a student-teacher review session this week.`;
    } else if (riskScore >= 30) {
      narrativeSummary = `${student.name} is demonstrating moderate academic risk (${riskScore}/100) due to: ${riskFactors.join(", ")}. While their overall attendance is stable at ${attPercent}%, their recent assignment scores show moderate variability. Proactive review support is advised to stabilize their learning trajectory before upcoming final examinations.`;
    } else {
      narrativeSummary = `${student.name} is demonstrating outstanding academic consistency with a low AI risk score of ${riskScore}/100. Their attendance rate is exceptionally strong at ${attPercent}%, and homework scores remain consistently high. No academic interventions or risk remediation programs are required at this time.`;
    }

    return {
      id: student.id,
      name: student.name,
      email: student.email,
      attendanceRate: attPercent,
      completionRate: 100, // mock completion
      riskScore,
      riskLevel,
      riskFactors,
      recommendations,
      narrativeSummary,
      courses: student.enrollments.map((e) => ({
        id: e.class.course.id,
        title: e.class.course.title,
        instructor: e.class.course.teacher.name,
      })),
      recentGrades: student.submissions.map((sub) => ({
        id: sub.id,
        title: sub.assignment.title,
        score: sub.score ?? 0,
        maxScore: sub.assignment.maxScore,
        feedback: sub.feedback,
      })),
    };
  });

  return studentsReportData;
}

export default async function AdminReportsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    redirect("/login");
  }

  const students = await getAdminReportsData();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Narrative Performance Reports
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          Export AI-generated performance narrative summaries and grades records for parents or institution files.
        </p>
      </div>

      <AdminReportsCenter students={students} />
    </div>
  );
}
