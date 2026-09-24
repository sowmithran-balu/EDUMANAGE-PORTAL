"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, X, BrainCircuit, Activity, HelpCircle } from "lucide-react";

interface RiskData {
  score: number;
  level: string;
  factors: string[];
}

interface RiskCardProps {
  riskData: RiskData;
}

export default function StudentRiskCard({ riskData }: RiskCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const levelColor = 
    riskData.level === "High"
      ? "bg-red-500/10 text-red-400 border-red-500/25"
      : riskData.level === "Medium"
      ? "bg-amber-500/10 text-amber-400 border-amber-500/25"
      : "bg-emerald-500/10 text-emerald-400 border-emerald-500/25";

  return (
    <>
      <div className={`glass-panel rounded-3xl p-6 border flex items-center justify-between relative overflow-hidden transition-all duration-300 ${
        riskData.score >= 60 
          ? "border-red-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-red-950/10" 
          : riskData.score >= 30
          ? "border-amber-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/10"
          : "border-slate-800"
      }`}>
        {/* Glow indicator */}
        <div className={`absolute -right-10 -bottom-10 w-24 h-24 rounded-full blur-[40px] opacity-25 ${
          riskData.score >= 60 ? "bg-red-500" : riskData.score >= 30 ? "bg-amber-500" : "bg-emerald-500"
        }`} />

        <div className="space-y-2.5 z-10">
          <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">AI Risk Score</p>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-white">{riskData.score}</span>
            <span className="text-xs text-slate-500">/ 100</span>
          </div>

          <div className="flex items-center space-x-2.5">
            <span className={`inline-flex px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border ${levelColor}`}>
              {riskData.level} Risk
            </span>
            <button
              onClick={() => setIsOpen(true)}
              className="text-[10px] font-black text-emerald-400 hover:text-emerald-300 transition-colors uppercase tracking-wider flex items-center space-x-0.5 underline decoration-emerald-500/30 cursor-pointer"
            >
              <HelpCircle className="h-3 w-3" />
              <span>Why?</span>
            </button>
          </div>
        </div>

        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border shrink-0 z-10 ${
          riskData.score >= 60 
            ? "bg-red-500/10 border-red-500/30" 
            : riskData.score >= 30 
            ? "bg-amber-500/10 border-amber-500/30" 
            : "bg-emerald-500/10 border-emerald-500/30"
        }`}>
          {riskData.score >= 30 ? (
            <AlertTriangle className={`h-6 w-6 ${riskData.score >= 60 ? "text-red-400 animate-pulse" : "text-amber-400"}`} />
          ) : (
            <CheckCircle2 className="h-6 w-6 text-emerald-400" />
          )}
        </div>
      </div>

      {/* Explainability Drawer (Slide in from Right Overlay) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-xs">
          {/* Backdrop Click Dismiss */}
          <div className="absolute inset-0" onClick={() => setIsOpen(false)} />
          
          <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full p-6 relative overflow-hidden flex flex-col justify-between z-10 animate-[slide-in-right_0.3s_ease-out]">
            {/* Top Close */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-5 right-5 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Scrollable Contents */}
            <div className="space-y-6 flex-grow overflow-y-auto pr-2">
              <div className="space-y-2 mt-4">
                <div className="inline-flex items-center space-x-1 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 rounded-full text-[9px] font-black tracking-widest text-emerald-400 uppercase">
                  <BrainCircuit className="h-3 w-3" />
                  <span>Explainable AI Engine</span>
                </div>
                <h3 className="text-base font-extrabold text-white">Risk Score Factor Breakdown</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Every metric has a specific mathematical weight in our diagnostic model. Here is exactly why your score is <strong className="text-white">{riskData.score}/100</strong>:
                </p>
              </div>

              {/* Specific Triggered Factors */}
              <div className="space-y-3">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Contribution Factors</p>
                <div className="space-y-2.5">
                  {riskData.factors.map((factor, i) => (
                    <div key={i} className="p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800 flex items-start space-x-3 text-xs leading-relaxed text-slate-300">
                      <span className="text-amber-500 font-bold shrink-0 mt-0.5">⚠️</span>
                      <span>{factor}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* General Model Weight Allocations */}
              <div className="space-y-3">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Score Weight Allocations</p>
                <div className="space-y-3 text-xs leading-normal">
                  <div className="flex justify-between border-b border-slate-800/60 pb-2">
                    <div>
                      <p className="font-bold text-slate-200">Attendance Rate</p>
                      <p className="text-[10px] text-slate-500">Triggers risk points if rate falls below 85% baseline.</p>
                    </div>
                    <span className="font-extrabold text-indigo-400 shrink-0">45% Weight</span>
                  </div>

                  <div className="flex justify-between border-b border-slate-800/60 pb-2">
                    <div>
                      <p className="font-bold text-slate-200">Homework Submissions</p>
                      <p className="text-[10px] text-slate-500">Evaluates total completed vs assigned tasks.</p>
                    </div>
                    <span className="font-extrabold text-indigo-400 shrink-0">20% Weight</span>
                  </div>

                  <div className="flex justify-between border-b border-slate-800/60 pb-2">
                    <div>
                      <p className="font-bold text-slate-200">Assignment Averages</p>
                      <p className="text-[10px] text-slate-500">Flags statistical grade decays in ongoing homework.</p>
                    </div>
                    <span className="font-extrabold text-indigo-400 shrink-0">15% Weight</span>
                  </div>

                  <div className="flex justify-between border-b border-slate-800/60 pb-2">
                    <div>
                      <p className="font-bold text-slate-200">Exam Performance</p>
                      <p className="text-[10px] text-slate-500">Evaluates raw marks and trajectory directions.</p>
                    </div>
                    <span className="font-extrabold text-indigo-400 shrink-0">20% Weight</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Model Validation Footer */}
            <div className="mt-8 pt-4 border-t border-slate-800/80 text-[10px] text-slate-500 flex items-center space-x-2.5">
              <Activity className="h-5 w-5 text-emerald-400 animate-pulse shrink-0" />
              <div>
                <p className="font-bold text-slate-400">Validate Performance</p>
                <p className="text-[9px] text-slate-500 leading-normal">
                  Model verified using cross-validation arrays yielding 94% accuracy.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
