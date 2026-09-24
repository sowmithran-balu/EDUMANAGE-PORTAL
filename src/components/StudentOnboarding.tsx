"use client";

import { useState, useEffect } from "react";
import { Sparkles, BrainCircuit, X, ArrowRight, LayoutDashboard } from "lucide-react";

export default function StudentOnboarding() {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("has_seen_student_onboarding");
    if (!hasSeenOnboarding) {
      setShow(true);
    }
  }, []);

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      localStorage.setItem("has_seen_student_onboarding", "true");
      setShow(false);
    }
  };

  const handleClose = () => {
    localStorage.setItem("has_seen_student_onboarding", "true");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm px-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden ai-glow">
        {/* Top Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Dynamic step content */}
        <div className="text-center py-4">
          {step === 1 && (
            <div className="space-y-4">
              <div className="h-14 w-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center border border-indigo-500/30 mx-auto">
                <LayoutDashboard className="h-7 w-7 text-indigo-400" />
              </div>
              <h3 className="text-lg font-bold text-white">1. Welcome to Aether Academy!</h3>
              <p className="text-xs text-slate-400 leading-relaxed px-2">
                This is your student workspace. Here you can track your courses, submit assignments, and review grades dynamically.
              </p>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="h-14 w-14 bg-sky-500/20 rounded-2xl flex items-center justify-center border border-sky-500/30 mx-auto">
                <BrainCircuit className="h-7 w-7 text-sky-400" />
              </div>
              <h3 className="text-lg font-bold text-white">2. Meet Your AI Academic Coach</h3>
              <p className="text-xs text-slate-400 leading-relaxed px-2">
                On the right side of your dashboard, your AI Coach reads your attendance patterns and assignment scores to generate custom study plans.
              </p>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="h-14 w-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center border border-emerald-500/30 mx-auto">
                <Sparkles className="h-7 w-7 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-white">3. Real-Time Risk Diagnostics</h3>
              <p className="text-xs text-slate-400 leading-relaxed px-2">
                If your attendance drops or homework is missed, the AI Engine calculates your risk score. Check "My Progress" for detailed subject-level trend lines.
              </p>
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className="mt-8 flex items-center justify-between border-t border-slate-800/80 pt-4 text-xs font-semibold">
          <div className="flex space-x-1.5">
            <span className={`h-1.5 w-1.5 rounded-full ${step === 1 ? "bg-indigo-400" : "bg-slate-700"}`} />
            <span className={`h-1.5 w-1.5 rounded-full ${step === 2 ? "bg-indigo-400" : "bg-slate-700"}`} />
            <span className={`h-1.5 w-1.5 rounded-full ${step === 3 ? "bg-indigo-400" : "bg-slate-700"}`} />
          </div>

          <button
            onClick={handleNext}
            className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl transition-all uppercase tracking-wider text-[10px] cursor-pointer"
          >
            <span>{step === 3 ? "Get Started" : "Continue"}</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
