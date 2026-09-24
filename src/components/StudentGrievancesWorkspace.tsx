"use client";

import { useState } from "react";
import { HelpCircle, AlertTriangle, FileText, Send, CheckCircle2, RefreshCw } from "lucide-react";

interface GrievanceData {
  id: string;
  category: string;
  description: string;
  status: string;
  resolution: string | null;
  createdAt: Date;
}

interface GrievancesProps {
  initialGrievances: GrievanceData[];
}

export default function StudentGrievancesWorkspace({ initialGrievances }: GrievancesProps) {
  const [grievances, setGrievances] = useState<GrievanceData[]>(initialGrievances);
  const [category, setCategory] = useState("hostel");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      alert("Please provide a description of the issue.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/student/grievances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, description }),
      });
      const data = await res.json();

      if (!res.ok) {
        alert(`❌ Error lodging grievance: ${data.error}`);
        return;
      }

      alert("🎟️ Grievance Ticket Raised!\nOur support staff has been notified.");
      setGrievances((prev) => [
        {
          id: data.grievance.id,
          category,
          description,
          status: "pending",
          resolution: null,
          createdAt: new Date(),
        },
        ...prev,
      ]);
      setDescription("");
    } catch {
      alert("Ticket transaction failed. Please retry.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {/* Lodge Ticket Form (Col-span 1) */}
      <div className="lg:col-span-1 space-y-6">
        <div className="glass-panel rounded-3xl p-6 border border-slate-900">
          <h2 className="text-sm font-bold text-white mb-6 flex items-center space-x-2">
            <HelpCircle className="h-4 w-4 text-emerald-400" />
            <span>Raise Support Ticket</span>
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Category Select */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-400 uppercase tracking-widest text-[9px]">Concern Area</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full glass-input rounded-xl py-2 px-3 focus:outline-none"
              >
                <option value="hostel">Hostel & Housing</option>
                <option value="academics">Academics & Syllabus</option>
                <option value="finance">Finance & Fees</option>
                <option value="infrastructure">Infrastructure & Labs</option>
              </select>
            </div>

            {/* Description Textarea */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-400 uppercase tracking-widest text-[9px]">Grievance Details</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain the issue in detail..."
                className="w-full h-32 glass-input rounded-xl p-3 focus:outline-none resize-none leading-relaxed"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-600/50 text-white font-bold text-[10px] uppercase tracking-wider py-3 rounded-xl transition-all cursor-pointer shadow-lg shadow-emerald-600/15"
            >
              <Send className="h-3.5 w-3.5" />
              <span>{submitting ? "Lodging Ticket..." : "Submit Grievance"}</span>
            </button>
          </form>
        </div>
      </div>

      {/* Ticket history tracker (Col-span 2) */}
      <div className="lg:col-span-2 space-y-6">
        <div className="glass-panel rounded-3xl p-6 border border-slate-900">
          <h2 className="text-sm font-bold text-white mb-6 flex items-center space-x-2">
            <FileText className="h-4 w-4 text-indigo-400" />
            <span>Support Ticket History</span>
          </h2>

          <div className="space-y-4">
            {grievances.length === 0 ? (
              <p className="text-slate-500 text-xs py-4 text-center">No grievance tickets raised yet.</p>
            ) : (
              grievances.map((ticket) => (
                <div key={ticket.id} className="p-4 bg-slate-950/40 rounded-2xl border border-slate-850 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-850/60 pb-2">
                    <div>
                      <span className="font-bold text-white text-xs capitalize">{ticket.category} Ticket</span>
                      <p className="text-[9px] text-slate-500 mt-0.5">Lodged: {new Date(ticket.createdAt).toLocaleDateString()}</p>
                    </div>
                    {/* Status Badge */}
                    <span className={`inline-flex px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wider border ${
                      ticket.status === "resolved"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : ticket.status === "investigating"
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        : "bg-slate-800 text-slate-400 border-slate-700/50"
                    }`}>
                      {ticket.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {ticket.description}
                  </p>

                  {/* Resolution Notes */}
                  {ticket.resolution && (
                    <div className="p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10 text-[10px] text-emerald-400 leading-relaxed flex items-start space-x-2">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                      <div>
                        <strong className="text-white font-bold block mb-0.5">IT/Support Resolution Note:</strong>
                        <span>"{ticket.resolution}"</span>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
