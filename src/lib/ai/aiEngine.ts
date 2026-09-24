import { db } from "../db";
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini API if key is present
const geminiApiKey = process.env.GEMINI_API_KEY;
const ai = geminiApiKey ? new GoogleGenAI({ apiKey: geminiApiKey }) : null;

export interface RiskAnalysis {
  score: number; // 0 to 100
  level: "Low" | "Medium" | "High";
  factors: string[];
}

export interface WeakSubject {
  courseId: string;
  courseTitle: string;
  studentAverage: number;
  overallAverage: number;
  deviation: number;
}

export interface AIInsightPayload {
  risk: RiskAnalysis;
  weakSubjects: WeakSubject[];
  recommendations: string;
  attendanceRate: number;
  assignmentCompletionRate: number;
}

/**
 * Calculates academic trend and regression analysis for a student.
 */
export async function recomputeStudentInsights(studentId: string, classId?: string): Promise<AIInsightPayload> {
  // 1. Fetch Student Learning Data
  const enrollments = await db.enrollment.findMany({
    where: { studentId },
    include: { class: { include: { course: true } } },
  });

  const enrolledClassIds = enrollments.map((e) => e.classId);

  // Fetch Attendance
  const attendanceRecords = await db.attendance.findMany({
    where: { studentId, classId: { in: enrolledClassIds } },
  });

  // Fetch Assignment Submissions
  const submissions = await db.submission.findMany({
    where: { studentId, assignment: { classId: { in: enrolledClassIds } } },
    include: { assignment: true },
  });

  // Fetch Exam Results
  const examResults = await db.examResult.findMany({
    where: { studentId, exam: { classId: { in: enrolledClassIds } } },
    include: { exam: true },
  });

  // --- ATTENDANCE METRICS ---
  const totalAttendance = attendanceRecords.length;
  const presentCount = attendanceRecords.filter((r) => r.status === "present").length;
  const lateCount = attendanceRecords.filter((r) => r.status === "late").length;
  const attendanceRate = totalAttendance > 0 ? (presentCount + 0.5 * lateCount) / totalAttendance : 1.0; // default to 100%

  // --- ASSIGNMENT METRICS ---
  const submissionsWithScores = submissions.filter((s) => s.score !== null);
  const averageAssignmentScore =
    submissionsWithScores.length > 0
      ? submissionsWithScores.reduce((acc, s) => acc + (s.score! / s.assignment.maxScore), 0) / submissionsWithScores.length
      : 1.0; // default to 100%
  const totalAssignments = await db.assignment.count({
    where: { classId: { in: enrolledClassIds } },
  });
  const assignmentCompletionRate = totalAssignments > 0 ? submissions.length / totalAssignments : 1.0;

  // --- EXAM METRICS & TRAJECTORY ---
  const examAveragesByClass: { [classId: string]: { sum: number; count: number } } = {};
  const examGrades: { date: Date; scorePercent: number }[] = [];

  examResults.forEach((res) => {
    const percent = res.marks / res.exam.maxMarks;
    examGrades.push({ date: new Date(res.exam.date), scorePercent: percent });

    if (!examAveragesByClass[res.exam.classId]) {
      examAveragesByClass[res.exam.classId] = { sum: 0, count: 0 };
    }
    examAveragesByClass[res.exam.classId].sum += percent;
    examAveragesByClass[res.exam.classId].count += 1;
  });

  // Calculate trajectory (linear slope of exam performance over time)
  // Sort exams chronologically
  examGrades.sort((a, b) => a.date.getTime() - b.date.getTime());
  let slope = 0; // slope of score percentage per month (approx 30 days)
  if (examGrades.length > 1) {
    const xMean = examGrades.reduce((sum, g, idx) => sum + idx, 0) / examGrades.length;
    const yMean = examGrades.reduce((sum, g) => sum + g.scorePercent, 0) / examGrades.length;

    let numerator = 0;
    let denominator = 0;
    for (let i = 0; i < examGrades.length; i++) {
      numerator += (i - xMean) * (examGrades[i].scorePercent - yMean);
      denominator += Math.pow(i - xMean, 2);
    }
    slope = denominator !== 0 ? numerator / denominator : 0;
  }

  const averageExamScore =
    examGrades.length > 0 ? examGrades.reduce((sum, g) => sum + g.scorePercent, 0) / examGrades.length : 1.0;

  // --- WEAK SUBJECT IDENTIFICATION ---
  // Compare student average per course vs overall average across all courses
  const courseAverages: { [courseId: string]: { sum: number; count: number; title: string } } = {};
  
  // Aggregate all assignments and exams by course
  submissionsWithScores.forEach((s) => {
    const course = enrollments.find((e) => e.classId === s.assignment.classId)?.class.course;
    if (!course) return;
    if (!courseAverages[course.id]) {
      courseAverages[course.id] = { sum: 0, count: 0, title: course.title };
    }
    courseAverages[course.id].sum += s.score! / s.assignment.maxScore;
    courseAverages[course.id].count += 1;
  });

  examResults.forEach((res) => {
    const course = enrollments.find((e) => e.classId === res.exam.classId)?.class.course;
    if (!course) return;
    if (!courseAverages[course.id]) {
      courseAverages[course.id] = { sum: 0, count: 0, title: course.title };
    }
    courseAverages[course.id].sum += res.marks / res.exam.maxMarks;
    courseAverages[course.id].count += 1;
  });

  const subjectAveragesList = Object.entries(courseAverages).map(([courseId, data]) => ({
    courseId,
    courseTitle: data.title,
    studentAverage: data.sum / data.count,
  }));

  const overallAvg =
    subjectAveragesList.length > 0
      ? subjectAveragesList.reduce((sum, s) => sum + s.studentAverage, 0) / subjectAveragesList.length
      : 0.85;

  const weakSubjects: WeakSubject[] = subjectAveragesList
    .map((sa) => ({
      courseId: sa.courseId,
      courseTitle: sa.courseTitle,
      studentAverage: Math.round(sa.studentAverage * 100),
      overallAverage: Math.round(overallAvg * 100),
      deviation: Math.round((sa.studentAverage - overallAvg) * 100),
    }))
    // Subject is flagged weak if its deviation is negative (below student's average) or absolute average is < 70%
    .filter((sa) => sa.deviation < -5 || sa.studentAverage < 70)
    .sort((a, b) => a.deviation - b.deviation);

  // --- AT-RISK DETECTOR (LOGISTIC REGRESSION INSPIRED MODEL) ---
  const factors: string[] = [];
  let riskScore = 0;

  // Attendance factor: < 85% starts generating risk, < 75% critical
  if (attendanceRate < 0.85) {
    const attRiskVal = ((0.85 - attendanceRate) / 0.85) * 45; // max 45 points
    riskScore += attRiskVal;
    factors.push(`Low Attendance Rate (${Math.round(attendanceRate * 100)}%)`);
  }

  // Assignment completion: ratio of submissions vs total assignments
  if (assignmentCompletionRate < 0.9) {
    const completionRiskVal = (1.0 - assignmentCompletionRate) * 20; // max 20 points
    riskScore += completionRiskVal;
    factors.push(`Missed ${totalAssignments - submissions.length} Assignment Submissions`);
  }

  // Assignment scores: average score < 70%
  if (averageAssignmentScore < 0.75) {
    const scoreRiskVal = ((0.75 - averageAssignmentScore) / 0.75) * 15; // max 15 points
    riskScore += scoreRiskVal;
    factors.push(`Below Average Assignment Scores (${Math.round(averageAssignmentScore * 100)}%)`);
  }

  // Exam trajectory: negative slope means falling grade trend
  if (slope < -0.02) {
    riskScore += 15;
    factors.push("Declining Exam Performance Trajectory");
  }

  // Exam absolute average: < 70%
  if (averageExamScore < 0.7) {
    const examRiskVal = ((0.7 - averageExamScore) / 0.7) * 20; // max 20 points
    riskScore += examRiskVal;
    factors.push(`Critical Exam Averages (${Math.round(averageExamScore * 100)}%)`);
  }

  // Cap risk score between 0 and 100
  riskScore = Math.min(100, Math.max(0, Math.round(riskScore)));
  let riskLevel: "Low" | "Medium" | "High" = "Low";
  if (riskScore >= 60) riskLevel = "High";
  else if (riskScore >= 30) riskLevel = "Medium";

  if (factors.length === 0) {
    factors.push("Consistent performance, meeting all academic requirements.");
  }

  const risk: RiskAnalysis = {
    score: riskScore,
    level: riskLevel,
    factors: factors.slice(0, 3), // return top 3 contributing factors
  };

  // --- STUDY RECOMMENDATIONS (GEMINI OR HEURISTIC) ---
  let recommendations = "";
  if (ai) {
    try {
      const prompt = `
        You are a highly supportive Academic Coach.
        Provide personalized study recommendations in clean markdown (with bullets and bullet sections) for a student based on this learning data:
        - Attendance: ${Math.round(attendanceRate * 100)}%
        - Assignment Completion: ${Math.round(assignmentCompletionRate * 100)}%
        - Recent Assignment Avg Score: ${Math.round(averageAssignmentScore * 100)}%
        - Recent Exam Avg Score: ${Math.round(averageExamScore * 100)}%
        - Grade Trend/Slope: ${slope < 0 ? "Declining" : "Improving/Stable"}
        - Flagged Weak Subjects: ${weakSubjects.map((s) => `${s.courseTitle} (avg: ${s.studentAverage}%, diff: ${s.deviation}%)`).join(", ")}
        
        Write 3 short, actionable bullets tailored specifically to their weak subjects. Be encouraging, precise, and outline exact recovery steps. Keep the entire response under 150 words.
      `;
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });
      recommendations = response.text || "";
    } catch (e) {
      console.error("Gemini recommendation error, falling back:", e);
      recommendations = generateLocalRecommendations(attendanceRate, assignmentCompletionRate, weakSubjects);
    }
  } else {
    recommendations = generateLocalRecommendations(attendanceRate, assignmentCompletionRate, weakSubjects);
  }

  const payload: AIInsightPayload = {
    risk,
    weakSubjects,
    recommendations,
    attendanceRate,
    assignmentCompletionRate,
  };

  // --- STORE INSIGHTS IN DB ---
  // In SQLite, store it as a JSON payload in AIInsight table
  // Clear past insights of same types to avoid bloating, or keep history.
  // The data contract: stored as a static output node. We will upsert or create new.
  // Let's upsert for 'risk', 'weak_subject' and 'recommendation' types.
  
  // Save Risk Insight
  await db.aIInsight.create({
    data: {
      studentId,
      classId: classId || null,
      type: "risk",
      payloadJson: JSON.stringify(risk),
    },
  });

  // Save Weak Subjects Insight
  await db.aIInsight.create({
    data: {
      studentId,
      classId: classId || null,
      type: "weak_subject",
      payloadJson: JSON.stringify(weakSubjects),
    },
  });

  // Save Recommendation Insight
  await db.aIInsight.create({
    data: {
      studentId,
      classId: classId || null,
      type: "recommendation",
      payloadJson: JSON.stringify({ recommendations, attendanceRate, assignmentCompletionRate }),
    },
  });

  return payload;
}

/**
 * Dynamic local heuristic generator for personalized study recommendations (No Gemini API Key fallback)
 */
function generateLocalRecommendations(
  attendanceRate: number,
  assignmentCompletionRate: number,
  weakSubjects: WeakSubject[]
): string {
  const recommendations: string[] = [];

  if (weakSubjects.length > 0) {
    recommendations.push(
      `### Target Weak Subjects\n` +
      weakSubjects.map((ws) => `* **Focus on ${ws.courseTitle}**: Your score (${ws.studentAverage}%) is currently ${Math.abs(ws.deviation)}% lower than your class average. Spend an extra 30 minutes daily reviewing its foundational notes.`).join("\n")
    );
  } else {
    recommendations.push(`### Maintain Academic Excellence\n* **Keep Up the Good Work**: Your performance is well-balanced across all subjects. Consider peer tutoring or taking advanced topics to challenge yourself.`);
  }

  const studyActionPlan: string[] = [];
  if (attendanceRate < 0.85) {
    studyActionPlan.push(`* **Improve Attendance**: Your attendance is at ${Math.round(attendanceRate * 100)}%. Prioritize attending live lectures and review class recordings to bridge learning gaps.`);
  }

  if (assignmentCompletionRate < 0.9) {
    studyActionPlan.push(`* **Catch Up on Submissions**: You have outstanding homework assignments. Schedule dedicated calendar blocks to submit remaining assignments on time.`);
  }

  if (weakSubjects.length > 0) {
    studyActionPlan.push(`* **Use Teacher Office Hours**: Book 10 minutes with your instructors in ${weakSubjects.map((s) => s.courseTitle).join(" and ")} to clarify recent test mistakes.`);
  } else {
    studyActionPlan.push(`* **Review Exam Structure**: Do mock tests weekly to maintain speed and efficiency.`);
  }

  recommendations.push(`### Action Plan\n` + studyActionPlan.join("\n"));

  return recommendations.join("\n\n");
}

/**
 * Generate institution or class-level narrative report summary for admins/teachers
 */
export async function generateClassWeatherSummary(classId: string): Promise<string> {
  const classObj = await db.class.findUnique({
    where: { id: classId },
    include: { course: true, enrollments: { include: { student: true } } },
  });

  if (!classObj) return "Class not found.";

  // Fetch all insights of enrollments in this class
  const studentIds = classObj.enrollments.map((e) => e.studentId);
  
  // Find latest risk insights for all students in class
  const riskInsights = await db.aIInsight.findMany({
    where: { studentId: { in: studentIds }, type: "risk" },
    orderBy: { generatedAt: "desc" },
  });

  // Group by student
  const studentLatestRiskMap: { [studentId: string]: RiskAnalysis } = {};
  riskInsights.forEach((insight) => {
    if (!studentLatestRiskMap[insight.studentId]) {
      try {
        studentLatestRiskMap[insight.studentId] = JSON.parse(insight.payloadJson);
      } catch {}
    }
  });

  const students = Object.values(studentLatestRiskMap);
  const total = students.length;
  const highRisk = students.filter((s) => s.score >= 60).length;
  const medRisk = students.filter((s) => s.score >= 30 && s.score < 60).length;
  const averageRisk = total > 0 ? students.reduce((sum, s) => sum + s.score, 0) / total : 0;

  const summaryParagraph = `
    ### AI Weather Report for ${classObj.course.title} - ${classObj.name}
    The class consists of **${total}** enrolled students with an average AI Risk Score of **${Math.round(averageRisk)}/100**.
    
    * **High-Risk Flags**: ${highRisk} student(s) currently flag high risk (score ≥ 60) and require immediate academic outreach.
    * **Medium-Risk Flags**: ${medRisk} student(s) show signs of dipping performance, primarily driven by attendance anomalies and missed assignments.
    * **Recommendation**: Implement targeted review sessions for core syllabus objectives this week to prevent grade decay before upcoming terms.
  `;

  return summaryParagraph.trim();
}
