"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Users, Calendar, CheckSquare, ClipboardList, 
  BrainCircuit, User, AlertCircle, Plus, ChevronRight, CheckCircle2, Sparkles 
} from "lucide-react";

interface Student {
  id: string;
  name: string;
  email: string;
}

interface Enrollment {
  student: Student;
}

interface ClassData {
  id: string;
  name: string;
  term: string;
  course: {
    title: string;
    category: string;
  };
  enrollments: Enrollment[];
}

interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  status: string;
}

interface Assignment {
  id: string;
  title: string;
  description: string;
  maxScore: number;
  dueDate: string;
  submissions: {
    id: string;
    studentId: string;
    score: number | null;
    feedback: string | null;
  }[];
}

interface Exam {
  id: string;
  title: string;
  date: string;
  maxMarks: number;
  examResults: {
    id: string;
    studentId: string;
    marks: number;
    grade: string;
  }[];
}

interface RiskInsight {
  studentId: string;
  score: number;
  level: string;
}

interface WorkspaceProps {
  classData: ClassData;
  initialAttendance: AttendanceRecord[];
  initialAssignments: Assignment[];
  initialExams: Exam[];
  initialRiskInsights: RiskInsight[];
  weatherSummary: string;
}

export default function TeacherClassWorkspace({
  classData,
  initialAttendance,
  initialAssignments,
  initialExams,
  initialRiskInsights,
  weatherSummary
}: WorkspaceProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "attendance" | "assignments" | "exams">("overview");
  
  // State management for lists
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const [exams, setExams] = useState<Exam[]>(initialExams);

  // --- ATTENDANCE TAB STATE ---
  const [attDate, setAttDate] = useState(new Date().toISOString().split("T")[0]);
  const [attStates, setAttStates] = useState<{ [studentId: string]: string }>(() => {
    const states: { [id: string]: string } = {};
    classData.enrollments.forEach((e) => {
      // Find existing attendance for the date
      const record = initialAttendance.find((a) => a.studentId === e.student.id && a.date === attDate);
      states[e.student.id] = record ? record.status : "present";
    });
    return states;
  });

  const handleAttStatusChange = (studentId: string, status: string) => {
    setAttStates({ ...attStates, [studentId]: status });
  };

  const [attLoading, setAttLoading] = useState(false);
  const [attMsg, setAttMsg] = useState("");

  const handleSaveAttendance = async () => {
    setAttLoading(true);
    setAttMsg("");
    try {
      const res = await fetch("/api/teacher/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          classId: classData.id,
          date: attDate,
          records: Object.entries(attStates).map(([studentId, status]) => ({ studentId, status })),
        }),
      });
      if (!res.ok) throw new Error("Failed to save attendance");
      setAttMsg("✓ Attendance saved successfully! AI models recomputing in background.");
      router.refresh();
    } catch {
      setAttMsg("❌ Error saving attendance. Please try again.");
    } finally {
      setAttLoading(false);
    }
  };

  // --- CREATE ASSIGNMENT STATE ---
  const [showNewAsgModal, setShowNewAsgModal] = useState(false);
  const [newAsg, setNewAsg] = useState({ title: "", description: "", maxScore: 100, dueDate: "" });
  const [asgLoading, setAsgLoading] = useState(false);

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    setAsgLoading(true);
    try {
      const res = await fetch("/api/teacher/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classId: classData.id, ...newAsg }),
      });
      if (!res.ok) throw new Error();
      setShowNewAsgModal(false);
      setNewAsg({ title: "", description: "", maxScore: 100, dueDate: "" });
      router.refresh();
      // Reload page logic
      window.location.reload();
    } catch {
      alert("Error creating assignment.");
    } finally {
      setAsgLoading(false);
    }
  };

  // --- GRADE SUBMISSIONS STATE ---
  const [activeAsgGrading, setActiveAsgGrading] = useState<Assignment | null>(null);
  const [gradingScores, setGradingScores] = useState<{ [studentId: string]: number }>({});
  const [gradingFeedbacks, setGradingFeedbacks] = useState<{ [studentId: string]: string }>({});
  const [gradeLoading, setGradeLoading] = useState(false);

  const handleOpenGrading = (asg: Assignment) => {
    setActiveAsgGrading(asg);
    const scores: { [id: string]: number } = {};
    const feedbacks: { [id: string]: string } = {};
    classData.enrollments.forEach((e) => {
      const sub = asg.submissions.find((s) => s.studentId === e.student.id);
      scores[e.student.id] = sub && sub.score !== null ? sub.score : asg.maxScore;
      feedbacks[e.student.id] = sub && sub.feedback !== null ? sub.feedback : "";
    });
    setGradingScores(scores);
    setGradingFeedbacks(feedbacks);
  };

  const handleSaveGrades = async () => {
    if (!activeAsgGrading) return;
    setGradeLoading(true);
    try {
      const res = await fetch("/api/teacher/grades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignmentId: activeAsgGrading.id,
          classId: classData.id,
          grades: Object.entries(gradingScores).map(([studentId, score]) => ({
            studentId,
            score,
            feedback: gradingFeedbacks[studentId],
          })),
        }),
      });
      if (!res.ok) throw new Error();
      setActiveAsgGrading(null);
      router.refresh();
      window.location.reload();
    } catch {
      alert("Error saving grades.");
    } finally {
      setGradeLoading(false);
    }
  };

  // --- CREATE EXAM STATE ---
  const [showNewExamModal, setShowNewExamModal] = useState(false);
  const [newExam, setNewExam] = useState({ title: "", maxMarks: 100, date: "" });
  const [examLoading, setExamLoading] = useState(false);

  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    setExamLoading(true);
    try {
      const res = await fetch("/api/teacher/exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classId: classData.id, ...newExam }),
      });
      if (!res.ok) throw new Error();
      setShowNewExamModal(false);
      setNewExam({ title: "", maxMarks: 100, date: "" });
      router.refresh();
      window.location.reload();
    } catch {
      alert("Error scheduling exam.");
    } finally {
      setExamLoading(false);
    }
  };

  // --- LOG EXAM MARKS STATE ---
  const [activeExamGrading, setActiveExamGrading] = useState<Exam | null>(null);
  const [examScores, setExamScores] = useState<{ [studentId: string]: number }>({});
  const [examGrades, setExamGrades] = useState<{ [studentId: string]: string }>({});
  const [examGradeLoading, setExamGradeLoading] = useState(false);

  const handleOpenExamGrading = (ex: Exam) => {
    setActiveExamGrading(ex);
    const scores: { [id: string]: number } = {};
    const letterGrades: { [id: string]: string } = {};
    classData.enrollments.forEach((e) => {
      const res = ex.examResults.find((r) => r.studentId === e.student.id);
      scores[e.student.id] = res ? res.marks : ex.maxMarks;
      letterGrades[e.student.id] = res ? res.grade : "A";
    });
    setExamScores(scores);
    setExamGrades(letterGrades);
  };

  const handleSaveExamMarks = async () => {
    if (!activeExamGrading) return;
    setExamGradeLoading(true);
    try {
      const res = await fetch("/api/teacher/exam-results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examId: activeExamGrading.id,
          classId: classData.id,
          results: Object.entries(examScores).map(([studentId, marks]) => ({
            studentId,
            marks,
            grade: examGrades[studentId],
          })),
        }),
      });
      if (!res.ok) throw new Error();
      setActiveExamGrading(null);
      router.refresh();
      window.location.reload();
    } catch {
      alert("Error saving exam results.");
    } finally {
      setExamGradeLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Overview header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-xl">
            {classData.course.category}
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-3 tracking-tight">
            {classData.course.title}
          </h1>
          <p className="text-slate-400 text-xs mt-1">Cohort: {classData.name} • {classData.term}</p>
        </div>
      </div>

      {/* Tabs list */}
      <div className="border-b border-slate-900 flex space-x-6 text-xs font-bold uppercase tracking-wider">
        <button
          onClick={() => { setActiveTab("overview"); setActiveAsgGrading(null); setActiveExamGrading(null); }}
          className={`pb-4 border-b-2 transition-all cursor-pointer ${
            activeTab === "overview" ? "border-amber-500 text-white" : "border-transparent text-slate-500 hover:text-slate-300"
          }`}
        >
          Overview & Insights
        </button>
        <button
          onClick={() => { setActiveTab("attendance"); setActiveAsgGrading(null); setActiveExamGrading(null); }}
          className={`pb-4 border-b-2 transition-all cursor-pointer ${
            activeTab === "attendance" ? "border-amber-500 text-white" : "border-transparent text-slate-500 hover:text-slate-300"
          }`}
        >
          Attendance Log
        </button>
        <button
          onClick={() => { setActiveTab("assignments"); setActiveAsgGrading(null); setActiveExamGrading(null); }}
          className={`pb-4 border-b-2 transition-all cursor-pointer ${
            activeTab === "assignments" ? "border-amber-500 text-white" : "border-transparent text-slate-500 hover:text-slate-300"
          }`}
        >
          Assignments
        </button>
        <button
          onClick={() => { setActiveTab("exams"); setActiveAsgGrading(null); setActiveExamGrading(null); }}
          className={`pb-4 border-b-2 transition-all cursor-pointer ${
            activeTab === "exams" ? "border-amber-500 text-white" : "border-transparent text-slate-500 hover:text-slate-300"
          }`}
        >
          Exams & Grades
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Enrolled Students Table */}
          <div className="lg:col-span-2 glass-panel rounded-3xl p-6 border border-slate-900">
            <h2 className="text-sm font-bold text-white mb-6 flex items-center space-x-2">
              <Users className="h-4 w-4 text-amber-500" />
              <span>Enrolled Students ({classData.enrollments.length})</span>
            </h2>

            <div className="overflow-x-auto w-full">
              <table className="w-full text-left text-xs text-slate-300">
                <thead>
                  <tr className="border-b border-slate-800 text-[10px] uppercase tracking-wider text-slate-500">
                    <th className="pb-3 pr-4 font-bold">Student Name</th>
                    <th className="pb-3 px-4 font-bold">Email</th>
                    <th className="pb-3 pl-4 font-bold text-right">AI Risk Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {classData.enrollments.map((enroll) => {
                    const studentRisk = initialRiskInsights.find((r) => r.studentId === enroll.student.id);
                    const score = studentRisk ? studentRisk.score : 0;
                    const level = studentRisk ? studentRisk.level : "Low";

                    return (
                      <tr key={enroll.student.id} className="hover:bg-slate-950/20">
                        <td className="py-4 pr-4 font-semibold text-slate-200">
                          {enroll.student.name}
                        </td>
                        <td className="py-4 px-4 text-slate-500">
                          {enroll.student.email}
                        </td>
                        <td className="py-4 pl-4 text-right">
                          <span className={`inline-flex px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${
                            level === "High" 
                              ? "bg-red-500/10 text-red-400 border border-red-500/20" 
                              : level === "Medium"
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          }`}>
                            {score} Risk
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Insights & Weather report */}
          <div className="glass-panel rounded-3xl p-6 border border-amber-500/20 ai-glow relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 bg-amber-500/10 rounded-bl-3xl border-l border-b border-amber-500/20">
              <BrainCircuit className="h-4 w-4 text-amber-500" />
            </div>

            <h2 className="text-sm font-bold text-white mb-6 flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span>AI Class Weather</span>
            </h2>

            <div className="text-slate-400 text-xs leading-relaxed space-y-4">
              {weatherSummary.split("\n\n").map((para, pIdx) => {
                if (para.startsWith("###")) {
                  return (
                    <h3 key={pIdx} className="font-bold text-white mt-4 mb-2 text-xs uppercase tracking-wider">
                      {para.replace("###", "").trim()}
                    </h3>
                  );
                }
                return (
                  <p key={pIdx} className="mb-3 text-[11px] leading-relaxed">
                    {para.split("\n").map((line, lIdx) => {
                      if (line.startsWith("*") || line.startsWith("-")) {
                        return (
                          <span key={lIdx} className="block mt-1 pl-2">
                            • {line.replace(/^[*\-]\s+/, "")}
                          </span>
                        );
                      }
                      return line;
                    })}
                  </p>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Attendance Panel */}
      {activeTab === "attendance" && (
        <div className="glass-panel rounded-3xl p-6 border border-slate-900 max-w-3xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-indigo-400" />
                <span>Mark Student Attendance</span>
              </h2>
              <p className="text-[10px] text-slate-500 mt-1">Select date and log presence statuses.</p>
            </div>

            <input
              type="date"
              value={attDate}
              onChange={(e) => setAttDate(e.target.value)}
              className="glass-input rounded-xl py-2 px-3 text-xs"
            />
          </div>

          {attMsg && (
            <div className={`p-3 text-xs rounded-xl mb-4 border ${
              attMsg.includes("Error") ? "bg-red-500/10 border-red-500/30 text-red-400" : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
            }`}>
              {attMsg}
            </div>
          )}

          <div className="divide-y divide-slate-800/50 mb-6">
            {classData.enrollments.map((enroll) => (
              <div key={enroll.student.id} className="py-3 flex items-center justify-between gap-4">
                <span className="text-xs font-semibold text-slate-200">{enroll.student.name}</span>
                
                <div className="flex items-center space-x-1.5 text-[9px] font-bold uppercase tracking-wider">
                  <button
                    onClick={() => handleAttStatusChange(enroll.student.id, "present")}
                    className={`px-3 py-1.5 rounded-lg border ${
                      attStates[enroll.student.id] === "present"
                        ? "bg-emerald-600/10 border-emerald-500 text-emerald-400"
                        : "bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    Present
                  </button>
                  <button
                    onClick={() => handleAttStatusChange(enroll.student.id, "absent")}
                    className={`px-3 py-1.5 rounded-lg border ${
                      attStates[enroll.student.id] === "absent"
                        ? "bg-red-600/10 border-red-500 text-red-400"
                        : "bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    Absent
                  </button>
                  <button
                    onClick={() => handleAttStatusChange(enroll.student.id, "late")}
                    className={`px-3 py-1.5 rounded-lg border ${
                      attStates[enroll.student.id] === "late"
                        ? "bg-amber-600/10 border-amber-500 text-amber-400"
                        : "bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    Late
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleSaveAttendance}
            disabled={attLoading}
            className="bg-amber-600 hover:bg-amber-500 disabled:bg-amber-600/50 text-white font-semibold text-xs py-3 px-6 rounded-xl transition-all uppercase tracking-wider cursor-pointer"
          >
            {attLoading ? "Saving..." : "Save Attendance Logs"}
          </button>
        </div>
      )}

      {/* Assignments Panel */}
      {activeTab === "assignments" && (
        <div className="space-y-6">
          {activeAsgGrading ? (
            /* Grade Submissions Workspace */
            <div className="glass-panel rounded-3xl p-6 border border-slate-900 max-w-4xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-sm font-bold text-white">Grade Assignment</h2>
                  <p className="text-[10px] text-slate-500 mt-1">{activeAsgGrading.title} (Max: {activeAsgGrading.maxScore})</p>
                </div>
                <button
                  onClick={() => setActiveAsgGrading(null)}
                  className="text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
                >
                  ← Back to List
                </button>
              </div>

              <div className="divide-y divide-slate-800/50 max-h-96 overflow-y-auto pr-2 space-y-4">
                {classData.enrollments.map((enroll) => (
                  <div key={enroll.student.id} className="py-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <div>
                      <p className="text-xs font-bold text-slate-200">{enroll.student.name}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-[9px] text-slate-500">Status: Submitted</span>
                        <button
                          type="button"
                          onClick={async () => {
                            try {
                              const res = await fetch("/api/teacher/ai-grade", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  studentId: enroll.student.id,
                                  assignmentId: activeAsgGrading.id,
                                }),
                              });
                              if (!res.ok) throw new Error();
                              const data = await res.json();
                              setGradingScores((prev) => ({ ...prev, [enroll.student.id]: data.score }));
                              setGradingFeedbacks((prev) => ({ ...prev, [enroll.student.id]: data.feedback }));
                            } catch {
                              alert("Error fetching AI grade assist");
                            }
                          }}
                          className="text-[9px] font-black text-amber-500 hover:text-amber-400 uppercase tracking-wider flex items-center space-x-0.5 cursor-pointer bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded"
                        >
                          <span>⚡ AI Assist</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] text-slate-400 shrink-0">Score:</span>
                      <input
                        type="number"
                        min="0"
                        max={activeAsgGrading.maxScore}
                        value={gradingScores[enroll.student.id] || 0}
                        onChange={(e) => setGradingScores({ ...gradingScores, [enroll.student.id]: parseFloat(e.target.value) || 0 })}
                        className="w-20 glass-input rounded-lg py-2 px-3 text-xs"
                      />
                      <span className="text-[10px] text-slate-500">/ {activeAsgGrading.maxScore}</span>
                    </div>

                    <input
                      type="text"
                      placeholder="Enter feedback notes..."
                      value={gradingFeedbacks[enroll.student.id] || ""}
                      onChange={(e) => setGradingFeedbacks({ ...gradingFeedbacks, [enroll.student.id]: e.target.value })}
                      className="w-full glass-input rounded-lg py-2 px-3 text-xs"
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={handleSaveGrades}
                disabled={gradeLoading}
                className="bg-amber-600 hover:bg-amber-500 disabled:bg-amber-600/50 text-white font-semibold text-xs py-3 px-6 rounded-xl transition-all uppercase tracking-wider cursor-pointer"
              >
                {gradeLoading ? "Saving Grades..." : "Commit Grades"}
              </button>
            </div>
          ) : (
            /* Assignment Listing & Create options */
            <div className="glass-panel rounded-3xl p-6 border border-slate-900 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-white">Class Homework Listings</h2>
                  <p className="text-[10px] text-slate-500">Create, view, and grade syllabus homeworks.</p>
                </div>
                <button
                  onClick={() => setShowNewAsgModal(true)}
                  className="flex items-center space-x-1 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-[10px] uppercase tracking-wider py-2.5 px-4 rounded-xl cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Create Assignment</span>
                </button>
              </div>

              {/* Assignment Table */}
              {assignments.length === 0 ? (
                <p className="text-slate-500 text-xs py-4 text-center">No assignments created yet.</p>
              ) : (
                <div className="space-y-4">
                  {assignments.map((asg) => (
                    <div key={asg.id} className="p-4 bg-slate-950/40 rounded-2xl border border-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-white text-xs">{asg.title}</h3>
                        <p className="text-[10px] text-slate-500 mt-1">{asg.description}</p>
                        <div className="flex items-center space-x-4 mt-3 text-[9px] text-slate-400">
                          <span>Max score: {asg.maxScore}</span>
                          <span>Due: {new Date(asg.dueDate).toLocaleDateString()}</span>
                          <span>Submissions: {asg.submissions.length} / {classData.enrollments.length}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleOpenGrading(asg)}
                        className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-wider flex items-center space-x-0.5 cursor-pointer"
                      >
                        <span>Grade Submissions</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Create Assignment Modal */}
              {showNewAsgModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4">
                  <form onSubmit={handleCreateAssignment} className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 text-xs">
                    <h3 className="text-base font-bold text-white">Create New Assignment</h3>
                    
                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-300">Title</label>
                      <input
                        type="text"
                        required
                        value={newAsg.title}
                        onChange={(e) => setNewAsg({ ...newAsg, title: e.target.value })}
                        className="w-full glass-input rounded-xl py-3 px-4 text-xs font-medium"
                        placeholder="Homework 3: Binary Search Trees"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-300">Description</label>
                      <textarea
                        required
                        rows={3}
                        value={newAsg.description}
                        onChange={(e) => setNewAsg({ ...newAsg, description: e.target.value })}
                        className="w-full glass-input rounded-xl py-3 px-4 text-xs font-medium leading-relaxed"
                        placeholder="Explain algorithmic balance factors and implement rotate options..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="font-semibold text-slate-300">Max Score</label>
                        <input
                          type="number"
                          required
                          value={newAsg.maxScore}
                          onChange={(e) => setNewAsg({ ...newAsg, maxScore: parseFloat(e.target.value) || 0 })}
                          className="w-full glass-input rounded-xl py-3 px-4 text-xs font-medium"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-semibold text-slate-300">Due Date</label>
                        <input
                          type="datetime-local"
                          required
                          value={newAsg.dueDate}
                          onChange={(e) => setNewAsg({ ...newAsg, dueDate: e.target.value })}
                          className="w-full glass-input rounded-xl py-3 px-4 text-xs font-medium text-slate-400"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end space-x-3 pt-4 font-bold uppercase tracking-wider text-[10px]">
                      <button
                        type="button"
                        onClick={() => setShowNewAsgModal(false)}
                        className="px-4 py-2 text-slate-400 hover:text-white cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={asgLoading}
                        className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white px-5 py-2.5 rounded-xl cursor-pointer"
                      >
                        {asgLoading ? "Creating..." : "Save Assignment"}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Exams & Grades Panel */}
      {activeTab === "exams" && (
        <div className="space-y-6">
          {activeExamGrading ? (
            /* Enter Exam Marks Workspace */
            <div className="glass-panel rounded-3xl p-6 border border-slate-900 max-w-4xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-sm font-bold text-white">Log Exam Results</h2>
                  <p className="text-[10px] text-slate-500 mt-1">{activeExamGrading.title} (Max: {activeExamGrading.maxMarks})</p>
                </div>
                <button
                  onClick={() => setActiveExamGrading(null)}
                  className="text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
                >
                  ← Back to List
                </button>
              </div>

              <div className="divide-y divide-slate-800/50 max-h-96 overflow-y-auto pr-2 space-y-4">
                {classData.enrollments.map((enroll) => (
                  <div key={enroll.student.id} className="py-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <div>
                      <p className="text-xs font-bold text-slate-200">{enroll.student.name}</p>
                      <p className="text-[10px] text-slate-500">Student Profile</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] text-slate-400 shrink-0">Marks:</span>
                      <input
                        type="number"
                        min="0"
                        max={activeExamGrading.maxMarks}
                        value={examScores[enroll.student.id] || 0}
                        onChange={(e) => setExamScores({ ...examScores, [enroll.student.id]: parseFloat(e.target.value) || 0 })}
                        className="w-20 glass-input rounded-lg py-2 px-3 text-xs"
                      />
                      <span className="text-[10px] text-slate-500">/ {activeExamGrading.maxMarks}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] text-slate-400 shrink-0">Letter Grade:</span>
                      <select
                        value={examGrades[enroll.student.id] || "A"}
                        onChange={(e) => setExamGrades({ ...examGrades, [enroll.student.id]: e.target.value })}
                        className="glass-input rounded-lg py-2 px-3 text-xs"
                      >
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                        <option value="F">F</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleSaveExamMarks}
                disabled={examGradeLoading}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white font-semibold text-xs py-3 px-6 rounded-xl transition-all uppercase tracking-wider cursor-pointer"
              >
                {examGradeLoading ? "Saving Marks..." : "Commit Results"}
              </button>
            </div>
          ) : (
            /* Exam Listing & Schedule Options */
            <div className="glass-panel rounded-3xl p-6 border border-slate-900 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-white">Scheduled Exam Listings</h2>
                  <p className="text-[10px] text-slate-500">Schedule midterm/endterm tests and enter letter grades.</p>
                </div>
                <button
                  onClick={() => setShowNewExamModal(true)}
                  className="flex items-center space-x-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-[10px] uppercase tracking-wider py-2.5 px-4 rounded-xl cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Schedule Test</span>
                </button>
              </div>

              {/* Exam Table */}
              {exams.length === 0 ? (
                <p className="text-slate-500 text-xs py-4 text-center">No exams scheduled yet.</p>
              ) : (
                <div className="space-y-4">
                  {exams.map((ex) => (
                    <div key={ex.id} className="p-4 bg-slate-950/40 rounded-2xl border border-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-white text-xs">{ex.title}</h3>
                        <div className="flex items-center space-x-4 mt-3 text-[9px] text-slate-400">
                          <span>Max Marks: {ex.maxMarks}</span>
                          <span>Date: {new Date(ex.date).toLocaleDateString()}</span>
                          <span>Results logged: {ex.examResults.length} / {classData.enrollments.length}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleOpenExamGrading(ex)}
                        className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-wider flex items-center space-x-0.5 cursor-pointer"
                      >
                        <span>Log Results</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Schedule Exam Modal */}
              {showNewExamModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4">
                  <form onSubmit={handleCreateExam} className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 text-xs">
                    <h3 className="text-base font-bold text-white">Schedule Class Test</h3>
                    
                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-300">Test Title</label>
                      <input
                        type="text"
                        required
                        value={newExam.title}
                        onChange={(e) => setNewExam({ ...newExam, title: e.target.value })}
                        className="w-full glass-input rounded-xl py-3 px-4 text-xs font-medium"
                        placeholder="Theoretical Endterm Exam"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="font-semibold text-slate-300">Max Marks</label>
                        <input
                          type="number"
                          required
                          value={newExam.maxMarks}
                          onChange={(e) => setNewExam({ ...newExam, maxMarks: parseFloat(e.target.value) || 0 })}
                          className="w-full glass-input rounded-xl py-3 px-4 text-xs font-medium"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-semibold text-slate-300">Date & Time</label>
                        <input
                          type="datetime-local"
                          required
                          value={newExam.date}
                          onChange={(e) => setNewExam({ ...newExam, date: e.target.value })}
                          className="w-full glass-input rounded-xl py-3 px-4 text-xs font-medium text-slate-400"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end space-x-3 pt-4 font-bold uppercase tracking-wider text-[10px]">
                      <button
                        type="button"
                        onClick={() => setShowNewExamModal(false)}
                        className="px-4 py-2 text-slate-400 hover:text-white cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={examLoading}
                        className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white px-5 py-2.5 rounded-xl cursor-pointer"
                      >
                        {examLoading ? "Scheduling..." : "Schedule Test"}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
