import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import StudentDashboardWorkspace from "@/components/StudentDashboardWorkspace";

async function getStudentDashboardData(studentId: string) {
  // 1. Get Enrollments & Courses
  const enrollments = await db.enrollment.findMany({
    where: { studentId },
    include: {
      class: {
        include: {
          course: {
            include: { teacher: true }
          },
          assignments: true
        }
      }
    }
  });

  const enrolledClassIds = enrollments.map((e) => e.classId);

  // 2. Get Attendance rate & records
  const attendance = await db.attendance.findMany({
    where: { studentId, classId: { in: enrolledClassIds } }
  });
  const totalAtt = attendance.length;
  const presentAtt = attendance.filter((a) => a.status === "present").length;
  const lateAtt = attendance.filter((a) => a.status === "late").length;
  const attendanceRate = totalAtt > 0 ? (presentAtt + 0.5 * lateAtt) / totalAtt : 0.92;

  // 3. Get Submissions
  const submissions = await db.submission.findMany({
    where: { studentId, assignment: { classId: { in: enrolledClassIds } } },
    include: { assignment: true }
  });
  
  const totalAssignments = enrollments.reduce((sum, e) => sum + e.class.assignments.length, 0);
  const submissionsCount = submissions.length;

  // 4. Get Latest AI Insights (Risk & Recommendation)
  const latestRisk = await db.aIInsight.findFirst({
    where: { studentId, type: "risk" },
    orderBy: { generatedAt: "desc" }
  });

  const latestRec = await db.aIInsight.findFirst({
    where: { studentId, type: "recommendation" },
    orderBy: { generatedAt: "desc" }
  });

  let riskData = { score: 0, level: "Low", factors: ["No flags detected. Meeting requirements."] };
  if (latestRisk) {
    try {
      riskData = JSON.parse(latestRisk.payloadJson);
    } catch {}
  }

  let recommendations = "Your AI Coach has not compiled suggestions yet. Complete assignments to generate insights.";
  if (latestRec) {
    try {
      const payload = JSON.parse(latestRec.payloadJson);
      recommendations = payload.recommendations || recommendations;
    } catch {}
  }

  // 5. Get all student profiles (for peer directory / Student Management)
  const allStudents = await db.user.findMany({
    where: { role: "student" },
    select: {
      id: true,
      name: true,
      email: true,
      profile: true
    }
  });

  // 6. Get Fees
  const allFees = await db.fee.findMany({
    where: { studentId }
  });

  // 7. Get all submissions (for Exams list)
  const allSubmissions = await db.submission.findMany({
    where: { studentId },
    include: { assignment: { include: { class: { include: { course: true } } } } },
    orderBy: { submittedAt: "desc" },
  });

  // 8. Exam Results trajectory & deviation calculations
  const examResults = await db.examResult.findMany({
    where: { studentId },
    include: { exam: true },
    orderBy: { exam: { date: "asc" } },
  });

  const gradeHistory = examResults.map((er) => ({
    name: er.exam.title,
    score: Math.round((er.marks / er.exam.maxMarks) * 100),
  }));

  const subjectScores: { [title: string]: { sum: number; count: number } } = {};
  submissions.forEach((s) => {
    if (s.score === null) return;
    const course = enrollments.find((e) => e.classId === s.assignment.classId)?.class.course;
    if (!course) return;
    if (!subjectScores[course.title]) {
      subjectScores[course.title] = { sum: 0, count: 0 };
    }
    subjectScores[course.title].sum += s.score / s.assignment.maxScore;
    subjectScores[course.title].count += 1;
  });

  examResults.forEach((er) => {
    const course = enrollments.find((e) => e.classId === er.exam.classId)?.class.course;
    if (!course) return;
    if (!subjectScores[course.title]) {
      subjectScores[course.title] = { sum: 0, count: 0 };
    }
    subjectScores[course.title].sum += er.marks / er.exam.maxMarks;
    subjectScores[course.title].count += 1;
  });

  const subjectAverages = Object.entries(subjectScores).map(([title, data]) => ({
    subject: title,
    average: data.sum / data.count,
  }));

  const overallAverage =
    subjectAverages.length > 0
      ? subjectAverages.reduce((sum, sa) => sum + sa.average, 0) / subjectAverages.length
      : 0.85;

  const deviations = subjectAverages.map((sa) => ({
    subject: sa.subject,
    average: Math.round(sa.average * 100),
    deviation: Math.round((sa.average - overallAverage) * 100),
  }));

  return {
    enrollments,
    attendanceRate,
    totalAssignments,
    submissionsCount,
    riskData,
    recommendations,
    allStudents,
    allFees,
    allSubmissions,
    gradeHistory,
    deviations
  };
}

export default async function StudentDashboardPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "student") {
    redirect("/login");
  }

  const data = await getStudentDashboardData(user.id);

  return (
    <StudentDashboardWorkspace
      user={{ id: user.id, name: user.name, email: user.email, role: user.role }}
      enrollments={data.enrollments}
      attendanceRate={data.attendanceRate}
      totalAssignments={data.totalAssignments}
      submissionsCount={data.submissionsCount}
      riskData={data.riskData}
      recommendations={data.recommendations}
      allStudents={data.allStudents}
      allFees={data.allFees}
      allSubmissions={data.allSubmissions}
      gradeHistory={data.gradeHistory}
      deviations={data.deviations}
    />
  );
}
