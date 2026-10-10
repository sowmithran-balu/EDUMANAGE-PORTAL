"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  GraduationCap, Search, Download, ChevronDown, 
  LayoutDashboard, Users, Globe, BookOpen, Clock, 
  CreditCard, Award, FileText, Bell, Phone, HelpCircle, 
  Menu, X, Calendar, ShieldCheck, Cpu, Settings
} from "lucide-react";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface MainLayoutShellProps {
  user: UserData;
  children: React.ReactNode;
  rightPanel?: React.ReactNode;
}

export default function MainLayoutShell({ user, children, rightPanel }: MainLayoutShellProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const role = user.role; // student, teacher, admin
  const uppercaseRole = role.charAt(0).toUpperCase() + role.slice(1);

  // Left rail active sections based on URL path
  const isDashboardActive = pathname === `/${role}`;
  const isAcademicActive = pathname.includes("/progress") || pathname.includes("/classes") || pathname.includes("/courses");
  const isErpActive = pathname.includes("/fees") || pathname.includes("/placements") || pathname.includes("/library") || pathname.includes("/coding") || pathname.includes("/grievances");

  // Secondary sidebar links based on role
  const getSidebarLinks = () => {
    if (role === "student") {
      return [
        { label: "Dashboard", href: "/student", icon: LayoutDashboard },
        { label: "My Progress", href: "/student/progress", icon: Award },
        { label: "My Courses", href: "/student/courses", icon: BookOpen },
        { label: "Fees & Payments", href: "/student/fees", icon: CreditCard },
        { label: "Placement Cell", href: "/student/placements", icon: Users },
        { label: "Coding Sandbox", href: "/student/coding", icon: Cpu },
        { label: "Library Catalog", href: "/student/library", icon: BookOpen },
        { label: "Help desk Ticket", href: "/student/grievances", icon: HelpCircle },
        { label: "Settings", href: "/settings", icon: Settings },
      ];
    } else if (role === "teacher") {
      return [
        { label: "Dashboard", href: "/teacher", icon: LayoutDashboard },
        { label: "Advising Network", href: "/teacher#advising", icon: Users },
        { label: "Settings", href: "/settings", icon: Settings },
      ];
    } else {
      // admin
      return [
        { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { label: "System Reports", href: "/admin/reports", icon: FileText },
        { label: "Settings", href: "/settings", icon: Settings },
      ];
    }
  };

  const sidebarLinks = getSidebarLinks();

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] flex flex-col font-sans selection:bg-[#FCEEF0] selection:text-[#6E1E27]">
      {/* 1. TOP NAVBAR (sticky) */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs h-16 flex items-center justify-between px-6">
        {/* Left: Logo & Wordmark */}
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-slate-500 hover:text-slate-700 transition-colors mr-2 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          
          <Link href={`/${role}`} className="flex items-center space-x-2">
            <div className="p-1.5 bg-[#6E1E27] rounded-xl text-white">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="font-extrabold text-sm tracking-widest text-[#6E1E27] uppercase">EduManage Portal</span>
          </Link>
        </div>

        {/* Center: Search Bar with icon */}
        <div className="hidden md:flex items-center relative w-96 max-w-lg">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search Students, Courses, Fees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F7F7F9] border border-slate-200 rounded-xl pl-9 pr-12 py-2 text-xs focus:outline-none focus:border-[#6E1E27] transition-all"
          />
          <kbd className="absolute right-3 top-2.5 bg-white border border-slate-200 px-1.5 py-0.5 text-[9px] text-slate-400 rounded font-mono shadow-xs select-none">
            ⌘K
          </kbd>
        </div>

        {/* Right: Actions & User Avatar */}
        <div className="flex items-center space-x-4">
          <a
            href="https://example.com/app-download"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center space-x-1.5 bg-[#6E1E27] hover:bg-[#5A171F] text-white text-[10px] font-black uppercase tracking-wider px-3.5 py-2 rounded-xl transition-all shadow-md shadow-[#6E1E27]/10"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download App</span>
          </a>

          {/* User profile details */}
          <div className="flex items-center space-x-2.5 border-l border-slate-200 pl-4">
            <div className="h-8 w-8 bg-[#FCEEF0] rounded-full flex items-center justify-center border border-[#FCEEF0]/60 shrink-0">
              <span className="text-[#6E1E27] font-extrabold text-xs">{user.name.charAt(0)}</span>
            </div>
            <div className="hidden lg:block text-left truncate max-w-28">
              <p className="text-[11px] font-extrabold text-slate-900 truncate leading-none mb-1">{user.name}</p>
              <span className="inline-flex px-1.5 py-0.5 rounded-md bg-[#FCEEF0] text-[#6E1E27] text-[8px] font-black uppercase tracking-wider">
                {uppercaseRole}
              </span>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400 cursor-pointer hover:text-slate-600 transition-colors" />
          </div>
        </div>
      </header>

      <div className="flex-grow flex relative min-h-[calc(100vh-4rem)]">
        {/* 2. LEFT ICON RAIL (Desktop) */}
        <aside className="hidden lg:flex flex-col items-center w-[90px] shrink-0 bg-[#F7F7F9] border-r border-slate-200 py-6 space-y-6">
          <Link 
            href={`/${role}`}
            className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${
              isDashboardActive 
                ? "bg-[#6E1E27] text-white shadow-md shadow-[#6E1E27]/10" 
                : "text-slate-400 hover:text-[#6E1E27] hover:bg-[#FCEEF0]/40"
            }`}
          >
            <LayoutDashboard className="h-5 w-5 mb-1" />
            <span className="text-[8px] font-black uppercase tracking-wider">Dash</span>
          </Link>

          <Link 
            href={role === "student" ? "/student/progress" : `/${role}`}
            className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${
              isAcademicActive 
                ? "bg-[#6E1E27] text-white shadow-md shadow-[#6E1E27]/10" 
                : "text-slate-400 hover:text-[#6E1E27] hover:bg-[#FCEEF0]/40"
            }`}
          >
            <Award className="h-5 w-5 mb-1" />
            <span className="text-[8px] font-black uppercase tracking-wider">Academics</span>
          </Link>

          <Link 
            href={role === "student" ? "/student/fees" : `/${role}`}
            className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${
              isErpActive 
                ? "bg-[#6E1E27] text-white shadow-md shadow-[#6E1E27]/10" 
                : "text-slate-400 hover:text-[#6E1E27] hover:bg-[#FCEEF0]/40"
            }`}
          >
            <CreditCard className="h-5 w-5 mb-1" />
            <span className="text-[8px] font-black uppercase tracking-wider">ERP</span>
          </Link>
        </aside>

        {/* 3. SECONDARY SIDEBAR */}
        <aside className={`fixed inset-y-0 left-0 z-30 w-72 shrink-0 bg-white border-r border-slate-200 py-6 px-4 transform lg:translate-x-0 lg:static lg:block transition-transform duration-200 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
          <div className="space-y-6">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block px-3">
              Manage Portal
            </span>
            
            <nav className="space-y-1">
              {sidebarLinks.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                      isActive 
                        ? "bg-[#FCEEF0] text-[#6E1E27] font-bold" 
                        : "text-slate-500 hover:text-[#6E1E27] hover:bg-[#FCEEF0]/30"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-slate-200 pt-6">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block px-3 mb-2">
                Quick Access
              </span>
              <div className="space-y-1 text-xs">
                <Link href="/contact" className="flex items-center space-x-3 px-4 py-2 text-slate-500 hover:text-[#6E1E27] transition-all font-black uppercase tracking-wider">
                  <Phone className="h-4 w-4" />
                  <span>Support Center</span>
                </Link>
                <form action="/api/auth/logout" method="POST" className="w-full">
                  <button type="submit" className="w-full flex items-center space-x-3 px-4 py-2 text-slate-500 hover:text-red-600 transition-all font-black uppercase tracking-wider cursor-pointer text-left">
                    <X className="h-4 w-4 text-red-500" />
                    <span>Sign Out</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </aside>

        {/* 4. MAIN CONTENT AREA */}
        <main className="flex-grow min-w-0 bg-[#F7F7F9] p-6 lg:p-8 flex flex-col lg:flex-row gap-8 items-start">
          <div className="flex-grow w-full space-y-6">
            {children}
          </div>

          {/* 5. RIGHT SIDEBAR PANEL */}
          <aside className="w-full lg:w-80 shrink-0 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
            {rightPanel || (
              <>
                {/* At a Glance Summary */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-black text-slate-950 uppercase tracking-wider">At a Glance</h3>
                    <p className="text-[9px] text-slate-500 mt-0.5">Quick statistical indicators for this term.</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-center text-xs">
                    <div className="bg-[#F7F7F9] border border-slate-200 rounded-xl p-2.5">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Attendance</span>
                      <span className="text-sm font-extrabold text-[#6E1E27] mt-0.5 block">92%</span>
                    </div>
                    <div className="bg-[#F7F7F9] border border-slate-200 rounded-xl p-2.5">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Courses</span>
                      <span className="text-sm font-extrabold text-slate-800 mt-0.5 block">2 Active</span>
                    </div>
                    <div className="bg-[#F7F7F9] border border-slate-200 rounded-xl p-2.5 col-span-2">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Pending Tasks</span>
                      <span className="text-sm font-extrabold text-amber-600 mt-0.5 block">3 Submissions</span>
                    </div>
                  </div>
                </div>

                <hr className="border-slate-200" />

                {/* Today's Schedule */}
                <div className="space-y-3">
                  <div>
                    <h3 className="text-xs font-black text-slate-950 uppercase tracking-wider">Today's Schedule</h3>
                    <p className="text-[9px] text-slate-500 mt-0.5">Timeline of classes & labs.</p>
                  </div>

                  <div className="space-y-3 relative pl-3 border-l border-slate-200 ml-1">
                    <div className="relative text-[11px] leading-tight">
                      <div className="absolute -left-[17px] top-1 w-2.5 h-2.5 rounded-full bg-[#6E1E27] border-2 border-white" />
                      <span className="font-extrabold text-[#6E1E27] block">09:00 - 10:30</span>
                      <span className="text-slate-850 font-bold block mt-0.5">Data Structures & Alg.</span>
                      <span className="text-[9px] text-slate-400 block mt-0.5">Room 301 • Prof. Rostova</span>
                    </div>
                    <div className="relative text-[11px] leading-tight">
                      <div className="absolute -left-[17px] top-1 w-2.5 h-2.5 rounded-full bg-[#6E1E27] border-2 border-white" />
                      <span className="font-extrabold text-[#6E1E27] block">11:00 - 12:30</span>
                      <span className="text-slate-850 font-bold block mt-0.5">DBMS Lecture (Lab 2)</span>
                      <span className="text-[9px] text-slate-400 block mt-0.5">Room 202 • Block C</span>
                    </div>
                  </div>
                </div>

                <hr className="border-slate-200" />

                {/* Bulletins / Notice Feed */}
                <div className="space-y-3">
                  <div>
                    <h3 className="text-xs font-black text-slate-950 uppercase tracking-wider">Announcements</h3>
                    <p className="text-[9px] text-slate-500 mt-0.5">Recent updates from department HOD.</p>
                  </div>

                  <div className="space-y-2">
                    <div className="p-3 bg-[#FCEEF0]/65 border border-[#6E1E27]/10 rounded-xl text-[10px] leading-relaxed">
                      <p className="font-black text-[#6E1E27] uppercase tracking-wider text-[8px] mb-1">DSA Notice</p>
                      <p className="text-slate-700 font-semibold">Tomorrow's class will cover AVL Trees. Complete BST codes.</p>
                    </div>
                    <div className="p-3 bg-[#F7F7F9] border border-slate-200 rounded-xl text-[10px] leading-relaxed">
                      <p className="font-black text-slate-500 uppercase tracking-wider text-[8px] mb-1">ERP Billing</p>
                      <p className="text-slate-700 font-semibold">Syllabus details for B.Tech CS final term review is out.</p>
                    </div>
                  </div>
                </div>

                <hr className="border-slate-200" />

                {/* Notifications Panel */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-black text-slate-950 uppercase tracking-wider">Notifications</h3>
                      <p className="text-[9px] text-slate-500 mt-0.5">Incoming alerts for this student account.</p>
                    </div>
                    <span className="inline-flex px-1.5 py-0.5 bg-[#FCEEF0] text-[#6E1E27] border border-[#6E1E27]/25 text-[7px] font-black tracking-wide uppercase rounded-md shrink-0">
                      3 NEW
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    <div className="p-3 bg-white border border-slate-200 rounded-xl text-[10px] leading-relaxed hover:border-[#6E1E27]/30 transition-all flex items-start space-x-2.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#6E1E27] mt-1.5 shrink-0" />
                      <div>
                        <p className="font-black text-slate-850 uppercase tracking-wider text-[8px]">Exam Schedule Published</p>
                        <p className="text-slate-605 font-semibold mt-0.5">Final term exam timetable for Semester V is published. View dates in Exams tab.</p>
                        <span className="text-[7.5px] text-slate-400 font-bold block mt-1">10 minutes ago</span>
                      </div>
                    </div>

                    <div className="p-3 bg-white border border-slate-200 rounded-xl text-[10px] leading-relaxed hover:border-[#6E1E27]/30 transition-all flex items-start space-x-2.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#6E1E27] mt-1.5 shrink-0" />
                      <div>
                        <p className="font-black text-slate-850 uppercase tracking-wider text-[8px]">Library Book Alert</p>
                        <p className="text-slate-605 font-semibold mt-0.5">'Introduction to Algorithms' copy is cataloged. Please return by Aug 20.</p>
                        <span className="text-[7.5px] text-slate-400 font-bold block mt-1">2 hours ago</span>
                      </div>
                    </div>

                    <div className="p-3 bg-white border border-slate-200 rounded-xl text-[10px] leading-relaxed hover:border-[#6E1E27]/30 transition-all flex items-start space-x-2.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                      <div>
                        <p className="font-black text-slate-500 uppercase tracking-wider text-[8px]">Fee Gateway Cleared</p>
                        <p className="text-slate-605 font-semibold mt-0.5">Your Tuition Fee payment of ₹85,000 has been verified. Ledger statement cleared.</p>
                        <span className="text-[7.5px] text-slate-400 font-bold block mt-1">1 day ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </aside>
        </main>
      </div>
    </div>
  );
}
