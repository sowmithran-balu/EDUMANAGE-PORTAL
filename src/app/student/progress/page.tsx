import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import StudentProgressWorkspace from "@/components/StudentProgressWorkspace";

async function getProgressData(studentId: string) {
  // 1. Fetch Exam Results chronologically
  const examResults = await db.examResult.findMany({
    where: { studentId },
    include: { exam: true },
    orderBy: { exam: { date: "asc" } },
  });

  const gradeHistory = examResults.map((er) => ({
    name: er.exam.title,
    score: Math.round((er.marks / er.exam.maxMarks) * 100),
  }));

  // 2. Fetch all Course Averages & Calculate Deviations dynamically
  const enrollments = await db.enrollment.findMany({
    where: { studentId },
    include: { class: { include: { course: true } } },
  });

  const enrolledClassIds = enrollments.map((e) => e.classId);

  // Fetch Submissions
  const submissions = await db.submission.findMany({
    where: { studentId, assignment: { classId: { in: enrolledClassIds } } },
    include: { assignment: true },
  });

  // Calculate subject averages
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

  // 3. Get latest AI Recommendations
  const latestRec = await db.aIInsight.findFirst({
    where: { studentId, type: "recommendation" },
    orderBy: { generatedAt: "desc" },
  });

  let recommendations = "Your AI Coach has not compiled recommendations yet.";
  if (latestRec) {
    try {
      const payload = JSON.parse(latestRec.payloadJson);
      recommendations = payload.recommendations || recommendations;
    } catch {}
  }

  // 4. Get recent submissions and scores for the table
  const recentSubmissions = await db.submission.findMany({
    where: { studentId },
    include: { assignment: { include: { class: { include: { course: true } } } } },
    orderBy: { submittedAt: "desc" },
    take: 5,
  });

  return {
    gradeHistory,
    deviations,
    recommendations,
    recentSubmissions,
  };
}

export default async function StudentProgressPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "student") {
    redirect("/login");
  }

  const data = await getProgressData(user.id);

  return (
    <StudentProgressWorkspace
      user={{ name: user.name, email: user.email }}
      gradeHistory={data.gradeHistory}
      deviations={data.deviations}
      recommendations={data.recommendations}
      recentSubmissions={data.recentSubmissions}
    />
  );
}
