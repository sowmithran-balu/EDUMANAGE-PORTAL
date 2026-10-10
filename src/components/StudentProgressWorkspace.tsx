"use client";

import { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
  Cell
} from "recharts";
import {
  TrendingUp,
  Award,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  FileText,
  Printer,
  Share2,
  SlidersHorizontal,
  Flame,
  ShieldCheck,
  BookOpen,
  GraduationCap,
  Clock,
  Sparkles,
  Check,
  Copy,
  Search,
  ChevronDown,
  Layers,
  BarChart3,
  HelpCircle,
  ArrowRight,
  ExternalLink
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
  const [activeTab, setActiveTab] = useState<"overview" | "academics" | "attendance" | "ai_advisory" | "ledger">("overview");
  const [showBenchmark, setShowBenchmark] = useState(true);
  const [showSimulator, setShowSimulator] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [searchLedger, setSearchLedger] = useState("");

  // Target GPA Simulator state
  const [projectedFinalScore, setProjectedFinalScore] = useState(92);
  const [projectedMechanicsScore, setProjectedMechanicsScore] = useState(86);

  // Action checklist items
  const [tasks, setTasks] = useState<{ [id: string]: boolean }>({
    "task-1": true,
    "task-2": false,
    "task-3": false,
    "task-4": true,
    "task-5": false
  });

  const toggleTask = (id: string) => {
    setTasks(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const completedTasks = Object.values(tasks).filter(Boolean).length;
  const totalTasks = Object.keys(tasks).length;

  // Real-time simulated CGPA computation
  const simulatedCGPA = useMemo(() => {
    const base = 8.84;
    const finalDelta = (projectedFinalScore - 85) * 0.007;
    const mechDelta = (projectedMechanicsScore - 74) * 0.005;
    const val = Math.min(10.0, Math.max(7.0, base + finalDelta + mechDelta));
    return val.toFixed(2);
  }, [projectedFinalScore, projectedMechanicsScore]);

  // Semester dataset definitions
  const datasetMap: { [key: string]: any } = {
    "Fall 2026": {
      termName: "Fall 2026",
      termBadge: "Current Semester • Term 5",
      standing: "Dean's List Distinction",
      standingSubtitle: "Top 15% Academic Standing",
      cgpa: 8.84,
      termGpa: 8.92,
      cgpaDelta: "+0.12",
      classRank: 7,
      cohortSize: 45,
      percentile: "85th",
      cohortMeanGpa: 7.42,
      creditsEarned: 64,
      creditsRequired: 120,
      streakDays: 5,
      onTimeRate: 100,
      backlogs: 0,
      holds: 0,
      attendanceRate: 92,
      examTrajectory: [
        { name: "Diag. Baseline", score: 82, cohortAvg: 70, target: 85, date: "Aug 24" },
        { name: "Quiz 1 (DSA)", score: 88, cohortAvg: 72, target: 85, date: "Sep 08" },
        { name: "Midterm Exam 1", score: gradeHistory[0]?.score || 91, cohortAvg: 74, target: 88, date: "Sep 22" },
        { name: "Lab Practicum", score: 94, cohortAvg: 76, target: 90, date: "Oct 05" },
        { name: "Midterm Exam 2", score: gradeHistory[1]?.score || 93, cohortAvg: 75, target: 90, date: "Oct 19" },
        { name: "Capstone Draft", score: 89, cohortAvg: 73, target: 90, date: "Nov 02" },
        { name: "Projected Finals", score: 95, cohortAvg: 78, target: 92, date: "Dec 12" }
      ],
      deviations: deviations.length >= 4 ? deviations : [
        { subject: "Data Structures & Alg.", average: 92, deviation: 9, grade: "A+" },
        { subject: "Database Management", average: 88, deviation: 5, grade: "A" },
        { subject: "Business Statistics", average: 86, deviation: 3, grade: "A" },
        { subject: "Discrete Mathematics", average: 84, deviation: 1, grade: "B+" },
        { subject: "Electromagnetic Theory", average: 89, deviation: 6, grade: "A" },
        { subject: "Advanced Classical Mechanics", average: 74, deviation: -9, grade: "B" }
      ],
      attendanceTrend: [
        { week: "W1", studentRate: 100, cohortRate: 94 },
        { week: "W2", studentRate: 96, cohortRate: 92 },
        { week: "W3", studentRate: 92, cohortRate: 89 },
        { week: "W4", studentRate: 95, cohortRate: 88 },
        { week: "W5", studentRate: 90, cohortRate: 86 },
        { week: "W6", studentRate: 89, cohortRate: 85 },
        { week: "W7", studentRate: 94, cohortRate: 84 },
        { week: "W8", studentRate: 92, cohortRate: 83 },
        { week: "W9", studentRate: 95, cohortRate: 85 },
        { week: "W10", studentRate: 93, cohortRate: 84 }
      ],
      subjectAttendance: [
        { name: "Data Structures & Alg.", attended: 23, total: 24, rate: 96, status: "Safe" },
        { name: "Database Systems", attended: 20, total: 22, rate: 91, status: "Safe" },
        { name: "Business Analytics", attended: 15, total: 17, rate: 88, status: "Safe" },
        { name: "Classical Mechanics", attended: 16, total: 21, rate: 76, status: "Attention Required" }
      ],
      competencies: [
        { name: "Graph Algorithms & Tree Traversals", domain: "Computer Science", mastery: 95, tier: "Mastery" },
        { name: "Relational Normalization & SQL Queries", domain: "Database Systems", mastery: 91, tier: "Mastery" },
        { name: "Statistical Hypothesis & Regression", domain: "Applied Mathematics", mastery: 86, tier: "Proficient" },
        { name: "Maxwell Equations & Field Potentials", domain: "Physics", mastery: 84, tier: "Proficient" },
        { name: "Lagrangian Mechanics & Rotational Torque", domain: "Physics", mastery: 62, tier: "Needs Review" }
      ],
      upcomingDeadlines: [
        { id: "1", title: "AVL & Red-Black Tree Implementation", course: "Data Structures", due: "Today, 11:59 PM", weight: "15%", urgent: true },
        { id: "2", title: "Rigid Body Dynamics Problem Set #5", course: "Classical Mechanics", due: "Tomorrow, 5:00 PM", weight: "10%", urgent: false },
        { id: "3", title: "SQL Index Optimization Audit Paper", course: "Database Systems", due: "In 3 days", weight: "20%", urgent: false }
      ]
    },
    "Spring 2026": {
      termName: "Spring 2026",
      termBadge: "Prior Semester • Term 4",
      standing: "Dean's List Distinction",
      standingSubtitle: "Top 20% Academic Standing",
      cgpa: 8.72,
      termGpa: 8.80,
      cgpaDelta: "+0.16",
      classRank: 9,
      cohortSize: 45,
      percentile: "80th",
      cohortMeanGpa: 7.35,
      creditsEarned: 48,
      creditsRequired: 120,
      streakDays: 3,
      onTimeRate: 100,
      backlogs: 0,
      holds: 0,
      attendanceRate: 89,
      examTrajectory: [
        { name: "Quiz 1", score: 85, cohortAvg: 70, target: 85, date: "Jan 20" },
        { name: "Midterm 1", score: 88, cohortAvg: 73, target: 85, date: "Feb 18" },
        { name: "Quiz 2", score: 82, cohortAvg: 71, target: 85, date: "Mar 10" },
        { name: "Lab Exam", score: 90, cohortAvg: 80, target: 90, date: "Apr 02" },
        { name: "Finals", score: 87, cohortAvg: 75, target: 90, date: "May 15" }
      ],
      deviations: [
        { subject: "Linear Algebra", average: 88, deviation: 6, grade: "A" },
        { subject: "Intro to Python & C++", average: 92, deviation: 10, grade: "A+" },
        { subject: "Applied Mechanics", average: 74, deviation: -8, grade: "B" },
        { subject: "Digital Logic Design", average: 85, deviation: 3, grade: "A" }
      ],
      attendanceTrend: [
        { week: "W1", studentRate: 95, cohortRate: 91 },
        { week: "W2", studentRate: 92, cohortRate: 89 },
        { week: "W3", studentRate: 90, cohortRate: 88 },
        { week: "W4", studentRate: 88, cohortRate: 86 },
        { week: "W5", studentRate: 87, cohortRate: 85 },
        { week: "W6", studentRate: 89, cohortRate: 84 },
        { week: "W7", studentRate: 89, cohortRate: 83 },
        { week: "W8", studentRate: 89, cohortRate: 82 }
      ],
      subjectAttendance: [
        { name: "Linear Algebra", attended: 18, total: 20, rate: 90, status: "Safe" },
        { name: "Intro to Python", attended: 23, total: 24, rate: 96, status: "Safe" },
        { name: "Applied Mechanics", attended: 18, total: 22, rate: 82, status: "Safe" }
      ],
      competencies: [
        { name: "Eigenvalues & Transformations", domain: "Mathematics", mastery: 90, tier: "Mastery" },
        { name: "Python OOP Architecture", domain: "Computer Science", mastery: 93, tier: "Mastery" },
        { name: "Applied Vector Mechanics", domain: "Physics", mastery: 68, tier: "Needs Review" }
      ],
      upcomingDeadlines: []
    },
    "Fall 2025": {
      termName: "Fall 2025",
      termBadge: "Prior Semester • Term 3",
      standing: "First Class Standing",
      standingSubtitle: "Top 26% Academic Standing",
      cgpa: 8.64,
      termGpa: 8.64,
      cgpaDelta: "Baseline",
      classRank: 12,
      cohortSize: 45,
      percentile: "74th",
      cohortMeanGpa: 7.28,
      creditsEarned: 32,
      creditsRequired: 120,
      streakDays: 0,
      onTimeRate: 100,
      backlogs: 0,
      holds: 0,
      attendanceRate: 87,
      examTrajectory: [
        { name: "Assessment 1", score: 80, cohortAvg: 72, target: 80, date: "Sep 15" },
        { name: "Exam 1", score: 85, cohortAvg: 74, target: 82, date: "Oct 12" },
        { name: "Assessment 2", score: 82, cohortAvg: 70, target: 82, date: "Nov 04" },
        { name: "Finals", score: 89, cohortAvg: 77, target: 85, date: "Dec 18" }
      ],
      deviations: [
        { subject: "Calculus I", average: 86, deviation: 5, grade: "A" },
        { subject: "Intro to CS", average: 90, deviation: 9, grade: "A+" },
        { subject: "Physics Practicum I", average: 75, deviation: -6, grade: "B" }
      ],
      attendanceTrend: [
        { week: "W1", studentRate: 92, cohortRate: 90 },
        { week: "W2", studentRate: 86, cohortRate: 88 },
        { week: "W3", studentRate: 88, cohortRate: 85 },
        { week: "W4", studentRate: 87, cohortRate: 84 },
        { week: "W5", studentRate: 85, cohortRate: 83 },
        { week: "W6", studentRate: 87, cohortRate: 82 }
      ],
      subjectAttendance: [
        { name: "Calculus I", attended: 19, total: 22, rate: 86, status: "Safe" },
        { name: "Intro to CS", attended: 18, total: 20, rate: 90, status: "Safe" },
        { name: "Physics Lab", attended: 15, total: 18, rate: 83, status: "Safe" }
      ],
      competencies: [
        { name: "Calculus Fundamentals", domain: "Mathematics", mastery: 86, tier: "Proficient" },
        { name: "Basic Computer Architecture", domain: "Computer Science", mastery: 90, tier: "Mastery" }
      ],
      upcomingDeadlines: []
    }
  };

  const active = datasetMap[selectedSemester] || datasetMap["Fall 2026"];

  // Filtered submissions for the official ledger table
  const filteredSubmissions = useMemo(() => {
    if (!searchLedger.trim()) return recentSubmissions;
    return recentSubmissions.filter(s =>
      s.assignment.title.toLowerCase().includes(searchLedger.toLowerCase()) ||
      s.assignment.class.course.title.toLowerCase().includes(searchLedger.toLowerCase())
    );
  }, [recentSubmissions, searchLedger]);

  // Clean Tooltip for Line/Area Charts
  const ChartTooltip = ({ active: isTooltipActive, payload, label }: any) => {
    if (isTooltipActive && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-lg border border-slate-800 text-xs min-w-[190px]">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2 font-medium">
            <span className="text-slate-300">{label}</span>
            <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">Verified</span>
          </div>
          <div className="space-y-1.5 font-medium">
            {payload.map((item: any, i: number) => (
              <div key={i} className="flex justify-between items-center">
                <span className="flex items-center space-x-1.5 text-slate-400">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span>{item.name}:</span>
                </span>
                <span className="font-semibold text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://portal.aether.edu/verify/transcript/sarah-${Date.now().toString(36)}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 print:bg-white print:text-black font-sans">
      
      {/* 1. PROFESSIONAL TOP HEADER SECTION */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs print:hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          
          {/* Title & Metadata */}
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
              <span>Academics</span>
              <span>/</span>
              <span className="text-slate-900 font-semibold">Performance Analytics</span>
              <span>/</span>
              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-[#6e1e27]/10 text-[#6e1e27] font-semibold text-[11px]">
                <Award className="h-3 w-3" />
                <span>{active.standing}</span>
              </span>
            </div>

            <div className="flex flex-wrap items-baseline gap-3">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
                Academic Progress & Performance
              </h1>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {active.termBadge}
              </span>
            </div>

            <p className="text-xs text-slate-500 max-w-2xl">
              Curricular telemetry, cohort distributions, and AI study heuristics for <span className="font-semibold text-slate-800">{user.name}</span>.
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-center">
            
            {/* Semester Switcher */}
            <div className="relative">
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="bg-slate-50 hover:bg-slate-100 text-slate-900 text-xs font-semibold py-2 pl-3.5 pr-8 border border-slate-200 rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#6e1e27]/20 transition-all appearance-none"
              >
                <option value="Fall 2026">Fall 2026 (Active)</option>
                <option value="Spring 2026">Spring 2026</option>
                <option value="Fall 2025">Fall 2025</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>

            {/* Benchmark Toggle Button */}
            <button
              onClick={() => setShowBenchmark(!showBenchmark)}
              className={`flex items-center space-x-1.5 text-xs font-semibold px-3 py-2 rounded-xl border transition-all cursor-pointer ${
                showBenchmark
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${showBenchmark ? "bg-emerald-600" : "bg-slate-300"}`} />
              <span>Benchmark: {showBenchmark ? "On" : "Off"}</span>
            </button>

            {/* GPA Forecaster / Simulator Button */}
            <button
              onClick={() => setShowSimulator(!showSimulator)}
              className={`flex items-center space-x-1.5 text-xs font-semibold px-3 py-2 rounded-xl border transition-all cursor-pointer ${
                showSimulator
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>GPA Forecaster</span>
            </button>

            {/* Print Official Transcript */}
            <PrintReportButton />

            {/* Share View Dossier */}
            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center space-x-1.5 text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 px-3 py-2 rounded-xl border border-slate-200 transition-all cursor-pointer"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-1 border-t border-slate-100 mt-5 pt-3 overflow-x-auto text-xs font-semibold">
          {[
            { id: "overview", label: "Executive Overview" },
            { id: "academics", label: "Exam & Grade Analytics" },
            { id: "attendance", label: "Attendance & Compliance" },
            { id: "ai_advisory", label: "AI Diagnostic Insights" },
            { id: "ledger", label: "Official Submissions Ledger" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 ${
                activeTab === tab.id
                  ? "bg-slate-900 text-white font-bold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* HARD COPY PRINT HEADER (Shows only when printing) */}
      <div className="hidden print:block border-b-2 border-slate-900 pb-4 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold uppercase tracking-wider text-black">Aether Academy of Technology & Sciences</h1>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-600">Office of the Registrar • Academic Progression Report</p>
          </div>
          <div className="text-right text-xs">
            <p className="font-bold">Term: {active.termName}</p>
            <p className="text-slate-600">Record ID: STU-2026-884</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4 pt-3 border-t border-slate-200 text-xs">
          <div><span className="font-bold text-slate-500">Scholar:</span> {user.name}</div>
          <div><span className="font-bold text-slate-500">Degree:</span> B.S. Computer Science</div>
          <div><span className="font-bold text-slate-500">Current CGPA:</span> {active.cgpa} / 10.0</div>
        </div>
      </div>

      {/* 2. GPA FORECASTER / SIMULATOR DRAWER (When open) */}
      {showSimulator && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4 print:hidden animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <SlidersHorizontal className="h-4 w-4 text-[#6e1e27]" />
                <h3 className="text-sm font-bold text-slate-900">
                  Target CGPA Forecaster
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Simulate upcoming assessment outcomes to project your final Cumulative GPA.
              </p>
            </div>

            <div className="flex items-center space-x-3 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-2xs self-start sm:self-auto">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Forecasted CGPA</span>
                <span className="text-xl font-bold text-[#6e1e27] font-mono">{simulatedCGPA}</span>
              </div>
              <div className="border-l border-slate-200 pl-3">
                <span className="text-[10px] font-semibold text-slate-500 block">Net Delta</span>
                <span className="text-xs font-bold text-emerald-600">
                  {Number(simulatedCGPA) >= active.cgpa ? `+${(Number(simulatedCGPA) - active.cgpa).toFixed(2)} pts` : `${(Number(simulatedCGPA) - active.cgpa).toFixed(2)} pts`}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                <span>Projected Final Examination Score:</span>
                <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">{projectedFinalScore}%</span>
              </div>
              <input
                type="range"
                min="60"
                max="100"
                value={projectedFinalScore}
                onChange={(e) => setProjectedFinalScore(Number(e.target.value))}
                className="w-full accent-[#6e1e27] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Passing (60%)</span>
                <span>Cohort Avg (85%)</span>
                <span>Maximum (100%)</span>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                <span>Classical Mechanics Remedial Score:</span>
                <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">{projectedMechanicsScore}%</span>
              </div>
              <input
                type="range"
                min="60"
                max="100"
                value={projectedMechanicsScore}
                onChange={(e) => setProjectedMechanicsScore(Number(e.target.value))}
                className="w-full accent-[#6e1e27] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Current (74%)</span>
                <span>Target (86%)</span>
                <span>Distinction (95%+)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. PROFESSIONAL 5-METRIC KPI TILES */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
        
        {/* KPI 1: Cumulative CGPA */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">CGPA</span>
              <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200/60 font-mono shrink-0">
                {active.cgpaDelta}
              </span>
            </div>
            <div className="mt-1.5 flex items-center space-x-1 text-sm font-semibold text-slate-900">
              <span className="font-bold">{active.cgpa}</span>
              <span className="text-slate-500 font-medium">/ 10.0</span>
            </div>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
            <span className="text-slate-500">Term: <strong className="text-slate-800">{active.termGpa}</strong></span>
            <span className="text-slate-600 font-medium text-[9px] bg-slate-100 px-1.5 py-0.5 rounded">Goal 9.00</span>
          </div>
        </div>

        {/* KPI 2: Cohort Rank */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Class Rank</span>
              <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-full border border-amber-200/60 shrink-0">
                Top 15%
              </span>
            </div>
            <div className="mt-1.5 flex items-center space-x-1 text-sm font-semibold text-slate-900">
              <span className="font-bold">{active.classRank}th</span>
              <span className="text-slate-500 font-medium">of {active.cohortSize}</span>
            </div>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
            <span className="text-slate-500">{active.percentile}</span>
            <span className="text-slate-600 font-mono text-[9px] bg-slate-100 px-1.5 py-0.5 rounded">Avg {active.cohortMeanGpa}</span>
          </div>
        </div>

        {/* KPI 3: Curricular Credits */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Credits</span>
              <span className="text-[9px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded font-mono shrink-0">
                {Math.round((active.creditsEarned / active.creditsRequired) * 100)}%
              </span>
            </div>
            <div className="mt-1.5 flex items-center space-x-1 text-sm font-semibold text-slate-900">
              <span className="font-bold">{active.creditsEarned}</span>
              <span className="text-slate-500 font-medium">/ {active.creditsRequired} ECTS</span>
            </div>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1">
            <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-600 rounded-full transition-all duration-500" 
                style={{ width: `${(active.creditsEarned / active.creditsRequired) * 100}%` }}
              />
            </div>
            <div className="text-[9px] text-slate-400">
              Sophomore Stage
            </div>
          </div>
        </div>

        {/* KPI 4: Submission Velocity & Streak */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Punctuality</span>
              <span className="inline-flex items-center space-x-1 text-[9px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded-full border border-rose-200/60 shrink-0">
                <Flame className="h-2.5 w-2.5 fill-rose-600 text-rose-600" />
                <span>{active.streakDays}d</span>
              </span>
            </div>
            <div className="mt-1.5 flex items-center space-x-1 text-sm font-semibold text-slate-900">
              <span className="font-bold">{active.onTimeRate}%</span>
              <span className="text-slate-500 font-medium">on-time</span>
            </div>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
            <span className="text-slate-500">Missed: 0</span>
            <span className="text-emerald-700 font-bold font-mono text-[9px] bg-emerald-50 px-1.5 py-0.5 rounded shrink-0">0 Lates</span>
          </div>
        </div>

        {/* KPI 5: Registry Clearance */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between col-span-2 md:col-span-1 xl:col-span-1">
          <div>
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Clearance</span>
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            </div>
            <div className="mt-1.5 flex items-center space-x-1 text-sm font-semibold text-slate-900">
              <span className="font-bold text-emerald-700">Clear</span>
              <span className="text-slate-500 font-medium">• Good Standing</span>
            </div>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
            <span className="text-slate-500">Board</span>
            <span className="text-emerald-700 font-bold text-[9px] bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60 shrink-0">Approved</span>
          </div>
        </div>

      </div>

      {/* 4. MAIN ANALYTICS SECTION (TABBED OR COMPOSITE) */}
      {(activeTab === "overview" || activeTab === "academics") && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Chart 1: Exam Score Progression (Area Chart) */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Grade Trajectory & Assessment Trend
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Chronological performance plotted against cohort average and 90% honors threshold.
                  </p>
                </div>
                <div className="flex items-center space-x-2 text-xs font-semibold text-slate-600">
                  <span className="flex items-center space-x-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#6e1e27]" />
                    <span>My Score</span>
                  </span>
                  {showBenchmark && (
                    <span className="flex items-center space-x-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
                      <span>Cohort Mean</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="w-full h-64 mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={active.examTrajectory} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="primaryAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6e1e27" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#6e1e27" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#94a3b8" 
                    fontSize={10} 
                    fontWeight={500} 
                    tickLine={false} 
                  />
                  <YAxis 
                    domain={[60, 100]} 
                    stroke="#94a3b8" 
                    fontSize={10} 
                    fontWeight={500} 
                    tickLine={false} 
                    unit="%" 
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <ReferenceLine 
                    y={90} 
                    stroke="#eab308" 
                    strokeDasharray="3 3" 
                    label={{ value: "90% Honors Line", fill: "#ca8a04", fontSize: 9, position: "insideTopRight" }} 
                  />
                  <Area
                    name="My Score"
                    type="monotone"
                    dataKey="score"
                    stroke="#6e1e27"
                    strokeWidth={2.5}
                    fill="url(#primaryAreaGrad)"
                    dot={{ r: 4, stroke: "#6e1e27", strokeWidth: 2, fill: "#ffffff" }}
                    activeDot={{ r: 6, fill: "#6e1e27" }}
                  />
                  {showBenchmark && (
                    <Area
                      name="Cohort Mean"
                      type="monotone"
                      dataKey="cohortAvg"
                      stroke="#0d9488"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      fill="transparent"
                      dot={{ r: 3, fill: "#0d9488" }}
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Peak Assessment: <strong className="text-slate-800">Projected Finals (95%)</strong></span>
              <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                +16.2% Cohort Surplus
              </span>
            </div>
          </div>

          {/* Chart 2: Subject Performance Deviations (Bar Chart) */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Subject Performance Deviations
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Variance in subject averages against 85% academic baseline.
                  </p>
                </div>
                <div className="flex items-center space-x-2 text-xs font-semibold">
                  <span className="flex items-center space-x-1 text-teal-700">
                    <span className="w-2 h-2 rounded-full bg-teal-600" />
                    <span>Surplus (+)</span>
                  </span>
                  <span className="flex items-center space-x-1 text-rose-700">
                    <span className="w-2 h-2 rounded-full bg-rose-600" />
                    <span>Deficit (-)</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="w-full h-64 mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={active.deviations} margin={{ top: 10, right: 10, left: -25, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis 
                    dataKey="subject" 
                    stroke="#94a3b8" 
                    fontSize={9} 
                    fontWeight={500} 
                    tickLine={false}
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                  />
                  <YAxis 
                    domain={[-15, 15]} 
                    stroke="#94a3b8" 
                    fontSize={10} 
                    fontWeight={500} 
                    tickLine={false} 
                    unit="%" 
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <ReferenceLine y={0} stroke="#94a3b8" />
                  <Bar dataKey="deviation" maxBarSize={32} radius={6}>
                    {active.deviations.map((entry: any, index: number) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.deviation >= 0 ? "#0d9488" : "#e11d48"} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Attention Area: <strong className="text-rose-700">Classical Mechanics (-9%)</strong></span>
              <span className="font-semibold text-slate-700">5 of 6 Courses Above Baseline</span>
            </div>
          </div>

        </div>
      )}

      {/* 5. ATTENDANCE & STATUTORY COMPLIANCE SECTION */}
      {(activeTab === "overview" || activeTab === "attendance") && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Attendance Trajectory Area Chart */}
          <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Longitudinal Attendance Trajectory
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Weekly attendance progression against statutory 75% exam board requirement.
                  </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 self-start sm:self-auto">
                  Cumulative: {active.attendanceRate}%
                </span>
              </div>
            </div>

            <div className="w-full h-60 mt-5">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={active.attendanceTrend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="attendanceAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="week" stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <YAxis domain={[65, 100]} stroke="#94a3b8" fontSize={10} tickLine={false} unit="%" />
                  <Tooltip content={<ChartTooltip />} />
                  <ReferenceLine 
                    y={75} 
                    stroke="#ef4444" 
                    strokeDasharray="3 3" 
                    label={{ value: "75% Mandatory Minimum", fill: "#ef4444", fontSize: 9, position: "insideTopLeft" }} 
                  />
                  <Area
                    name="My Attendance"
                    type="monotone"
                    dataKey="studentRate"
                    stroke="#2563eb"
                    strokeWidth={2.5}
                    fill="url(#attendanceAreaGrad)"
                    dot={{ r: 3.5, stroke: "#2563eb", fill: "#ffffff" }}
                  />
                  {showBenchmark && (
                    <Area
                      name="Cohort Mean"
                      type="monotone"
                      dataKey="cohortRate"
                      stroke="#94a3b8"
                      strokeWidth={1.5}
                      strokeDasharray="3 3"
                      fill="transparent"
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center space-x-1.5 text-emerald-700 font-semibold">
                <CheckCircle2 className="h-4 w-4" />
                <span>Compliant • +17% Clearance Margin</span>
              </span>
              <span>10 weekly cycles audited</span>
            </div>
          </div>

          {/* Subject-Wise Roll Call Register */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Course Attendance Breakdown
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Attendance metrics per enrolled classroom.
              </p>
            </div>

            <div className="my-5 space-y-3.5 flex-grow">
              {active.subjectAttendance.map((sa: any, idx: number) => {
                const isWarning = sa.status === "Attention Required";
                return (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800 truncate pr-2">{sa.name}</span>
                      <span className={`text-[11px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        isWarning ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
                      }`}>
                        {sa.rate}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${isWarning ? "bg-amber-500" : "bg-emerald-600"}`}
                        style={{ width: `${sa.rate}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>{sa.attended} of {sa.total} sessions</span>
                      <span>{isWarning ? "Near 75% limit" : "Safe"}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>All statutory minimums satisfied</span>
              <span className="font-semibold text-emerald-700">Eligible</span>
            </div>
          </div>

        </div>
      )}

      {/* 6. AI ADVISORY & REMEDIAL ROADMAP SECTION */}
      {(activeTab === "overview" || activeTab === "ai_advisory") && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* AI Academic Prognosis Card */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-7 w-7 rounded-lg bg-[#6e1e27]/10 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-[#6e1e27]" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">
                    AI Academic Prognosis
                  </h3>
                </div>
                <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200/60">
                  Model 2.5
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Automated pedagogical diagnosis compiled from assessment logs.
              </p>
            </div>

            <div className="my-4 p-4 bg-[#6e1e27]/5 border border-[#6e1e27]/15 rounded-xl">
              <span className="text-[10px] font-bold text-[#6e1e27] uppercase tracking-wider block mb-1">
                Advisory Summary
              </span>
              <p className="text-xs text-slate-700 font-medium leading-relaxed">
                &ldquo;Strong mastery exhibited in algorithmic logic and relational models. Focus remedial study on Lagrangian dynamics prior to term finals to secure Dean&apos;s Honor Distinction.&rdquo;
              </p>
            </div>

            <div className="space-y-2.5">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-600">Predicted Finals Range:</span>
                <span className="font-bold text-slate-900 font-mono">8.88 – 8.95 CGPA</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-600">Dean&apos;s List Probability:</span>
                <span className="font-bold text-[#6e1e27] font-mono">96.4% Confidence</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 text-[10px] text-slate-400 text-center">
              Generated via Google Gemini Heuristics
            </div>
          </div>

          {/* Targeted Action Checklist */}
          <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Pedagogical Action Checklist
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Recommended high-yield study items to optimize upcoming examination marks.
                  </p>
                </div>
                <div className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg self-start sm:self-auto">
                  Completed: <strong className="text-slate-900">{completedTasks} / {totalTasks}</strong>
                </div>
              </div>
            </div>

            <div className="my-4 space-y-2.5 flex-grow">
              {[
                { id: "task-1", title: "Complete SQL indexing and query optimization mock set", tag: "DBMS", impact: "+4% Exam Impact" },
                { id: "task-2", title: "Review self-balancing AVL tree rotation proofs before Thursday lab", tag: "DSA", impact: "+8% Lab Impact" },
                { id: "task-3", title: "Attend Prof. Thorne's Classical Mechanics 1-on-1 office hours", tag: "Physics", impact: "High Yield Remediation" },
                { id: "task-4", title: "Solve multiple linear regression practice set #4", tag: "Statistics", impact: "+3% Exam Impact" },
                { id: "task-5", title: "Review past semester exams on Lagrangian Mechanics", tag: "Physics", impact: "+6% Grade Boost" }
              ].map(task => {
                const isDone = !!tasks[task.id];
                return (
                  <div
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                      isDone 
                        ? "bg-slate-50/70 border-slate-200 opacity-60" 
                        : "bg-white hover:bg-slate-50 border-slate-200 shadow-2xs"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`h-4.5 w-4.5 rounded-md flex items-center justify-center border transition-all ${
                        isDone ? "bg-[#6e1e27] border-[#6e1e27] text-white" : "border-slate-300 bg-white"
                      }`}>
                        {isDone && <Check className="h-3 w-3 stroke-[3]" />}
                      </div>
                      <div>
                        <span className={`text-xs font-medium block ${isDone ? "line-through text-slate-400" : "text-slate-800"}`}>
                          {task.title}
                        </span>
                        <div className="flex items-center space-x-2 mt-0.5 text-[10px] text-slate-400">
                          <span className="font-semibold text-slate-600">[{task.tag}]</span>
                          <span>•</span>
                          <span className="text-[#6e1e27] font-medium">{task.impact}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      isDone ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
                    }`}>
                      {isDone ? "Done" : "Pending"}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Weekly Dedicated Study Goal: <strong className="text-slate-800">16 / 20 Hours (80%)</strong></span>
              <span className="font-semibold text-emerald-700">On Track</span>
            </div>
          </div>

        </div>
      )}

      {/* 7. OFFICIAL GRADED SUBMISSIONS LEDGER */}
      {(activeTab === "overview" || activeTab === "ledger") && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs break-inside-avoid print:bg-white print:text-black">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Official Graded Submissions Ledger
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Comprehensive record of assignments, evaluations, and faculty feedback.
              </p>
            </div>

            <div className="relative print:hidden">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search courses or assignments..."
                value={searchLedger}
                onChange={(e) => setSearchLedger(e.target.value)}
                className="bg-slate-50 hover:bg-slate-100 text-xs py-2 pl-9 pr-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#6e1e27]/20 w-64 transition-all"
              />
            </div>
          </div>

          {filteredSubmissions.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-500">
              No matching submission records found.
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left text-xs text-slate-700 print:text-black font-medium">
                <thead>
                  <tr className="border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-400 print:border-black">
                    <th className="pb-3 pr-4">Course</th>
                    <th className="pb-3 px-4">Assignment Deliverable</th>
                    <th className="pb-3 px-4">Score / Max</th>
                    <th className="pb-3 px-4">Grade Tier</th>
                    <th className="pb-3 pl-4">Faculty Diagnostic Feedback</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 print:divide-slate-200 text-slate-800">
                  {filteredSubmissions.map((sub, idx) => {
                    const percentage = sub.score !== null ? Math.round((sub.score / sub.assignment.maxScore) * 100) : null;
                    const letterGrade = percentage !== null
                      ? percentage >= 90 ? "A+" : percentage >= 80 ? "A" : percentage >= 70 ? "B+" : "B"
                      : "PND";

                    return (
                      <tr key={sub.id || idx} className="hover:bg-slate-50/60 transition-colors print:hover:bg-transparent">
                        <td className="py-3.5 pr-4 font-semibold text-slate-900 print:text-black">
                          {sub.assignment.class.course.title}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 print:text-black">
                          {sub.assignment.title}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-semibold text-slate-900 print:text-black">
                          {sub.score !== null ? (
                            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/50">
                              {sub.score} / {sub.assignment.maxScore} ({percentage}%)
                            </span>
                          ) : (
                            <span className="text-slate-400 bg-slate-100 px-2 py-0.5 rounded">Pending Evaluation</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-bold font-mono ${
                            letterGrade === "A+" || letterGrade === "A"
                              ? "bg-emerald-100 text-emerald-900"
                              : "bg-blue-100 text-blue-900"
                          }`}>
                            {letterGrade}
                          </span>
                        </td>
                        <td className="py-3.5 pl-4 text-slate-600 text-[11px] leading-relaxed max-w-sm truncate print:text-black print:max-w-none print:whitespace-normal">
                          {sub.feedback || "Exemplary solution methodology with complete proof derivation."}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 8. SHARE DOSSIER MODAL */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 print:hidden animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="h-8 w-8 rounded-lg bg-[#6e1e27]/10 flex items-center justify-center">
                  <Share2 className="h-4 w-4 text-[#6e1e27]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Share Academic Record
                  </h3>
                  <p className="text-[11px] text-slate-500">Read-only mentor access token</p>
                </div>
              </div>
              <button 
                onClick={() => setShowShareModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Generate a secure, read-only link for parents or academic advisors to view verified term grades without portal edit credentials.
            </p>

            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-600 truncate pr-2">
                https://portal.aether.edu/verify/sarah-2026-f49a
              </span>
              <button
                onClick={handleCopyLink}
                className="px-3 py-1.5 bg-[#6e1e27] hover:bg-[#58181f] text-white text-xs font-semibold rounded-lg transition-all flex items-center space-x-1 cursor-pointer shrink-0"
              >
                {copiedLink ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedLink ? "Copied" : "Copy Link"}</span>
              </button>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
