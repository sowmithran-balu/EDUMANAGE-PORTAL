import Link from "next/link";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { GraduationCap, ArrowRight, LayoutDashboard, LogIn } from "lucide-react";

async function getSessionUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("edu_portal_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionUser();

  const dashboardRoute = session
    ? session.role === "student"
      ? "/student"
      : session.role === "teacher"
      ? "/teacher"
      : "/admin"
    : "/login";

  return (
    <div className="flex flex-col min-h-screen bg-[#0b0f19] text-slate-100">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-[#0b0f19]/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="p-2 bg-indigo-600/20 rounded-xl border border-indigo-500/30">
              <GraduationCap className="h-6 w-6 text-indigo-400" />
            </div>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-indigo-400 to-sky-400 bg-clip-text text-transparent">
              Aether Academy
            </span>
          </Link>

          <nav className="hidden md:flex space-x-8 text-sm font-medium">
            <Link href="/" className="text-slate-300 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/courses" className="text-slate-300 hover:text-white transition-colors">
              Courses
            </Link>
            <Link href="/contact" className="text-slate-300 hover:text-white transition-colors">
              Contact & Support
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {session ? (
              <Link
                href={dashboardRoute}
                className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 px-4 py-2.5 rounded-xl border border-indigo-500/30 transition-all duration-250 cursor-pointer"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="text-xs font-semibold text-slate-300 hover:text-white px-4 py-2 hover:bg-slate-800/40 rounded-xl transition-all"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white px-4 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 cursor-pointer"
                >
                  <span>Enroll</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col">{children}</main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between text-sm text-slate-500">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <GraduationCap className="h-5 w-5 text-indigo-500" />
            <span className="font-semibold text-slate-400">Aether Academy</span>
            <span className="text-xs">© 2026. All rights reserved.</span>
          </div>
          <div className="flex space-x-6">
            <Link href="/courses" className="hover:text-slate-300 transition-colors">Explore Courses</Link>
            <Link href="/contact" className="hover:text-slate-300 transition-colors">Support Center</Link>
            <Link href="/login" className="hover:text-slate-300 transition-colors">Workspace Access</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
