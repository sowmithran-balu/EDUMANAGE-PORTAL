import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import TeacherClassWorkspace from "@/components/TeacherClassWorkspace";
import { generateClassWeatherSummary } from "@/lib/ai/aiEngine";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getClassWorkspaceData(classId: string, teacherId: string) {
  // Verify class exists and is taught by this teacher (RBAC ownership check)
  const classObj = await db.class.findUnique({
    where: { id: classId },
    include: {
      course: true,
      enrollments: {
        include: {
          student: true,
        },
      },
    },
  });

  if (!classObj) return null;
  if (classObj.course.teacherId !== teacherId) return null; // Ownership check

  const studentIds = classObj.enrollments.map((e) => e.studentId);

  // Fetch Attendance
  const attendance = await db.attendance.findMany({
    where: { classId },
  });

  // Fetch Assignments & Submissions
  const assignments = await db.assignment.findMany({
    where: { classId },
    include: {
      submissions: true,
    },
  });

  // Fetch Exams & Results
  const exams = await db.exam.findMany({
    where: { classId },
    include: {
      examResults: true,
    },
  });

  // Fetch latest AI Risk Insights for the enrolled students
  const riskInsights = await db.aIInsight.findMany({
    where: {
      studentId: { in: studentIds },
      type: "risk",
    },
    orderBy: { generatedAt: "desc" },
  });

  // Keep latest insight per student
  const studentLatestRisk: { [studentId: string]: { score: number; level: string } } = {};
  riskInsights.forEach((i) => {
    if (!studentLatestRisk[i.studentId]) {
      try {
        const payload = JSON.parse(i.payloadJson);
        studentLatestRisk[i.studentId] = {
          score: payload.score || 0,
          level: payload.level || "Low",
        };
      } catch {}
    }
  });

  const formattedRisk = studentIds.map((studentId) => ({
    studentId,
    score: studentLatestRisk[studentId]?.score ?? 0,
    level: studentLatestRisk[studentId]?.level ?? "Low",
  }));

  // Fetch or calculate AI Class Weather summary paragraph
  const weatherSummary = await generateClassWeatherSummary(classId);

  return {
    classData: {
      id: classObj.id,
      name: classObj.name,
      term: classObj.term,
      course: {
        title: classObj.course.title,
        category: classObj.course.category,
      },
      enrollments: classObj.enrollments.map((e) => ({
        student: {
          id: e.student.id,
          name: e.student.name,
          email: e.student.email,
        },
      })),
    },
    attendance: attendance.map((a) => ({
      id: a.id,
      studentId: a.studentId,
      date: a.date,
      status: a.status,
    })),
    assignments: assignments.map((asg) => ({
      id: asg.id,
      title: asg.title,
      description: asg.description,
      maxScore: asg.maxScore,
      dueDate: asg.dueDate.toISOString(),
      submissions: asg.submissions.map((s) => ({
        id: s.id,
        studentId: s.studentId,
        score: s.score,
        feedback: s.feedback,
      })),
    })),
    exams: exams.map((ex) => ({
      id: ex.id,
      title: ex.title,
      date: ex.date.toISOString(),
      maxMarks: ex.maxMarks,
      examResults: ex.examResults.map((r) => ({
        id: r.id,
        studentId: r.studentId,
        marks: r.marks,
        grade: r.grade,
      })),
    })),
    riskInsights: formattedRisk,
    weatherSummary,
  };
}

export default async function TeacherClassPage(props: PageProps) {
  const user = await getCurrentUser();
  if (!user || user.role !== "teacher") {
    redirect("/login");
  }

  const params = await props.params;
  const data = await getClassWorkspaceData(params.id, user.id);

  if (!data) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Back button */}
      <Link
        href="/teacher"
        className="inline-flex items-center space-x-2 text-slate-400 hover:text-white text-xs font-semibold uppercase tracking-wider mb-2 transition-colors"
      >
        <span>← Back to Dashboard</span>
      </Link>

      <TeacherClassWorkspace
        classData={data.classData}
        initialAttendance={data.attendance}
        initialAssignments={data.assignments}
        initialExams={data.exams}
        initialRiskInsights={data.riskInsights}
        weatherSummary={data.weatherSummary}
      />
    </div>
  );
}
