"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend
} from "recharts";
import {
  TrendingUp,
  Award,
  Calendar,
  CheckSquare,
  FileText,
  Printer,
  Share2,
  AlertTriangle,
  CheckCircle2,
  Activity,
  ChevronDown,
  Sparkles,
  User,
  Users,
  Compass,
  ArrowUpRight,
  ShieldAlert,
  Flame,
  PieChart
} from "lucide-react";
import PrintReportButton from "@/components/PrintReportButton";

interface DeviationPoint {
  subject: string;
  average: number;
  deviation: number;
}

interface SubmissionItem {
  id: string;
  assignment: {
    title: string;
    maxScore: number;
    class: {
      course: {
        title: string;
      };
    };
  };
  score: number | null;
  feedback: string | null;
}

interface WorkspaceProps {
  user: {
    name: string;
    email: string;
  };
  gradeHistory: { name: string; score: number }[];
  deviations: DeviationPoint[];
  recommendations: string;
  recentSubmissions: SubmissionItem[];
}

export default function StudentProgressWorkspace({
  user,
  gradeHistory,
  deviations,
  recommendations,
  recentSubmissions
}: WorkspaceProps) {
  const [selectedSemester, setSelectedSemester] = useState("Fall 2026");
  const [parentMode, setParentMode] = useState(false);
  const [comparePrevious, setComparePrevious] = useState(false);
  const [actionChecked, setActionChecked] = useState<{ [key: string]: boolean }>({
    "mock-1": false,
    "avl-1": true,
    "tutoring-1": false
  });

  // Handle Action Checkbox Click
  const toggleAction = (id: string) => {
    setActionChecked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Mock Semester Data Sets for live demo responsiveness
  const semesterDataMap: { [key: string]: any } = {
    "Fall 2026": {
      cgpa: 8.84,
      gpa: 8.92,
      gpaDiff: "+0.12",
      classRank: "7th / 45",
      percentile: "85th",
      credits: 64,
      streak: 5,
      attendance: 92,
      backlogs: 0,
      confidence: 88,
      readiness: "High",
      gradeHistory: gradeHistory.map((g, i) => ({
        ...g,
        classAvg: [72, 75, 71, 78, 76][i % 5] || 74
      })),
      deviations: deviations,
      attendanceTrend: [
        { week: "W1", rate: 100 },
        { week: "W2", rate: 95 },
        { week: "W3", rate: 92 },
        { week: "W4", rate: 95 },
        { week: "W5", rate: 90 },
        { week: "W6", rate: 88 },
        { week: "W7", rate: 92 },
        { week: "W8", rate: 92 }
      ],
      topics: [
        { name: "Algorithms", status: "Strong", score: 92 },
        { name: "Electromagnetism", status: "Strong", score: 88 },
        { name: "Database Systems", status: "Moderate", score: 75 },
        { name: "Classical Mechanics", status: "Weak", score: 58 }
      ],
      subjectAttendance: [
        { name: "Data Structures & Alg.", rate: 94, status: "Safe" },
        { name: "DBMS Lecture", rate: 88, status: "Safe" },
        { name: "Advanced Classical Mechanics", rate: 74, status: "Warning" }
      ],
      upcomingDeadlines: [
        { id: "d1", title: "DSA Lab AVL Redesign", course: "DSA", due: "In 2 hours", level: "urgent" },
        { id: "d2", title: "Mechanics Homework 4", course: "Physics", due: "Tomorrow, 5 PM", level: "warning" },
        { id: "d3", title: "DBMS SQL Script", course: "DBMS", due: "In 3 days", level: "info" }
      ]
    },
    "Spring 2026": {
      cgpa: 8.72,
      gpa: 8.80,
      gpaDiff: "+0.16",
      classRank: "9th / 45",
      percentile: "80th",
      credits: 48,
      streak: 3,
      attendance: 89,
      backlogs: 0,
      confidence: 82,
      readiness: "High",
      gradeHistory: [
        { name: "Quiz 1", score: 85, classAvg: 70 },
        { name: "Mid-Term", score: 88, classAvg: 73 },
        { name: "Quiz 2", score: 82, classAvg: 71 },
        { name: "Lab Exam", score: 90, classAvg: 80 },
        { name: "Finals", score: 87, classAvg: 75 }
      ],
      deviations: [
        { subject: "Linear Algebra", average: 88, deviation: 3 },
        { subject: "Intro to Python", average: 92, deviation: 7 },
        { subject: "Applied Mechanics", average: 74, deviation: -11 }
      ],
      attendanceTrend: [
        { week: "W1", rate: 95 },
        { week: "W2", rate: 92 },
        { week: "W3", rate: 90 },
        { week: "W4", rate: 88 },
        { week: "W5", rate: 87 },
        { week: "W6", rate: 89 },
        { week: "W7", rate: 89 },
        { week: "W8", rate: 89 }
      ],
      topics: [
        { name: "Linear Algebra", status: "Strong", score: 88 },
        { name: "Python Coding", status: "Strong", score: 92 },
        { name: "Applied Mechanics", status: "Weak", score: 62 },
        { name: "Thermodynamics", status: "Moderate", score: 78 }
      ],
      subjectAttendance: [
        { name: "Linear Algebra", rate: 90, status: "Safe" },
        { name: "Intro to Python", rate: 94, status: "Safe" },
        { name: "Applied Mechanics", rate: 83, status: "Safe" }
      ],
      upcomingDeadlines: []
    },
    "Fall 2025": {
      cgpa: 8.64,
      gpa: 8.64,
      gpaDiff: "Baseline",
      classRank: "12th / 45",
      percentile: "73rd",
      credits: 32,
      streak: 0,
      attendance: 87,
      backlogs: 0,
      confidence: 78,
      readiness: "Moderate",
      gradeHistory: [
        { name: "Assessment 1", score: 80, classAvg: 72 },
        { name: "Exam 1", score: 85, classAvg: 74 },
        { name: "Assessment 2", score: 82, classAvg: 70 },
        { name: "Finals", score: 89, classAvg: 77 }
      ],
      deviations: [
        { subject: "Calculus I", average: 86, deviation: 2 },
        { subject: "Intro to CS", average: 90, deviation: 6 },
        { subject: "Physics Lab", average: 75, deviation: -9 }
      ],
      attendanceTrend: [
        { week: "W1", rate: 90 },
        { week: "W2", rate: 85 },
        { week: "W3", rate: 88 },
        { week: "W4", rate: 87 },
        { week: "W5", rate: 85 },
        { week: "W6", rate: 87 }
      ],
      topics: [
        { name: "Calculus Fundamentals", status: "Strong", score: 86 },
        { name: "Basic OOP Concepts", status: "Strong", score: 90 },
        { name: "Wave Optics Lab", status: "Weak", score: 65 }
      ],
      subjectAttendance: [
        { name: "Calculus I", rate: 88, status: "Safe" },
        { name: "Intro to CS", rate: 90, status: "Safe" },
        { name: "Physics Lab", rate: 83, status: "Safe" }
      ],
      upcomingDeadlines: []
    }
  };

  const activeData = semesterDataMap[selectedSemester] || semesterDataMap["Fall 2026"];

  const tooltipStyle = {
    backgroundColor: "#ffffff",
    borderColor: "#e5e7eb",
    color: "#111827",
    borderRadius: "12px",
    fontSize: "11px",
    fontWeight: "bold",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
  };

  // Mock Calendar Heatmap Grid Days (last 28 days: present/absent/leave)
  const heatmapDays = [
    { day: 1, status: "P" }, { day: 2, status: "P" }, { day: 3, status: "P" }, { day: 4, status: "P" }, { day: 5, status: "A" },
    { day: 6, status: "P" }, { day: 7, status: "P" }, { day: 8, status: "P" }, { day: 9, status: "P" }, { day: 10, status: "L" },
    { day: 11, status: "P" }, { day: 12, status: "P" }, { day: 13, status: "P" }, { day: 14, status: "P" }, { day: 15, status: "P" },
    { day: 16, status: "P" }, { day: 17, status: "P" }, { day: 18, status: "P" }, { day: 19, status: "A" }, { day: 20, status: "P" },
    { day: 21, status: "P" }, { day: 22, status: "P" }, { day: 23, status: "P" }, { day: 24, status: "P" }, { day: 25, status: "P" },
    { day: 26, status: "P" }, { day: 27, status: "L" }, { day: 28, status: "P" }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto print:bg-white print:text-black">
      
      {/* PARENT MODE WARNING BANNER */}
      {parentMode && (
        <div className="bg-[#FCEEF0] border border-dashed border-[#6E1E27] p-4 rounded-2xl flex items-center justify-between animate-pulse">
          <div className="flex items-center space-x-3 text-[#6E1E27]">
            <ShieldAlert className="h-5 w-5 shrink-0" />
            <div>
              <p className="text-xs font-black uppercase tracking-wider">Parent/Advisor Read-Only Secured Mode Active</p>
              <p className="text-[10px] opacity-90 font-semibold">Viewing real-time academic progression reports for student {user.name}. All direct editing is locked.</p>
            </div>
          </div>
          <button 
            onClick={() => setParentMode(false)}
            className="px-3 py-1 bg-[#6E1E27] hover:bg-[#5A171F] text-white text-[9px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer"
          >
            Switch back
          </button>
        </div>
      )}

      {/* 1. HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 print:hidden">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              My Academic Progress Summary
            </h1>
            <span className="px-2 py-0.5 bg-[#FCEEF0] text-[#6E1E27] border border-[#6E1E27]/20 rounded-md text-[8px] font-black uppercase tracking-wider">
              {selectedSemester}
            </span>
          </div>
          <p className="text-slate-500 text-xs mt-1 font-semibold">
            Visualized analytics comparing subject trends, attendance records, and AI-powered studies.
          </p>
        </div>

        {/* Action Controls & Dropdown Selector */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Semester Dropdown */}
          <div className="relative inline-block text-left">
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-xs py-2.5 pl-4 pr-10 border border-slate-200 rounded-xl cursor-pointer focus:outline-none focus:border-[#6E1E27] transition-all appearance-none shadow-xs"
            >
              <option value="Fall 2026">Fall 2026 (Current)</option>
              <option value="Spring 2026">Spring 2026</option>
              <option value="Fall 2025">Fall 2025</option>
            </select>
            <ChevronDown className="absolute right-3 top-3.5 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-2">
            <PrintReportButton />
            
            <button
              onClick={() => {
                if (typeof window !== "undefined") window.print();
              }}
              className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-wider bg-white hover:bg-slate-50 text-slate-700 px-3.5 py-2.5 rounded-xl border border-slate-200 transition-all cursor-pointer shadow-xs"
            >
              <FileText className="h-4 w-4" />
              <span>Export PDF</span>
            </button>

            <button
              onClick={() => {
                setParentMode(true);
                alert("Parent/Mentor read-only toggle active. A secure sharing hash link is simulated.");
              }}
              className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-wider bg-white hover:bg-slate-50 text-slate-700 px-3.5 py-2.5 rounded-xl border border-slate-200 transition-all cursor-pointer shadow-xs"
            >
              <Share2 className="h-4 w-4" />
              <span>Share View</span>
            </button>

            <button
              onClick={() => setComparePrevious(!comparePrevious)}
              className={`flex items-center space-x-2 text-[10px] font-black uppercase tracking-wider px-3.5 py-2.5 rounded-xl border transition-all cursor-pointer shadow-xs ${
                comparePrevious 
                  ? "bg-[#6E1E27] text-white border-[#6E1E27]" 
                  : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
              }`}
            >
              <Activity className="h-4 w-4" />
              <span>Compare Class Avg</span>
            </button>
          </div>
        </div>
      </div>

      {/* Printable Title Block for Hard Copy */}
      <div className="hidden print:block border-b border-black pb-4 mb-6">
        <h1 className="text-3xl font-black">Aether Academy Academic Report</h1>
        <p className="text-sm mt-1 text-slate-700">Student: {user.name} ({user.email})</p>
        <p className="text-sm text-slate-700">Academic Scope: {selectedSemester} Term Performance Analysis</p>
      </div>

      {/* 2. STAT CARDS ROW ("At a Glance") */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* GPA/CGPA */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Term CGPA</span>
          <div className="flex items-baseline space-x-1.5 mt-1.5">
            <span className="text-2xl font-black text-slate-900">{activeData.cgpa}</span>
            <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1 rounded">
              {activeData.gpaDiff}
            </span>
          </div>
          <span className="text-[9px] text-slate-500 font-semibold block mt-1">Term GPA: {activeData.gpa}</span>
        </div>

        {/* Class Rank */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Class Rank</span>
          <span className="text-xl font-black text-slate-900 block mt-1.5">{activeData.classRank}</span>
          <span className="text-[9px] text-slate-500 font-semibold block mt-1">{activeData.percentile} Percentile</span>
        </div>

        {/* Credits Completed */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Credits Completed</span>
          <span className="text-xl font-black text-slate-900 block mt-1.5">{activeData.credits} / 120</span>
          <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden mt-1.5">
            <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${(activeData.credits / 120) * 100}%` }} />
          </div>
        </div>

        {/* Streak indicators */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Submission Streak</span>
          <div className="flex items-center space-x-1.5 mt-1.5">
            <span className="text-xl font-black text-slate-900">{activeData.streak} Days</span>
            <Flame className="h-4 w-4 text-[#6E1E27] shrink-0 fill-[#6E1E27]" />
          </div>
          <span className="text-[9px] text-slate-500 font-semibold block mt-1 font-sans">No missed deadlines</span>
        </div>

        {/* Backlogs / Holds */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs col-span-2 md:col-span-1">
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Holds & Backlogs</span>
          <div className="flex items-center space-x-1.5 mt-1.5">
            <span className="text-xl font-black text-slate-900">
              {activeData.backlogs === 0 ? "Clear" : `${activeData.backlogs} Hold`}
            </span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          </div>
          <span className="text-[9px] text-slate-500 font-semibold block mt-1">Eligible for Exams</span>
        </div>
      </div>

      {/* 3. PERFORMANCE VISUALIZATION CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Score trajectory (Line Chart) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs h-96 flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">Exam Score Trajectory</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">Chronological grade progression against class benchmarks</p>
          </div>

          <div className="flex-grow w-full h-64 mt-4">
            {activeData.gradeHistory.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-500">
                No exam metrics logged.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activeData.gradeHistory} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} fontWeight="bold" />
                  <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={9} fontWeight="bold" />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: "10px", fontWeight: "bold" }} />
                  <Line
                    name="My Score (%)"
                    type="monotone"
                    dataKey="score"
                    stroke="#6E1E27"
                    strokeWidth={3}
                    activeDot={{ r: 6 }}
                    dot={{ r: 4, stroke: "#6E1E27", strokeWidth: 2 }}
                  />
                  {comparePrevious && (
                    <Line
                      name="Class Avg (%)"
                      type="monotone"
                      dataKey="classAvg"
                      stroke="#14b8a6"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      dot={{ r: 3 }}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Subject Performance Deviations (Bar Chart) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs h-96 flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">Performance Deviations</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">Subject averages mapped against overall academic baseline averages</p>
          </div>

          <div className="flex-grow w-full h-64 mt-4">
            {activeData.deviations.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-500">
                Performance aligns perfectly with academic baseline.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activeData.deviations} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="subject" stroke="#94a3b8" fontSize={8} fontWeight="bold" />
                  <YAxis domain={[-35, 35]} stroke="#94a3b8" fontSize={9} fontWeight="bold" />
                  <Tooltip contentStyle={tooltipStyle} />
                  <ReferenceLine y={0} stroke="#94a3b8" strokeWidth={1.5} />
                  <Bar
                    name="Deviation Points"
                    dataKey="deviation"
                    fill="#14b8a6"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={30}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Attendance trend (Line Chart over weeks) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs h-96 flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">Attendance Trajectory</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">Weekly review of course attendance metrics over the semester</p>
          </div>

          <div className="flex-grow w-full h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activeData.attendanceTrend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="week" stroke="#94a3b8" fontSize={9} fontWeight="bold" />
                <YAxis domain={[60, 100]} stroke="#94a3b8" fontSize={9} fontWeight="bold" />
                <Tooltip contentStyle={tooltipStyle} />
                <Line
                  name="Attendance (%)"
                  type="monotone"
                  dataKey="rate"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
                <ReferenceLine y={75} stroke="#ef4444" strokeDasharray="3 3" label={{ value: "75% Limit", fill: "#ef4444", fontSize: 8, position: "top" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Strength / Weakness Heatmap Breakdown */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs h-96 flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">Concept Strength & Weakness Mapping</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">Topic competency ratings mapped by student exam submissions</p>
          </div>

          <div className="flex-grow mt-6 space-y-4">
            {activeData.topics.map((topic: any, index: number) => {
              const statusColor =
                topic.status === "Strong"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : topic.status === "Moderate"
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : "bg-red-50 text-red-700 border-red-200";

              return (
                <div key={index} className="p-3 bg-[#F7F7F9] border border-slate-200 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-extrabold text-slate-800 block">{topic.name}</span>
                    <span className="text-[9px] text-slate-500 font-semibold block mt-0.5 font-sans">Weighted Exam Performance: {topic.score}%</span>
                  </div>
                  
                  <span className={`inline-flex px-2 py-1 border text-[9px] font-black uppercase tracking-wider rounded-lg ${statusColor}`}>
                    {topic.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. AI COACH RECOVERY PLAN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Diagnostics & Readiness Score */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-[#6E1E27]" />
              <h3 className="text-xs font-black text-slate-950 uppercase tracking-wider">Academic Diagnosis</h3>
            </div>
            <p className="text-[9px] text-slate-500 mt-1">Real-time coaching recommendations compiled by LLM heuristics.</p>
          </div>

          {/* Diagnosis metrics */}
          <div className="my-6 space-y-4 flex-grow flex flex-col justify-center">
            <div className="p-3.5 bg-[#F7F7F9] border border-slate-200 rounded-2xl text-center">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block font-sans">Primary Status Indicator</span>
              <span className="text-sm font-black text-[#6E1E27] mt-1 block">Improving (+4.5% vs Midterm)</span>
            </div>

            <div className="p-3.5 bg-[#FCEEF0] border border-[#6E1E27]/20 rounded-2xl text-center">
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block font-sans">Subject Requiring Reviews</span>
              <span className="text-xs font-extrabold text-[#6E1E27] mt-1 block">DBMS & Mechanics</span>
            </div>
          </div>

          {/* Readiness gauge circle */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-4">
            <div>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide block">Predicted Readiness</span>
              <span className="text-xs font-black text-slate-900 mt-0.5 block">{activeData.readiness} Readiness</span>
            </div>
            
            <div className="relative h-12 w-12 shrink-0">
              <svg className="h-full w-full -rotate-90">
                <circle cx="24" cy="24" r="20" fill="transparent" stroke="#f1f5f9" strokeWidth="4" />
                <circle cx="24" cy="24" r="20" fill="transparent" stroke="#6E1E27" strokeWidth="4"
                  strokeDasharray={125.6}
                  strokeDashoffset={125.6 - (125.6 * activeData.confidence) / 100}
                  strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-[#6E1E27]">
                {activeData.confidence}%
              </div>
            </div>
          </div>
        </div>

        {/* Action Checkable items & Study target hours progress bar */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-black text-slate-950 uppercase tracking-wider">AI Coaching Action Recovery Tasks</h3>
            <p className="text-[9px] text-slate-500 mt-1">Check action tasks off as you complete reviews for this semester.</p>
          </div>

          {/* Checklist */}
          <div className="my-6 space-y-3.5 flex-grow">
            <div 
              onClick={() => toggleAction("mock-1")}
              className="flex items-center space-x-3.5 p-3 hover:bg-slate-50/50 rounded-xl border border-slate-100 cursor-pointer transition-all"
            >
              <input 
                type="checkbox" 
                checked={!!actionChecked["mock-1"]} 
                onChange={() => {}} // toggled on container div tap
                className="h-4.5 w-4.5 rounded border-slate-300 text-[#6E1E27] focus:ring-[#6E1E27] cursor-pointer"
              />
              <span className={`text-xs font-semibold ${actionChecked["mock-1"] ? "line-through text-slate-400 font-normal" : "text-slate-800"}`}>
                Complete 2 mock test exams this week (DBMS SQL)
              </span>
            </div>

            <div 
              onClick={() => toggleAction("avl-1")}
              className="flex items-center space-x-3.5 p-3 hover:bg-slate-50/50 rounded-xl border border-slate-100 cursor-pointer transition-all"
            >
              <input 
                type="checkbox" 
                checked={!!actionChecked["avl-1"]} 
                onChange={() => {}} 
                className="h-4.5 w-4.5 rounded border-slate-300 text-[#6E1E27] focus:ring-[#6E1E27] cursor-pointer"
              />
              <span className={`text-xs font-semibold ${actionChecked["avl-1"] ? "line-through text-slate-400 font-normal" : "text-slate-800"}`}>
                Review AVL Tree rotation notes before Thursday labs
              </span>
            </div>

            <div 
              onClick={() => toggleAction("tutoring-1")}
              className="flex items-center space-x-3.5 p-3 hover:bg-slate-50/50 rounded-xl border border-slate-100 cursor-pointer transition-all"
            >
              <input 
                type="checkbox" 
                checked={!!actionChecked["tutoring-1"]} 
                onChange={() => {}} 
                className="h-4.5 w-4.5 rounded border-slate-300 text-[#6E1E27] focus:ring-[#6E1E27] cursor-pointer"
              />
              <span className={`text-xs font-semibold ${actionChecked["tutoring-1"] ? "line-through text-slate-400 font-normal" : "text-slate-800"}`}>
                Attend Classical Mechanics tutoring hour sessions
              </span>
            </div>
          </div>

          {/* Goal tracker progress bar */}
          <div className="border-t border-slate-100 pt-4 space-y-2">
            <div className="flex items-center justify-between text-[9px] font-bold text-slate-500 uppercase tracking-wider">
              <span>Weekly Target Study Hours</span>
              <span>14 / 20 Hours Completed</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-600 rounded-full" style={{ width: "70%" }} />
            </div>
          </div>
        </div>
      </div>

      {/* 5. ADDITIONAL ANALYTICAL SECTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Assignments & Deadlines widget */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-black text-slate-950 uppercase tracking-wider">Assignments & Upcoming Deadlines</h3>
            <p className="text-[9px] text-slate-500 mt-1">Calendar assignments sorted by urgency factors.</p>
          </div>

          <div className="my-6 space-y-3.5 flex-grow">
            {activeData.upcomingDeadlines && activeData.upcomingDeadlines.length > 0 ? (
              activeData.upcomingDeadlines.map((dl: any) => {
                const badgeColor = 
                  dl.level === "urgent" 
                    ? "bg-red-50 text-red-700 border-red-200" 
                    : dl.level === "warning"
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : "bg-slate-50 text-slate-700 border-slate-200";

                return (
                  <div key={dl.id} className="p-3 bg-[#F7F7F9] border border-slate-200 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-xs font-extrabold text-slate-800 block">{dl.title}</span>
                      <span className="text-[9px] text-slate-500 font-semibold block mt-0.5 font-sans">Course Scope: {dl.course}</span>
                    </div>
                    
                    <span className={`inline-flex px-2 py-0.5 border text-[8px] font-black uppercase tracking-wider rounded ${badgeColor}`}>
                      {dl.due}
                    </span>
                  </div>
                );
              })
            ) : (
              <p className="text-slate-500 text-xs text-center py-10 font-semibold font-sans">All submissions completed for this semester!</p>
            )}
          </div>

          <div className="border-t border-slate-100 pt-4 flex items-center justify-between text-[9px] font-bold text-slate-500 uppercase tracking-wider font-sans">
            <span>Overall Assignments</span>
            <span>{recentSubmissions.length} Submitted</span>
          </div>
        </div>

        {/* Detailed Attendance Heatmap & thresholds */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-black text-slate-950 uppercase tracking-wider font-sans">Class Attendance Heatmap</h3>
            <p className="text-[9px] text-slate-500 mt-1">Last 28 lectures (Present = green, Absent = red, Leave = yellow).</p>
          </div>

          {/* Calendar Dots Grid */}
          <div className="my-6 grid grid-cols-7 gap-1.5 justify-center max-w-xs mx-auto">
            {heatmapDays.map((day) => {
              const dotColor = 
                day.status === "P" 
                  ? "bg-emerald-600 border-emerald-700" 
                  : day.status === "A"
                  ? "bg-red-600 border-red-700"
                  : "bg-amber-400 border-amber-500";

              return (
                <div 
                  key={day.day} 
                  title={`Day ${day.day}: ${day.status === "P" ? "Present" : day.status === "A" ? "Absent" : "Leave"}`}
                  className={`h-4.5 w-4.5 rounded-full border ${dotColor} flex items-center justify-center text-[7px] text-white font-extrabold cursor-help`}
                >
                  {day.day}
                </div>
              );
            })}
          </div>

          {/* Subject breakdowns */}
          <div className="border-t border-slate-100 pt-4 space-y-3.5">
            {activeData.subjectAttendance.map((sa: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between text-[10px] font-semibold text-slate-800">
                <span>{sa.name}</span>
                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                  sa.status === "Safe" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700 border border-red-100"
                }`}>
                  {sa.rate}% {sa.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements & Goal Setting */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-black text-slate-950 uppercase tracking-wider font-sans">Achievements & Term Badges</h3>
            <p className="text-[9px] text-slate-500 mt-1">Verified academic accolades and goal metrics.</p>
          </div>

          {/* Badges Grid */}
          <div className="my-6 grid grid-cols-3 gap-2.5 text-center">
            <div className="p-3 bg-[#FCEEF0] border border-[#6E1E27]/10 rounded-xl flex flex-col items-center">
              <Award className="h-6 w-6 text-[#6E1E27] mb-1" />
              <span className="text-[9px] font-black text-[#6E1E27] uppercase tracking-wider font-sans">Bug Hunter</span>
              <span className="text-[7px] text-slate-500 font-bold block mt-0.5">DSA sandbox</span>
            </div>
            
            <div className="p-3 bg-[#F7F7F9] border border-slate-200 rounded-xl flex flex-col items-center">
              <Flame className="h-6 w-6 text-amber-600 mb-1" />
              <span className="text-[9px] font-black text-slate-700 uppercase tracking-wider font-sans">Submission</span>
              <span className="text-[7px] text-slate-500 font-bold block mt-0.5">5 submissions</span>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex flex-col items-center">
              <CheckSquare className="h-6 w-6 text-emerald-600 mb-1" />
              <span className="text-[9px] font-black text-emerald-800 uppercase tracking-wider font-sans">Attendance</span>
              <span className="text-[7px] text-slate-500 font-bold block mt-0.5">92% overall</span>
            </div>
          </div>

          {/* Target GPA Goal set */}
          <div className="border-t border-slate-100 pt-4 space-y-2">
            <div className="flex items-center justify-between text-[9px] font-bold text-slate-500 uppercase tracking-wider font-sans">
              <span>Goal: Target 9.00 CGPA</span>
              <span>8.84 / 9.00 CGPA</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#6E1E27] rounded-full" style={{ width: "95%" }} />
            </div>
          </div>
        </div>
      </div>

      {/* 6. RECENT SUBMISSIONS SCORES TABLE */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs break-inside-avoid print:bg-white print:text-black print:border-black">
        <h2 className="text-sm font-black text-slate-950 mb-6 flex items-center space-x-2 print:text-black uppercase tracking-wide">
          <CheckSquare className="h-5 w-5 text-[#6E1E27]" />
          <span>Recent Submissions & Scores</span>
        </h2>

        {recentSubmissions.length === 0 ? (
          <p className="text-slate-500 text-xs py-4 text-center">No assignments graded yet.</p>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs text-slate-700 print:text-black font-semibold text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400 print:border-black">
                  <th className="pb-3 pr-4 font-bold">Course</th>
                  <th className="pb-3 px-4 font-bold">Assignment</th>
                  <th className="pb-3 px-4 font-bold">Grade</th>
                  <th className="pb-3 pl-4 font-bold">Feedback</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 print:divide-slate-200 text-slate-800">
                {recentSubmissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/50 print:hover:bg-transparent">
                    <td className="py-4 pr-4 font-bold text-slate-900 print:text-black">
                      {sub.assignment.class.course.title}
                    </td>
                    <td className="py-4 px-4 text-slate-600 print:text-black">
                      {sub.assignment.title}
                    </td>
                    <td className="py-4 px-4 font-bold text-emerald-600 print:text-black">
                      {sub.score !== null ? `${sub.score}/${sub.assignment.maxScore}` : "Ungraded"}
                    </td>
                    <td className="py-4 pl-4 text-slate-600 text-[10px] leading-relaxed max-w-xs truncate print:text-black print:max-w-none print:whitespace-normal">
                      {sub.feedback || "Awaiting instructor feedback."}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
