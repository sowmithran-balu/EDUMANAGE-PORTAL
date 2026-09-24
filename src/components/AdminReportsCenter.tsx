"use client";

import { useState } from "react";
import { User, FileText, Printer, Sparkles, BrainCircuit, CheckSquare, Calendar } from "lucide-react";

interface StudentReportData {
  id: string;
  name: string;
  email: string;
  attendanceRate: number;
  completionRate: number;
  riskScore: number;
  riskLevel: string;
  riskFactors: string[];
  recommendations: string;
  narrativeSummary: string;
  courses: { id: string; title: string; instructor: string }[];
  recentGrades: { id: string; title: string; score: number; maxScore: number; feedback: string | null }[];
}

interface ReportsCenterProps {
  students: StudentReportData[];
}

export default function AdminReportsCenter({ students }: ReportsCenterProps) {
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    students.length > 0 ? students[0].id : null
  );

  const activeStudent = students.find((s) => s.id === selectedStudentId);

  const handlePrint = () => {
    if (typeof window !== "undefined") window.print();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {/* Sidebar: Student list (Hidden on print) */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-900 lg:col-span-1 print:hidden">
        <h2 className="text-sm font-bold text-white mb-4 flex items-center space-x-2">
          <UsersListIcon className="h-4 w-4 text-indigo-400" />
          <span>Select Student</span>
        </h2>
        <p className="text-[10px] text-slate-500 mb-6">Click a profile to generate their narrative report.</p>

        <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
          {students.map((student) => (
            <button
              key={student.id}
              onClick={() => setSelectedStudentId(student.id)}
              className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                selectedStudentId === student.id
                  ? "bg-indigo-600/15 border-indigo-500 text-indigo-400 font-bold"
                  : "bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              <div className="flex items-center space-x-3 truncate">
                <div className="h-7 w-7 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700 shrink-0">
                  <User className="h-3.5 w-3.5 text-indigo-400" />
                </div>
                <div className="truncate">
                  <p className="text-xs text-white font-semibold truncate">{student.name}</p>
                  <p className="text-[9px] text-slate-500 truncate">{student.email}</p>
                </div>
              </div>
              <span className={`inline-flex px-1.5 py-0.5 rounded-md text-[8px] font-bold uppercase tracking-wider shrink-0 ${
                student.riskLevel === "High"
                  ? "bg-red-500/10 text-red-400 border border-red-500/20"
                  : student.riskLevel === "Medium"
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              }`}>
                {student.riskScore}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Panel: Report Canvas (Visible on print, sidebar hidden) */}
      <div className="lg:col-span-2 space-y-6">
        {activeStudent ? (
          <div className="glass-panel rounded-3xl p-6 border border-slate-900 relative overflow-hidden print:border-none print:bg-white print:text-black print:p-0">
            {/* Header controls (Hidden on print) */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6 print:hidden">
              <h2 className="text-sm font-bold text-white flex items-center space-x-2">
                <FileText className="h-4 w-4 text-sky-400" />
                <span>Narrative Report Canvas</span>
              </h2>
              <button
                onClick={handlePrint}
                className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-wider bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-3.5 py-2.5 rounded-xl border border-slate-700/50 transition-all cursor-pointer"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Download PDF</span>
              </button>
            </div>

            {/* Canvas body */}
            <div className="space-y-8">
              {/* Report Header block */}
              <div className="border-b border-slate-800/80 pb-6 print:border-black print:text-black">
                <h1 className="text-xl md:text-2xl font-extrabold text-white print:text-black">
                  Academic Performance Narrative
                </h1>
                <p className="text-[10px] text-slate-500 mt-1 print:text-slate-600">
                  Aether Academy Intelligence Office • Report generated for administrative review
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-xs text-slate-400 print:text-black">
                  <div>
                    <p className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Student Name</p>
                    <p className="font-bold text-slate-200 mt-0.5 print:text-black">{activeStudent.name}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Email Address</p>
                    <p className="font-bold text-slate-200 mt-0.5 print:text-black">{activeStudent.email}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Attendance Rate</p>
                    <p className="font-bold text-slate-200 mt-0.5 print:text-black">{activeStudent.attendanceRate}%</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">AI Risk Score</p>
                    <p className="font-bold text-slate-200 mt-0.5 print:text-black">{activeStudent.riskScore}/100</p>
                  </div>
                </div>
              </div>

              {/* Narrative Summary (AI written) */}
              <div className="p-5 bg-indigo-600/5 rounded-2xl border border-indigo-500/25 relative overflow-hidden print:bg-transparent print:border-black print:text-black">
                <div className="absolute top-0 right-0 p-2.5 bg-indigo-500/10 rounded-bl-2xl border-l border-b border-indigo-500/20 print:hidden">
                  <Sparkles className="h-4 w-4 text-indigo-400" />
                </div>
                <h3 className="font-bold text-white text-xs uppercase tracking-wider mb-3 print:text-black">
                  AI Narrative Diagnostic
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-medium print:text-black">
                  {activeStudent.narrativeSummary}
                </p>
              </div>

              {/* Grade metrics table */}
              <div className="space-y-4">
                <h3 className="font-bold text-white text-xs uppercase tracking-wider flex items-center space-x-2 print:text-black">
                  <CheckSquare className="h-4 w-4 text-sky-400" />
                  <span>Recent Graded Submissions</span>
                </h3>

                {activeStudent.recentGrades.length === 0 ? (
                  <p className="text-slate-500 text-[11px] py-2">No assignment grades logged yet.</p>
                ) : (
                  <div className="overflow-x-auto w-full">
                    <table className="w-full text-left text-xs text-slate-400 print:text-black">
                      <thead>
                        <tr className="border-b border-slate-800 text-[9px] uppercase tracking-wider text-slate-500 print:border-black">
                          <th className="pb-2 font-bold">Assignment</th>
                          <th className="pb-2 text-center font-bold">Marks</th>
                          <th className="pb-2 pl-4 font-bold">Teacher Feedback</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/40 print:divide-slate-200">
                        {activeStudent.recentGrades.map((g) => (
                          <tr key={g.id}>
                            <td className="py-3 font-semibold text-slate-300 print:text-black">{g.title}</td>
                            <td className="py-3 text-center font-bold text-indigo-400 print:text-black">
                              {g.score} / {g.maxScore}
                            </td>
                            <td className="py-3 pl-4 text-[10px] text-slate-500 max-w-xs truncate print:text-black print:max-w-none print:whitespace-normal">
                              {g.feedback || "Ungraded / No notes."}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Recovery tips list */}
              <div className="space-y-4 break-inside-avoid">
                <h3 className="font-bold text-white text-xs uppercase tracking-wider flex items-center space-x-2 print:text-black">
                  <BrainCircuit className="h-4 w-4 text-indigo-400" />
                  <span>Recommended Study Action Items</span>
                </h3>

                <div className="prose prose-invert prose-xs text-slate-400 max-w-none print:text-black">
                  {activeStudent.recommendations.split("\n\n").map((para, pIdx) => {
                    if (para.startsWith("###")) {
                      return (
                        <h4 key={pIdx} className="font-bold text-white mt-4 mb-1 text-[11px] uppercase tracking-wider print:text-black">
                          {para.replace("###", "").trim()}
                        </h4>
                      );
                    }
                    return (
                      <p key={pIdx} className="mb-2 text-[11px] leading-relaxed">
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
          </div>
        ) : (
          <div className="glass-panel rounded-3xl p-16 text-center border border-slate-900 text-slate-500 text-xs">
            Please register and seed students to unlock report generation features.
          </div>
        )}
      </div>
    </div>
  );
}

// Icon helper
function UsersListIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
