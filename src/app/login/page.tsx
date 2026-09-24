"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { GraduationCap, Lock, Mail, AlertCircle, Sparkles } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const from = searchParams.get("from") || "";

  // Dynamic login helpers based on seeded database profiles
  const handleAutoFill = (role: "student" | "teacher" | "admin") => {
    if (role === "student") {
      setEmail("sarah@school.com"); // Sarah (At-Risk student example)
      setPassword("student123");
    } else if (role === "teacher") {
      setEmail("teacher@school.com");
      setPassword("teacher123");
    } else {
      setEmail("admin@school.com");
      setPassword("admin123");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to log in");
      }

      if (data.user.role === "admin") {
        // Intercept Admin log-in for 2FA requirement
        setShowTwoFactor(true);
        setLoading(false);
      } else {
        // Direct routing for Students and Teachers
        router.refresh();
        if (from) {
          router.push(from);
        } else {
          router.push(data.user.role === "student" ? "/student" : "/teacher");
        }
      }
    } catch (err: any) {
      setError(err.message || "Invalid credentials.");
      setLoading(false);
    }
  };

  const handleVerifyTwoFactor = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // TOTP validation (live-demo safe: code is 123456)
    if (twoFactorCode === "123456") {
      router.refresh();
      router.push("/admin");
    } else {
      setError("Invalid 2FA authentication code. Try '123456'.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-md rounded-3xl p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute -top-12 -left-12 w-40 h-40 bg-indigo-500/10 rounded-full blur-[60px] pointer-events-none" />

      {showTwoFactor ? (
        /* 2FA Panel */
        <div>
          <div className="flex flex-col items-center mb-8">
            <div className="p-2 bg-purple-600/20 rounded-xl border border-purple-500/30 mb-6">
              <Lock className="h-6 w-6 text-purple-400 animate-pulse" />
            </div>
            <h2 className="text-xl font-extrabold text-white text-center">2FA Security Check</h2>
            <p className="text-xs text-slate-500 mt-1 text-center">
              An administrator login requires a 2-factor verification code.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 flex items-center space-x-2 text-xs mb-5">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleVerifyTwoFactor} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label htmlFor="totp" className="font-semibold text-slate-300">Authentication Code</label>
              <input
                id="totp"
                type="text"
                required
                maxLength={6}
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value)}
                className="w-full glass-input rounded-xl py-3 px-4 text-center text-lg font-bold tracking-widest"
                placeholder="000000"
              />
              <p className="text-[10px] text-indigo-400 mt-1.5 text-center">
                💡 Demo Mode: enter <strong>123456</strong> to verify.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center bg-purple-600 hover:bg-purple-500 disabled:bg-purple-600/50 text-white font-semibold py-3.5 rounded-xl transition-all uppercase tracking-wider cursor-pointer"
            >
              Verify & Enter
            </button>
          </form>

          <button
            onClick={() => setShowTwoFactor(false)}
            className="w-full text-center text-[10px] font-bold text-slate-500 hover:text-slate-300 uppercase tracking-wider mt-6 cursor-pointer"
          >
            ← Back to Credentials
          </button>
        </div>
      ) : (
        /* Normal Credentials Login */
        <div>
          <div className="flex flex-col items-center mb-8">
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <div className="p-2 bg-indigo-600/20 rounded-xl border border-indigo-500/30">
                <GraduationCap className="h-6 w-6 text-indigo-400" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">Aether Academy</span>
            </Link>
            <h2 className="text-xl font-extrabold text-white text-center">Sign in to Workspace</h2>
            <p className="text-xs text-slate-500 mt-1">Enter your credentials to access learning modules.</p>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 flex items-center space-x-2 text-xs mb-5">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label htmlFor="email" className="font-semibold text-slate-300">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full glass-input rounded-xl py-3 pl-10 pr-4 text-xs font-medium"
                  placeholder="name@school.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="font-semibold text-slate-300">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full glass-input rounded-xl py-3 pl-10 pr-4 text-xs font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white font-semibold py-3.5 rounded-xl transition-all uppercase tracking-wider cursor-pointer"
            >
              {loading ? <span>Authenticating...</span> : <span>Sign In</span>}
            </button>
          </form>

          {/* Auto-fill Helper Chips */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 text-center">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">
              ⚡ Auto-fill Seed Profiles
            </p>
            <div className="flex items-center justify-center space-x-2 text-[10px]">
              <button
                onClick={() => handleAutoFill("student")}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700/50 cursor-pointer"
              >
                Sarah (Student)
              </button>
              <button
                onClick={() => handleAutoFill("teacher")}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700/50 cursor-pointer"
              >
                Elena (Teacher)
              </button>
              <button
                onClick={() => handleAutoFill("admin")}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700/50 cursor-pointer"
              >
                Arthur (Admin)
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-slate-500">
            New enrollee?{" "}
            <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold">
              Create account
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background glow loops */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-sky-500/5 rounded-full blur-[100px] pointer-events-none" />
      
      <Suspense fallback={<div className="text-sm font-semibold text-slate-400">Loading auth environment...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
