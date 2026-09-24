import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import TeacherCoPilotActions from "@/components/TeacherCoPilotActions";
import TeacherMentorshipPanel from "@/components/TeacherMentorshipPanel";
import { 
  BookOpen, Users, AlertTriangle, Sparkles, 
  BrainCircuit, ArrowRight, CheckCircle2, User 
} from "lucide-react";

async function getTeacherDashboardData(teacherId: string) {
  // 1. Fetch classes taught by this teacher
  const classes = await db.class.findMany({
    where: {
      course: {
        teacherId: teacherId
      }
    },
    include: {
      course: true,
      enrollments: {
        include: {
          student: true
        }
      }
    }
  });

  // Extract all student IDs enrolled in this teacher's classes
  const studentIds = Array.from(
    new Set(classes.flatMap((c) => c.enrollments.map((e) => e.studentId)))
  );

  // 2. Fetch latest Risk AIInsights for these students
  const riskInsights = await db.aIInsight.findMany({
    where: {
      studentId: { in: studentIds },
      type: "risk"
    },
    orderBy: { generatedAt: "desc" }
  });

  // Keep only the latest risk insight per student
  const studentLatestRiskMap: { [studentId: string]: { score: number; level: string; factors: string[]; studentName: string } } = {};
  
  // Find names mapping
  const studentNames: { [id: string]: string } = {};
  classes.forEach((c) => {
    c.enrollments.forEach((e) => {
      studentNames[e.studentId] = e.student.name;
    });
  });

  riskInsights.forEach((insight) => {
    if (!studentLatestRiskMap[insight.studentId]) {
      try {
        const payload = JSON.parse(insight.payloadJson);
        studentLatestRiskMap[insight.studentId] = {
          score: payload.score || 0,
          level: payload.level || "Low",
          factors: payload.factors || [],
          studentName: studentNames[insight.studentId] || "Student"
        };
      } catch {}
    }
  });

  // Filter students who flag Medium or High Risk (score >= 30) for the Co-Pilot panel
  const flaggedStudents = Object.entries(studentLatestRiskMap)
    .map(([studentId, data]) => ({
      studentId,
      ...data
    }))
    .filter((s) => s.score >= 30)
    .sort((a, b) => b.score - a.score);

  // 3. Fetch mentees data (students and attendance rate)
  const studentUsers = await db.user.findMany({
    where: { role: "student" },
    include: { attendance: true }
  });
  
  const mentees = studentUsers.map((stu) => {
    let cgpa = 7.5;
    try {
      if (stu.profile) {
        const profileData = JSON.parse(stu.profile);
        const match = profileData.bio?.match(/CGPA\s*\(?([0-9.]+)\)?/i);
        if (match && match[1]) cgpa = parseFloat(match[1]);
      }
    } catch {}
    
    const attList = stu.attendance;
    const total = attList.length;
    const presentCount = attList.filter((a) => a.status === "present" || a.status === "late").length;
    const attendanceRate = total > 0 ? Math.round((presentCount / total) * 100) : 100;

    return {
      id: stu.id,
      name: stu.name,
      email: stu.email,
      cgpa,
      attendanceRate,
    };
  });

  // 4. Fetch mentor sessions
  const meetingsData = await db.mentorMeeting.findMany({
    where: { mentorId: teacherId },
    include: { mentee: true },
    orderBy: { date: "desc" },
  });

  const meetings = meetingsData.map((m) => ({
    id: m.id,
    menteeId: m.menteeId,
    menteeName: m.mentee.name,
    date: m.date,
    notes: m.notes,
    category: m.category,
  }));

  return {
    classes,
    flaggedStudents,
    totalStudents: studentIds.length,
    mentees,
    meetings,
  };
}

export default async function TeacherDashboardPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "teacher") {
    redirect("/login");
  }

  const data = await getTeacherDashboardData(user.id);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Faculty Command Center
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          Professor: {user.name} • Access real-time class metrics and AI Co-Pilot flags
        </p>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Side: Classes Taught */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel rounded-3xl p-6 border border-slate-900">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-amber-500" />
              <span>Assigned Classes</span>
            </h2>

            {data.classes.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                You do not have any assigned classes. Contact administration.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {data.classes.map((cls) => (
                  <div key={cls.id} className="p-5 bg-slate-950/40 rounded-2xl border border-slate-900 flex flex-col justify-between h-48 hover:border-slate-800 transition-all">
                    <div>
                      <h3 className="font-bold text-white text-sm line-clamp-1">{cls.course.title}</h3>
                      <p className="text-[10px] text-amber-500 font-semibold mt-0.5">{cls.name}</p>
                      
                      <div className="flex items-center space-x-2 mt-4 text-[10px] text-slate-400">
                        <Users className="h-4 w-4 text-amber-500" />
                        <span>{cls.enrollments.length} Enrolled Students</span>
                      </div>
                    </div>

                    <Link
                      href={`/teacher/classes/${cls.id}`}
                      className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700/50 text-white text-center font-bold text-[10px] py-2.5 rounded-xl transition-all tracking-wider uppercase flex items-center justify-center space-x-1.5 cursor-pointer mt-4"
                    >
                      <span>Manage Cohort</span>
                      <ArrowRight className="h-3 w-3 text-amber-500" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Mentorship Advising Panel */}
          <TeacherMentorshipPanel mentees={data.mentees} initialMeetings={data.meetings} />
        </div>

        {/* Right Side: Teacher grading co-pilot panel */}
        <div className="glass-panel rounded-3xl p-6 border border-amber-500/20 ai-glow relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 bg-amber-500/10 rounded-bl-3xl border-l border-b border-amber-500/20">
            <Sparkles className="h-4 w-4 text-amber-500 animate-spin" />
          </div>

          <h2 className="text-lg font-bold text-white mb-6 flex items-center space-x-2">
            <BrainCircuit className="h-5 w-5 text-amber-500" />
            <span>Grading Co-Pilot</span>
          </h2>

          <p className="text-[10px] text-slate-400 mb-6 leading-relaxed">
            The co-pilot highlights students whose learning indices (attendance rate, homework submission logs) flag academic risk, recommending early outreach.
          </p>

          <div className="space-y-4">
            {data.flaggedStudents.length === 0 ? (
              <div className="p-6 bg-slate-950/40 rounded-2xl border border-slate-900 text-center space-y-2">
                <CheckCircle2 className="h-6 w-6 text-emerald-400 mx-auto" />
                <p className="font-bold text-white text-[10px] uppercase tracking-wide">All Students Balanced</p>
                <p className="text-[9px] text-slate-500 leading-normal">
                  No enrollees in your active sections flag performance risks at this time.
                </p>
              </div>
            ) : (
              data.flaggedStudents.map((student) => (
                <div key={student.studentId} className={`p-4 bg-slate-950/40 rounded-2xl border ${
                  student.score >= 60 ? "border-red-500/20" : "border-amber-500/20"
                } space-y-3`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 truncate">
                      <div className="h-7 w-7 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700 shrink-0">
                        <User className="h-3.5 w-3.5 text-amber-500" />
                      </div>
                      <span className="font-bold text-white text-[11px] truncate">{student.studentName}</span>
                    </div>

                    <span className={`inline-flex px-1.5 py-0.5 rounded-md text-[8px] font-bold uppercase tracking-wider ${
                      student.level === "High" 
                        ? "bg-red-500/10 text-red-400 border border-red-500/25" 
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/25"
                    }`}>
                      {student.score} Risk
                    </span>
                  </div>

                  <div className="space-y-1 pb-1">
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">Contribution Factors:</p>
                    <ul className="list-disc pl-4 text-[9px] text-slate-400 space-y-0.5">
                      {student.factors.map((factor, i) => (
                        <li key={i}>{factor}</li>
                      ))}
                    </ul>
                  </div>

                  <TeacherCoPilotActions studentName={student.studentName} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
