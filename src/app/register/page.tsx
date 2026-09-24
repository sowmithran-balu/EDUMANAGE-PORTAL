"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GraduationCap, Mail, Lock, User, AlertCircle, Sparkles } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create account");
      }

      router.refresh();
      if (role === "student") router.push("/student");
      else if (role === "teacher") router.push("/teacher");
    } catch (err: any) {
      setError(err.message || "Failed to register. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-sky-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-md rounded-3xl p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-12 -left-12 w-40 h-40 bg-indigo-500/10 rounded-full blur-[60px] pointer-events-none" />

        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center space-x-2 mb-6">
            <div className="p-2 bg-indigo-600/20 rounded-xl border border-indigo-500/30">
              <GraduationCap className="h-6 w-6 text-indigo-400" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">Aether Academy</span>
          </Link>
          <h2 className="text-xl font-extrabold text-white text-center">Enroll in Academy</h2>
          <p className="text-xs text-slate-500 mt-1">Create an account to initialize your academic workspace.</p>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 flex items-center space-x-2 text-xs mb-5">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              type="button"
              onClick={() => setRole("student")}
              className={`py-3 rounded-xl border font-bold tracking-wide uppercase text-[10px] transition-all cursor-pointer ${
                role === "student"
                  ? "bg-indigo-600/20 border-indigo-500 text-indigo-400"
                  : "bg-slate-950/40 border-slate-800 text-slate-500 hover:text-slate-300"
              }`}
            >
              Student Role
            </button>
            <button
              type="button"
              onClick={() => setRole("teacher")}
              className={`py-3 rounded-xl border font-bold tracking-wide uppercase text-[10px] transition-all cursor-pointer ${
                role === "teacher"
                  ? "bg-indigo-600/20 border-indigo-500 text-indigo-400"
                  : "bg-slate-950/40 border-slate-800 text-slate-500 hover:text-slate-300"
              }`}
            >
              Teacher Role
            </button>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="name" className="font-semibold text-slate-300">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full glass-input rounded-xl py-3 pl-10 pr-4 text-xs font-medium"
                placeholder="Alex Mercer"
              />
            </div>
          </div>

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
                placeholder="alex@school.com"
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
            {loading ? <span>Enrolling Workspace...</span> : <span>Create Account</span>}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500">
          Already registered?{" "}
          <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
