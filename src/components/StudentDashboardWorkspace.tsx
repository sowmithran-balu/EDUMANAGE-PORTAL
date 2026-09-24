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
  BookOpen, Calendar, CheckCircle2, AlertTriangle, 
  BrainCircuit, Sparkles, TrendingUp, User, Percent, 
  Users, CreditCard, IndianRupee, AlertCircle, ShieldCheck, 
  X, Award, FileText, Printer, Share2, Activity, ChevronDown,
  ShieldAlert, Flame, CheckSquare, HelpCircle, Compass
} from "lucide-react";

interface StudentDashboardWorkspaceProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  enrollments: any[];
  attendanceRate: number;
  totalAssignments: number;
  submissionsCount: number;
  riskData: any;
  recommendations: string;
  allStudents: any[];
  allFees: any[];
  allSubmissions: any[];
  gradeHistory: any[];
  deviations: any[];
}

export default function StudentDashboardWorkspace({
  user,
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
}: StudentDashboardWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "students" | "attendance" | "fees" | "exams" | "reports" | "certificates">("overview");
  
  // Search and filter states for Students tab
  const [studentSearch, setStudentSearch] = useState("");
  const [studentSemFilter, setStudentSemFilter] = useState("All");

  // Fees processing states
  const [fees, setFees] = useState(allFees);
  const [selectedFee, setSelectedFee] = useState<any | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("upi");
  const [paying, setPaying] = useState(false);

  // Sum calculations for Fees
  const totalAmount = fees.reduce((sum, f) => sum + f.amount, 0);
  const totalPaid = fees.reduce((sum, f) => sum + f.paid, 0);
  const pendingBalance = totalAmount - totalPaid;

  const handlePayInvoice = async () => {
    if (!selectedFee) return;
    setPaying(true);

    try {
      const res = await fetch("/api/student/fees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feeId: selectedFee.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      alert("💳 ERP Transaction Complete!\nYour invoice balance has been updated.");
      setFees((prev) =>
        prev.map((f) =>
          f.id === selectedFee.id ? { ...f, paid: f.amount, status: "paid" } : f
        )
      );
      setSelectedFee(null);
    } catch {
      alert("Payment transaction failed. Please retry.");
    } finally {
      setPaying(false);
    }
  };

  // Recharts tooltip styling
  const tooltipStyle = {
    backgroundColor: "#ffffff",
    borderColor: "#e5e7eb",
    color: "#111827",
    borderRadius: "12px",
    fontSize: "11px",
    fontWeight: "bold",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
  };

  // Mock Attendance Tracker Data
  const attendanceRegistry = [
    { date: "2026-08-17", class: "Data Science Lab", status: "present", checkIn: "01:50 PM" },
    { date: "2026-08-17", class: "Business Statistics", status: "present", checkIn: "09:05 AM" },
    { date: "2026-08-15", class: "Data Structures & Alg.", status: "present", checkIn: "10:02 AM" },
    { date: "2026-08-14", class: "Advanced Classical Mechanics", status: "absent", checkIn: "-" },
    { date: "2026-08-12", class: "Full Stack Development", status: "present", checkIn: "11:18 AM" },
    { date: "2026-08-10", class: "Financial and Cost Accounting", status: "late", checkIn: "12:35 PM" },
    { date: "2026-08-07", class: "Environmental Sustainability", status: "present", checkIn: "01:47 PM" },
    { date: "2026-08-05", class: "Open Elective I - Robotics", status: "present", checkIn: "12:18 PM" }
  ];

  // Mock Report Cards
  const reportCards = [
    { id: "rep-1", title: "Semester IV Final Report Card", term: "Spring 2026", status: "VERIFIED", grade: "A (GPA 8.80)", date: "July 2026" },
    { id: "rep-2", title: "Semester III Final Report Card", term: "Fall 2025", status: "VERIFIED", grade: "A- (GPA 8.64)", date: "Jan 2026" },
    { id: "rep-3", title: "Semester II Final Report Card", term: "Spring 2025", status: "ARCHIVED", grade: "B+ (GPA 8.20)", date: "July 2025" }
  ];

  // Mock Certificates
  const certificates = [
    { id: "cert-1", title: "Certificate of Academic Excellence", issuedBy: "Aether Board of Regents", scope: "Top 10% Percentile Rank", date: "Aug 2026", status: "Approved" },
    { id: "cert-2", title: "KIT Hackathon Finalist Badge", issuedBy: "KIT Hackathon Committee", scope: "Next-Gen AI Prototype Track", date: "Feb 2026", status: "Issued" },
    { id: "cert-3", title: "CSR Community Leadership Award", issuedBy: "United Nations Sustainability Cell", scope: "SDG Outreach Action", date: "Nov 2025", status: "Issued" }
  ];

  return (
    <div className="space-y-6 w-full">
      {/* NOTICE/ALERT BANNER */}
      <div className="bg-[#FCEEF0] border border-[#6E1E27]/10 p-4 rounded-2xl flex items-center justify-between text-xs text-[#6E1E27]">
        <div className="flex items-center space-x-3">
          <AlertCircle className="h-5 w-5 text-[#6E1E27] shrink-0" />
          <div>
            <span className="font-extrabold uppercase tracking-wider block">Important Notice: Semester V Registrations</span>
            <p className="opacity-90 font-medium mt-0.5">Please verify all seeded CSBS subjects. Direct fee payments are open under the ERP Fees tab below.</p>
          </div>
        </div>
        <span className="hidden sm:inline-flex px-2 py-1 bg-[#6E1E27] text-white text-[8px] font-black uppercase tracking-widest rounded-lg">
          LATEST
        </span>
      </div>

      {/* HERO BANNER SECTION */}
      <section className="bg-gradient-to-r from-[#6E1E27] to-[#8C2833] rounded-3xl p-6 lg:p-8 text-white relative overflow-hidden shadow-md shadow-[#6E1E27]/10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex px-2 py-0.5 bg-white/15 border border-white/20 text-white text-[8px] font-black uppercase tracking-wider rounded">
              ACTIVE
            </span>
            <span className="inline-flex px-2 py-0.5 bg-white/15 border border-white/20 text-white text-[8px] font-black uppercase tracking-wider rounded">
              2026-27
            </span>
            <span className="inline-flex px-2 py-0.5 bg-white/15 border border-white/20 text-white text-[8px] font-black uppercase tracking-wider rounded">
              SEMESTER V
            </span>
          </div>

          <div>
            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight uppercase leading-none">
              Education Management Portal
            </h1>
            <p className="text-white/80 text-xs md:text-sm font-medium mt-2 max-w-xl">
              Access direct syllabus details, review class analytics, pay invoice dues, and explore active performance matrices.
            </p>
          </div>
        </div>
      </section>

      {/* HORIZONTAL TAB BAR */}
      <div className="border-b border-slate-200 pb-px print:hidden">
        <div className="flex space-x-1 overflow-x-auto scrollbar-none py-1">
          {(["overview", "students", "attendance", "fees", "exams", "reports", "certificates"] as const).map((tab) => {
            const label = tab === "exams" ? "Exams & Grades" : tab;
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-[#6E1E27] text-white shadow-md shadow-[#6E1E27]/10"
                    : "text-slate-500 hover:text-slate-800 hover:bg-[#FCEEF0]/40"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ACTIVE TAB PANEL VIEW */}
      <div className="transition-all duration-300">
        
        {/* --- 1. OVERVIEW TAB --- */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Quick stats grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Attendance Card */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Attendance Rate</p>
                  <p className="text-2xl font-black text-slate-900">{Math.round(attendanceRate * 100)}%</p>
                  <p className="text-[9px] text-slate-400 font-semibold">Min required threshold is &gt; 85%</p>
                </div>
                <div className="relative h-14 w-14 shrink-0">
                  <svg className="h-full w-full -rotate-90">
                    <circle cx="28" cy="28" r="24" fill="transparent" stroke="#f1f5f9" strokeWidth="4.5" />
                    <circle cx="28" cy="28" r="24" fill="transparent" stroke="#6E1E27" strokeWidth="4.5"
                      strokeDasharray={150.8}
                      strokeDashoffset={150.8 - (150.8 * attendanceRate)}
                      strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-[#6E1E27]">
                    {Math.round(attendanceRate * 100)}%
                  </div>
                </div>
              </div>

              {/* Homework Card */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Homework Progress</p>
                  <p className="text-2xl font-black text-slate-900">{submissionsCount}/{totalAssignments}</p>
                  <p className="text-[9px] text-slate-400 font-semibold">{totalAssignments > 0 ? Math.round((submissionsCount / totalAssignments) * 100) : 100}% completion rate</p>
                </div>
                <div className="relative h-14 w-14 shrink-0">
                  <svg className="h-full w-full -rotate-90">
                    <circle cx="28" cy="28" r="24" fill="transparent" stroke="#f1f5f9" strokeWidth="4.5" />
                    <circle cx="28" cy="28" r="24" fill="transparent" stroke="#3b82f6" strokeWidth="4.5"
                      strokeDasharray={150.8}
                      strokeDashoffset={150.8 - (150.8 * (totalAssignments > 0 ? submissionsCount / totalAssignments : 1))}
                      strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-blue-500">
                    {totalAssignments > 0 ? Math.round((submissionsCount / totalAssignments) * 100) : 100}%
                  </div>
                </div>
              </div>

              {/* AI Risk Card */}
              <div className={`bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex items-center justify-between ${
                riskData.score >= 40 ? "border-amber-200" : "border-slate-200"
              }`}>
                <div className="space-y-2">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">AI Academic Risk</p>
                  <p className={`text-2xl font-black ${
                    riskData.score >= 50 ? "text-red-650" : riskData.score >= 25 ? "text-amber-600" : "text-emerald-600"
                  }`}>{riskData.score}/100</p>
                  <span className={`inline-flex px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                    riskData.score >= 50 ? "bg-red-50 text-red-700" : riskData.score >= 25 ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"
                  }`}>
                    {riskData.level} Risk Level
                  </span>
                </div>
                <div className="p-3.5 bg-[#FCEEF0] border border-[#6E1E27]/10 rounded-2xl text-[#6E1E27] shrink-0">
                  <BrainCircuit className="h-6 w-6" />
                </div>
              </div>
            </div>

            {/* Enrolled Courses Registry */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
              <div>
                <h2 className="text-sm font-black text-slate-950 uppercase tracking-wider flex items-center space-x-2">
                  <BookOpen className="h-4.5 w-4.5 text-[#6E1E27]" />
                  <span>Enrolled Courses Registry</span>
                </h2>
                <p className="text-[10px] text-slate-500 mt-0.5">Syllabus tracking and assigned class advisors.</p>
              </div>

              <div className="space-y-4">
                {enrollments.map((enroll) => {
                  const isPhysics = enroll.class.course.title.toLowerCase().includes("physics");
                  const accentColor = isPhysics ? "bg-purple-600" : "bg-teal-650";
                  
                  return (
                    <div
                      key={enroll.id}
                      className="relative p-5 pl-8 bg-[#F7F7F9]/60 border border-slate-200/80 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-xs transition-all"
                    >
                      <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl ${isPhysics ? "bg-purple-600" : "bg-[#6E1E27]"}`} />

                      <div className="space-y-4 flex-grow">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-extrabold text-slate-900 text-sm leading-tight">
                              {enroll.class.course.title}
                            </h3>
                            <span className="inline-flex px-1.5 py-0.5 bg-[#FCEEF0] border border-[#6E1E27]/20 text-[#6E1E27] text-[8px] font-black uppercase tracking-wider rounded">
                              {enroll.class.course.category}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 font-semibold mt-1">Section: {enroll.class.name}</p>
                        </div>

                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-[10px] text-slate-650 font-semibold">
                          <span className="flex items-center space-x-1">
                            <User className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                            <span>Instructor: {enroll.class.course.teacher.name}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Calendar className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                            <span>{enroll.class.course.schedule}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Users className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                            <span>45 Enrolled</span>
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => setActiveTab("exams")}
                        className="border border-[#6E1E27] text-[#6E1E27] hover:bg-[#FCEEF0] font-black text-[9px] uppercase tracking-wider py-2 px-3.5 rounded-xl transition-all flex items-center space-x-1 shrink-0 self-start md:self-center cursor-pointer"
                      >
                        <span>View Grades</span>
                        <TrendingUp className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI Coach Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 bg-[#FCEEF0] rounded-bl-3xl border-l border-b border-[#6E1E27]/10">
                <Sparkles className="h-4.5 w-4.5 text-[#6E1E27] animate-pulse" />
              </div>

              <h2 className="text-sm font-black text-slate-950 uppercase tracking-wider flex items-center space-x-2 mb-4">
                <BrainCircuit className="h-5 w-5 text-[#6E1E27]" />
                <span>AI Coach Diagnostic Guidelines</span>
              </h2>

              <div className="text-xs text-slate-700 leading-relaxed space-y-3">
                {riskData.score >= 35 && (
                  <div className="p-3 bg-amber-500/5 rounded-xl border border-amber-500/10">
                    <p className="font-extrabold text-amber-600 text-[10px] uppercase tracking-wider mb-1">Attention Required:</p>
                    <ul className="list-disc pl-4 space-y-0.5 text-slate-700 text-[10px] font-medium">
                      {riskData.factors.map((f: string, i: number) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="prose prose-xs text-slate-650 max-w-none font-medium">
                  {recommendations.split("\n\n").map((para: string, pIdx: number) => (
                    <p key={pIdx} className="mb-2 leading-relaxed">
                      {para.startsWith("###") ? (
                        <strong className="font-extrabold text-slate-900 block mt-2 text-xs uppercase tracking-wide">
                          {para.replace("###", "").trim()}
                        </strong>
                      ) : (
                        para.split("\n").map((line, lIdx) => {
                          if (line.startsWith("*") || line.startsWith("-")) {
                            return (
                              <span key={lIdx} className="block pl-2 text-slate-650">
                                • {line.replace(/^[*\-]\s+/, "")}
                              </span>
                            );
                          }
                          return line;
                        })
                      )}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- 2. STUDENTS TAB (Student Management) --- */}
        {activeTab === "students" && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-black text-slate-950 uppercase tracking-wider flex items-center space-x-2">
                  <Users className="h-4.5 w-4.5 text-[#6E1E27]" />
                  <span>Student Registry Directory</span>
                </h2>
                <p className="text-[10px] text-slate-500 mt-0.5">Explore profiles and active enrollment lists for cohorts.</p>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Search students..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="bg-[#F7F7F9] border border-slate-200 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-[#6E1E27]"
                />
                <select
                  value={studentSemFilter}
                  onChange={(e) => setStudentSemFilter(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs outline-none cursor-pointer"
                >
                  <option value="All">All Semesters</option>
                  <option value="Semester III">Semester III</option>
                  <option value="Semester V">Semester V</option>
                </select>
              </div>
            </div>

            {/* Students Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {allStudents
                .filter((st) => {
                  const matchesSearch = st.name.toLowerCase().includes(studentSearch.toLowerCase()) || st.email.toLowerCase().includes(studentSearch.toLowerCase());
                  
                  let matchesSem = true;
                  if (studentSemFilter !== "All") {
                    const bio = st.profile ? JSON.parse(st.profile).bio || "" : "";
                    const isJunior = bio.toLowerCase().includes("junior");
                    const isSoph = bio.toLowerCase().includes("sophomore");
                    const isFresh = bio.toLowerCase().includes("freshman");
                    if (studentSemFilter === "Semester V") {
                      matchesSem = isJunior || isSoph; // seeded junior/soph are V semester
                    } else if (studentSemFilter === "Semester III") {
                      matchesSem = isFresh;
                    }
                  }
                  return matchesSearch && matchesSem;
                })
                .map((student) => {
                  const bioInfo = student.profile ? JSON.parse(student.profile) : { bio: "", avatar: "/avatars/default.png" };
                  
                  return (
                    <div key={student.id} className="border border-slate-200 rounded-2xl p-5 bg-[#F7F7F9]/40 flex flex-col justify-between h-48 hover:shadow-xs transition-all">
                      <div className="flex items-center space-x-3.5">
                        <div className="h-10 w-10 bg-[#FCEEF0] border border-[#6E1E27]/20 rounded-full flex items-center justify-center text-[#6E1E27] font-black text-sm shrink-0">
                          {student.name.charAt(0)}
                        </div>
                        <div className="truncate">
                          <h3 className="font-extrabold text-slate-900 text-xs truncate">{student.name}</h3>
                          <p className="text-[10px] text-slate-500 font-semibold truncate mt-0.5">{student.email}</p>
                          <span className="inline-flex px-1.5 py-0.5 bg-[#FCEEF0] text-[#6E1E27] text-[8px] font-black uppercase tracking-wider rounded mt-1.5">
                            {bioInfo.bio.split(".")[0] || "Active Student"}
                          </span>
                        </div>
                      </div>

                      <p className="text-[10px] text-slate-650 mt-4 line-clamp-2 leading-relaxed font-medium">
                        {bioInfo.bio || "No profile bio submitted."}
                      </p>

                      <div className="border-t border-slate-200/80 pt-3 mt-4 flex items-center justify-between">
                        <span className="text-[9px] font-bold text-slate-500 uppercase">Aether Enrollment</span>
                        <button
                          onClick={() => {
                            setStudentSearch(student.name);
                            setActiveTab("exams");
                          }}
                          className="text-[#6E1E27] hover:underline font-black text-[9px] uppercase tracking-wider cursor-pointer"
                        >
                          View Grades →
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* --- 3. ATTENDANCE TAB (Attendance Tracker) --- */}
        {activeTab === "attendance" && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Attendance Status</p>
                  <p className="text-xl font-black text-emerald-700 mt-1">Excellent (92%)</p>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-600">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Present Lectures</p>
                  <p className="text-xl font-black text-slate-800 mt-1">26 / 28</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-slate-600">
                  <Calendar className="h-5 w-5" />
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Leaves & Late</p>
                  <p className="text-xl font-black text-amber-600 mt-1">2 Flagged Entries</p>
                </div>
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-amber-600">
                  <AlertCircle className="h-5 w-5" />
                </div>
              </div>
            </div>

            {/* Attendance List */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
              <h2 className="text-sm font-black text-slate-950 uppercase tracking-wider mb-6 flex items-center space-x-2">
                <Calendar className="h-4.5 w-4.5 text-[#6E1E27]" />
                <span>Attendance Log Matrix</span>
              </h2>

              <div className="overflow-x-auto w-full">
                <table className="w-full text-left text-xs text-slate-650">
                  <thead>
                    <tr className="border-b border-slate-200 text-[9px] uppercase tracking-widest text-slate-500">
                      <th className="pb-3 pr-4 font-bold">Lecture Date</th>
                      <th className="pb-3 px-4 font-bold">Class Subject</th>
                      <th className="pb-3 px-4 font-bold text-center">Status</th>
                      <th className="pb-3 pl-4 font-bold text-right">Gate Check-in</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {attendanceRegistry.map((att, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="py-4 pr-4 font-extrabold text-slate-900">
                          {new Date(att.date).toLocaleDateString("en-US", { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                        </td>
                        <td className="py-4 px-4 font-bold text-slate-700">
                          {att.class}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className={`inline-flex px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border ${
                            att.status === "present"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                              : att.status === "late"
                              ? "bg-amber-50 text-amber-700 border-amber-100"
                              : "bg-red-50 text-red-700 border-red-100"
                          }`}>
                            {att.status}
                          </span>
                        </td>
                        <td className="py-4 pl-4 text-right font-bold text-slate-500">
                          {att.checkIn}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* --- 4. FEES TAB (Fee Management) --- */}
        {activeTab === "fees" && (
          <div className="space-y-6">
            {/* Ledgers */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Invoice Term Dues</p>
                  <p className="text-xl font-black text-slate-900 mt-1">₹{totalAmount.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[#6E1E27]">
                  <IndianRupee className="h-5 w-5" />
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Paid Invoices Ledger</p>
                  <p className="text-xl font-black text-emerald-700 mt-1">₹{totalPaid.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-600">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Pending Balance Due</p>
                  <p className="text-xl font-black text-amber-600 mt-1">₹{pendingBalance.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-[#FCEEF0] rounded-xl border border-[#6E1E27]/10 text-[#6E1E27]">
                  <AlertCircle className="h-5 w-5" />
                </div>
              </div>
            </div>

            {/* Registry table */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
              <h2 className="text-sm font-black text-slate-950 uppercase tracking-wider mb-6 flex items-center space-x-2">
                <CreditCard className="h-4.5 w-4.5 text-[#6E1E27]" />
                <span>Invoice Registry Ledger</span>
              </h2>

              <div className="overflow-x-auto w-full">
                <table className="w-full text-left text-xs text-slate-650">
                  <thead>
                    <tr className="border-b border-slate-200 text-[9px] uppercase tracking-widest text-slate-500">
                      <th className="pb-3 pr-4 font-bold">Category Dues</th>
                      <th className="pb-3 px-4 font-bold">Amount</th>
                      <th className="pb-3 px-4 font-bold">Paid Out</th>
                      <th className="pb-3 px-4 font-bold">Term Due Date</th>
                      <th className="pb-3 px-4 font-bold text-center">Status</th>
                      <th className="pb-3 pl-4 font-bold text-right">Process Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {fees.map((fee) => (
                      <tr key={fee.id} className="hover:bg-slate-50/50">
                        <td className="py-4 pr-4 font-extrabold text-slate-900 capitalize">
                          {fee.type} Invoice Dues
                        </td>
                        <td className="py-4 px-4 font-bold text-slate-800">
                          ₹{fee.amount.toLocaleString()}
                        </td>
                        <td className="py-4 px-4 font-bold text-emerald-600">
                          ₹{fee.paid.toLocaleString()}
                        </td>
                        <td className="py-4 px-4 font-bold text-slate-500">
                          {new Date(fee.dueDate).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className={`inline-flex px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border ${
                            fee.status === "paid"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                              : "bg-[#FCEEF0] text-[#6E1E27] border-[#6E1E27]/10"
                          }`}>
                            {fee.status}
                          </span>
                        </td>
                        <td className="py-4 pl-4 text-right">
                          {fee.status === "pending" ? (
                            <button
                              onClick={() => setSelectedFee(fee)}
                              className="bg-[#6E1E27] hover:bg-[#5A171F] text-white font-black text-[9px] uppercase tracking-wider py-1.5 px-3 rounded-lg cursor-pointer transition-all shadow-md shadow-[#6E1E27]/10"
                            >
                              Pay Invoice
                            </button>
                          ) : (
                            <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wide">No Balance</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Checkout Screen Modal */}
            {selectedFee && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
                <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 relative overflow-hidden flex flex-col space-y-6 shadow-2xl">
                  <button
                    onClick={() => setSelectedFee(null)}
                    className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>

                  <div>
                    <div className="inline-flex items-center space-x-1.5 bg-[#FCEEF0] border border-[#6E1E27]/10 px-2.5 py-1 rounded-full text-[9px] font-black tracking-widest text-[#6E1E27] uppercase mb-3">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>ERP Secured Payment</span>
                    </div>
                    <h3 className="text-sm font-black text-slate-950 uppercase">Secured Billing Checkout</h3>
                    <p className="text-[10px] text-slate-500 font-medium">Processing payment for <strong className="text-slate-800 capitalize">{selectedFee.type}</strong> invoices.</p>
                  </div>

                  <div className="p-4 bg-[#F7F7F9] rounded-2xl border border-slate-200 flex items-center justify-between text-xs text-slate-700">
                    <span className="font-bold">Total Dues Pay Amount:</span>
                    <span className="text-base font-black text-[#6E1E27]">₹{selectedFee.amount.toLocaleString()}</span>
                  </div>

                  <div className="space-y-3">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Select Gateway Channel</p>
                    <div className="grid grid-cols-3 gap-2 text-[10px] font-black uppercase">
                      <button
                        onClick={() => setPaymentMethod("upi")}
                        className={`py-3 rounded-xl border transition-all cursor-pointer ${
                          paymentMethod === "upi"
                            ? "bg-[#FCEEF0] border-[#6E1E27] text-[#6E1E27]"
                            : "bg-[#F7F7F9] border-slate-200 text-slate-500"
                        }`}
                      >
                        UPI
                      </button>
                      <button
                        onClick={() => setPaymentMethod("card")}
                        className={`py-3 rounded-xl border transition-all cursor-pointer ${
                          paymentMethod === "card"
                            ? "bg-[#FCEEF0] border-[#6E1E27] text-[#6E1E27]"
                            : "bg-[#F7F7F9] border-slate-200 text-slate-500"
                        }`}
                      >
                        Credit Card
                      </button>
                      <button
                        onClick={() => setPaymentMethod("net")}
                        className={`py-3 rounded-xl border transition-all cursor-pointer ${
                          paymentMethod === "net"
                            ? "bg-[#FCEEF0] border-[#6E1E27] text-[#6E1E27]"
                            : "bg-[#F7F7F9] border-slate-200 text-slate-500"
                        }`}
                      >
                        Net Banking
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handlePayInvoice}
                    disabled={paying}
                    className="w-full bg-[#6E1E27] hover:bg-[#5A171F] disabled:bg-[#6E1E27]/55 text-white font-black text-xs py-3.5 rounded-xl uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-[#6E1E27]/10"
                  >
                    {paying ? "Processing Transaction..." : "Process Invoice Payment"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- 5. EXAMS & GRADES TAB --- */}
        {activeTab === "exams" && (
          <div className="space-y-6">
            {/* TRAJECTORY GRAPHS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Exam Score Trajectory (Line Chart) */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs h-90 flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-widest">Exam Score Trajectory</h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">Chronological grade progression charts</p>
                </div>

                <div className="flex-grow w-full h-56 mt-4">
                  {gradeHistory.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-xs text-slate-500">
                      No exam metrics logged.
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={gradeHistory} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} fontWeight="bold" />
                        <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={9} fontWeight="bold" />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Line
                          name="My Score (%)"
                          type="monotone"
                          dataKey="score"
                          stroke="#6E1E27"
                          strokeWidth={3}
                          activeDot={{ r: 6 }}
                          dot={{ r: 4, stroke: "#6E1E27", strokeWidth: 2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Performance Deviations (Bar Chart) */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs h-90 flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-widest">Subject Performance Deviations</h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">Subject averages compared to class overall baseline averages</p>
                </div>

                <div className="flex-grow w-full h-56 mt-4">
                  {deviations.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-xs text-slate-500">
                      Aligns perfectly with overall baseline.
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={deviations} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
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
            </div>

            {/* Recent Submissions */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
              <h2 className="text-sm font-black text-slate-950 mb-6 flex items-center space-x-2 uppercase tracking-wide">
                <CheckSquare className="h-5 w-5 text-[#6E1E27]" />
                <span>Recent Submissions & Scores</span>
              </h2>

              <div className="overflow-x-auto w-full">
                <table className="w-full text-left text-xs text-slate-650">
                  <thead>
                    <tr className="border-b border-slate-200 text-[9px] uppercase tracking-widest text-slate-500">
                      <th className="pb-3 pr-4 font-bold">Assignment Title</th>
                      <th className="pb-3 px-4 font-bold">Syllabus Course Scope</th>
                      <th className="pb-3 px-4 font-bold text-center">Score Ratio</th>
                      <th className="pb-3 pl-4 font-bold text-right">Instructor Feedback</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {allSubmissions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-slate-50/50">
                        <td className="py-4 pr-4 font-extrabold text-slate-900">
                          {sub.assignment.title}
                        </td>
                        <td className="py-4 px-4 font-bold text-slate-500">
                          {sub.assignment.class.course.title}
                        </td>
                        <td className="py-4 px-4 text-center font-bold text-slate-800">
                          {sub.score !== null ? `${sub.score} / ${sub.assignment.maxScore}` : "Grading Pending"}
                        </td>
                        <td className="py-4 pl-4 text-right text-slate-500 font-semibold italic">
                          {sub.feedback || "No feedback logged."}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* --- 6. REPORTS TAB --- */}
        {activeTab === "reports" && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
            <div>
              <h2 className="text-sm font-black text-slate-950 uppercase tracking-wider flex items-center space-x-2">
                <FileText className="h-4.5 w-4.5 text-[#6E1E27]" />
                <span>Academic Report Cards</span>
              </h2>
              <p className="text-[10px] text-slate-500 mt-0.5">Download official verified transcripts and grade report sheets.</p>
            </div>

            {/* Reports list */}
            <div className="space-y-4">
              {reportCards.map((report) => (
                <div
                  key={report.id}
                  className="p-5 bg-[#F7F7F9]/50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-xs transition-all"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="p-3 bg-[#FCEEF0] border border-[#6E1E27]/10 rounded-2xl text-[#6E1E27]">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-xs">{report.title}</h3>
                      <p className="text-[10px] text-slate-550 mt-0.5 font-semibold">Term Scope: {report.term} • Date: {report.date}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-start sm:self-center">
                    <span className="inline-flex px-1.5 py-0.5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-[8px] font-black tracking-wider rounded">
                      {report.status}
                    </span>
                    <button
                      onClick={() => alert(`🖨️ Printing ${report.title}...`)}
                      className="border border-[#6E1E27] text-[#6E1E27] hover:bg-[#FCEEF0] font-black text-[9px] uppercase tracking-wider py-2 px-3.5 rounded-xl transition-all cursor-pointer"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- 7. CERTIFICATES TAB --- */}
        {activeTab === "certificates" && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
            <div>
              <h2 className="text-sm font-black text-slate-950 uppercase tracking-wider flex items-center space-x-2">
                <Award className="h-4.5 w-4.5 text-[#6E1E27]" />
                <span>Verified Academic Credentials</span>
              </h2>
              <p className="text-[10px] text-slate-500 mt-0.5">Officially issued certifications for achievements and competitions.</p>
            </div>

            {/* Certificates List */}
            <div className="space-y-4">
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="p-5 bg-[#F7F7F9]/50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-xs transition-all"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="p-3 bg-[#FCEEF0] border border-[#6E1E27]/10 rounded-2xl text-[#6E1E27]">
                      <Award className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-xs">{cert.title}</h3>
                      <p className="text-[10px] text-slate-550 mt-0.5 font-semibold">Issued By: {cert.issuedBy} • {cert.scope}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-start sm:self-center">
                    <span className="inline-flex px-1.5 py-0.5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-[8px] font-black tracking-wider rounded">
                      {cert.status}
                    </span>
                    <button
                      onClick={() => alert(`💾 Downloading ${cert.title} PDF copy...`)}
                      className="bg-[#6E1E27] hover:bg-[#5A171F] text-white font-black text-[9px] uppercase tracking-wider py-2 px-3.5 rounded-xl transition-all cursor-pointer shadow-md shadow-[#6E1E27]/10"
                    >
                      Download PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
