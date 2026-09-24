import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { 
  Users, BookOpen, GraduationCap, School, 
  CloudSun, ShieldAlert, CheckCircle2, ChevronRight, Activity, BrainCircuit, Sparkles
} from "lucide-react";

async function getAdminOverviewData() {
  // 1. Core counters
  const studentCount = await db.user.count({ where: { role: "student" } });
  const teacherCount = await db.user.count({ where: { role: "teacher" } });
  const courseCount = await db.course.count();
  const classCount = await db.class.count();

  // 2. Fetch all classes for Class Weather Heatmap
  const classes = await db.class.findMany({
    include: {
      course: true,
      enrollments: true,
      exams: {
        include: { examResults: true }
      },
      attendance: true
    }
  });

  const classWeather = await Promise.all(
    classes.map(async (cls) => {
      const studentIds = cls.enrollments.map((e) => e.studentId);
      
      // Calculate Average Attendance
      const totalAtt = cls.attendance.length;
      const presentAtt = cls.attendance.filter((a) => a.status === "present").length;
      const lateAtt = cls.attendance.filter((a) => a.status === "late").length;
      const attendanceRate = totalAtt > 0 ? (presentAtt + 0.5 * lateAtt) / totalAtt : 1.0;

      // Calculate Average Exam Score
      let examScoreSum = 0;
      let examScoreCount = 0;
      cls.exams.forEach((ex) => {
        ex.examResults.forEach((res) => {
          examScoreSum += res.marks / ex.maxMarks;
          examScoreCount += 1;
        });
      });
      const avgExamScore = examScoreCount > 0 ? examScoreSum / examScoreCount : 0.85;

      // Calculate Class AI Risk Index
      const latestRisks = await db.aIInsight.findMany({
        where: {
          studentId: { in: studentIds },
          type: "risk"
        },
        orderBy: { generatedAt: "desc" }
      });

      // Latest risk score per student
      const studentLatestRiskMap: { [id: string]: number } = {};
      latestRisks.forEach((r) => {
        if (studentLatestRiskMap[r.studentId] === undefined) {
          try {
            const payload = JSON.parse(r.payloadJson);
            studentLatestRiskMap[r.studentId] = payload.score ?? 0;
          } catch {}
        }
      });

      const riskScores = Object.values(studentLatestRiskMap);
      const avgRiskIndex = riskScores.length > 0 
        ? riskScores.reduce((sum, s) => sum + s, 0) / riskScores.length
        : 10; // default low risk if no data

      // Determine Weather State
      let weatherState: "Clear" | "Overcast" | "Stormy" = "Clear";
      if (avgRiskIndex >= 50) weatherState = "Stormy";
      else if (avgRiskIndex >= 25) weatherState = "Overcast";

      return {
        id: cls.id,
        name: cls.name,
        courseTitle: cls.course.title,
        enrolledCount: cls.enrollments.length,
        attendanceRate: Math.round(attendanceRate * 100),
        avgExamScore: Math.round(avgExamScore * 100),
        avgRiskIndex: Math.round(avgRiskIndex),
        weatherState
      };
    })
  );

  // 3. Fetch latest AI insights for monitoring feed
  const rawInsights = await db.aIInsight.findMany({
    orderBy: { generatedAt: "desc" },
    take: 6,
    include: {
      student: true
    }
  });

  const alerts = rawInsights.map((insight) => {
    let title = "Diagnostic Loop Synchronized";
    let desc = `Grounded learning profile recalculation completed for student.`;
    let type = "info";

    try {
      const payload = JSON.parse(insight.payloadJson);
      if (insight.type === "risk") {
        const score = payload.score ?? 0;
        if (score >= 60) {
          title = `High Academic Risk Flagged: ${insight.student?.name || "Student"}`;
          desc = `Risk index evaluated at ${score}/100. Factors: ${payload.factors?.join(", ") || "Attendance drops"}`;
          type = "danger";
        } else if (score >= 30) {
          title = `Moderate Risk Warning: ${insight.student?.name || "Student"}`;
          desc = `Risk index evaluated at ${score}/100 due to minor course grade variances.`;
          type = "warning";
        } else {
          title = `Balanced Learning Baseline: ${insight.student?.name || "Student"}`;
          desc = `Indicators stable. Risk score is ${score}/100.`;
          type = "success";
        }
      } else if (insight.type === "recommendation") {
        title = `Study Action Plan Sync: ${insight.student?.name || "Student"}`;
        desc = `Updated 2-week targeted study guidelines for weak topics.`;
        type = "info";
      }
    } catch {}

    return {
      id: insight.id,
      title,
      desc,
      type,
      time: insight.generatedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  });

  return {
    studentCount,
    teacherCount,
    courseCount,
    classCount,
    classWeather,
    alerts
  };
}

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    redirect("/login");
  }

  const data = await getAdminOverviewData();

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Academy Administration
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Administrator: {user.name} • System-wide control panel & AI indices mapping
          </p>
        </div>
        <Link
          href="/admin/reports"
          className="self-start md:self-auto bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all uppercase tracking-wider cursor-pointer"
        >
          Reports & Exports
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="glass-panel rounded-2xl p-5 border border-slate-900 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Enrollees</p>
            <p className="text-xl font-extrabold text-white mt-1">{data.studentCount}</p>
          </div>
          <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400">
            <GraduationCap className="h-5 w-5" />
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-900 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Active Faculty</p>
            <p className="text-xl font-extrabold text-white mt-1">{data.teacherCount}</p>
          </div>
          <div className="p-3 bg-sky-500/10 rounded-xl border border-sky-500/20 text-sky-400">
            <Users className="h-5 w-5" />
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-900 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Course Catalog</p>
            <p className="text-xl font-extrabold text-white mt-1">{data.courseCount}</p>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400">
            <BookOpen className="h-5 w-5" />
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-900 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Scheduled Sections</p>
            <p className="text-xl font-extrabold text-white mt-1">{data.classCount}</p>
          </div>
          <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20 text-purple-400">
            <School className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Side: Heatmap (col-span-2) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel rounded-3xl p-6 border border-slate-900">
            <div className="mb-6">
              <h2 className="text-sm font-bold text-white flex items-center space-x-2">
                <CloudSun className="h-4 w-4 text-indigo-400" />
                <span>Comparative "Class Weather" Heatmap</span>
              </h2>
              <p className="text-[10px] text-slate-500 mt-1">
                Surfaces overall class risk levels, average attendance rates, and exam metrics at a glance.
              </p>
            </div>

            {/* Heatmap Matrix Table */}
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left text-xs text-slate-300">
                <thead>
                  <tr className="border-b border-slate-800 text-[10px] uppercase tracking-wider text-slate-500">
                    <th className="pb-3 pr-4 font-bold">Class Name</th>
                    <th className="pb-3 px-4 font-bold">Course Title</th>
                    <th className="pb-3 px-4 font-bold text-center">Students</th>
                    <th className="pb-3 px-4 font-bold text-center">Avg Attendance</th>
                    <th className="pb-3 px-4 font-bold text-center">Avg Exam</th>
                    <th className="pb-3 pl-4 font-bold text-right">AI Risk Index</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {data.classWeather.map((cls) => {
                    // Determine color indicators for cells based on weather index
                    let riskColorClass = "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
                    if (cls.weatherState === "Stormy") {
                      riskColorClass = "text-red-400 bg-red-500/10 border-red-500/20";
                    } else if (cls.weatherState === "Overcast") {
                      riskColorClass = "text-amber-400 bg-amber-500/10 border-amber-500/20";
                    }

                    return (
                      <tr key={cls.id} className="hover:bg-slate-950/20">
                        <td className="py-4 pr-4 font-bold text-slate-200">
                          {cls.name}
                        </td>
                        <td className="py-4 px-4 text-slate-400 font-medium">
                          {cls.courseTitle}
                        </td>
                        <td className="py-4 px-4 text-center font-semibold text-slate-300">
                          {cls.enrolledCount}
                        </td>
                        <td className="py-4 px-4 text-center font-bold text-indigo-400">
                          {cls.attendanceRate}%
                        </td>
                        <td className="py-4 px-4 text-center font-bold text-sky-400">
                          {cls.avgExamScore}%
                        </td>
                        <td className="py-4 pl-4 text-right">
                          <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-xl text-[9px] font-extrabold uppercase tracking-wider border ${riskColorClass}`}>
                            <Activity className="h-3 w-3" />
                            <span>{cls.avgRiskIndex}% ({cls.weatherState})</span>
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Institutional AI alerts log monitoring feed (col-span-1) */}
        <div className="glass-panel rounded-3xl p-6 border border-indigo-500/20 ai-glow relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 bg-indigo-500/10 rounded-bl-3xl border-l border-b border-indigo-500/20">
            <Sparkles className="h-4 w-4 text-indigo-400 animate-spin" />
          </div>

          <h2 className="text-sm font-bold text-white mb-6 flex items-center space-x-2">
            <BrainCircuit className="h-4 w-4 text-indigo-400" />
            <span>AI Monitoring Alert Feed</span>
          </h2>

          <p className="text-[10px] text-slate-500 mb-6 leading-relaxed">
            Real-time audit log of recalculated performance diagnostic indices and flagged risks across student cohorts.
          </p>

          <div className="space-y-4">
            {data.alerts.length === 0 ? (
              <div className="p-6 bg-slate-950/40 rounded-2xl border border-slate-900 text-center text-xs text-slate-500">
                No diagnostic insights logged yet. Run seed script or submit test grades.
              </div>
            ) : (
              data.alerts.map((alert) => (
                <div key={alert.id} className="p-3.5 bg-slate-950/40 rounded-2xl border border-slate-800 space-y-1.5 text-xs">
                  <div className="flex items-start justify-between gap-2">
                    <span className={`inline-flex px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wider ${
                      alert.type === "danger"
                        ? "bg-red-500/10 text-red-400 border border-red-500/20"
                        : alert.type === "warning"
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        : alert.type === "success"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                    }`}>
                      {alert.type}
                    </span>
                    <span className="text-[8px] font-bold text-slate-500 shrink-0">{alert.time}</span>
                  </div>

                  <p className="font-extrabold text-slate-200 text-[10px] leading-tight">{alert.title}</p>
                  <p className="text-[9px] text-slate-400 leading-relaxed font-semibold">{alert.desc}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
