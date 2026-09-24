"use client";

import { useState } from "react";
import { Briefcase, MapPin, DollarSign, Award, CheckCircle2, ChevronRight, AlertCircle } from "lucide-react";

interface JobData {
  id: string;
  company: string;
  role: string;
  package: string;
  eligibilityCgpa: number;
  location: string;
}

interface ApplicationData {
  id: string;
  jobId: string;
  round: string;
  feedback: string | null;
  job: JobData;
}

interface PlacementsProps {
  jobs: JobData[];
  initialApplications: ApplicationData[];
  studentCgpa: number;
}

export default function StudentPlacementsWorkspace({ jobs, initialApplications, studentCgpa }: PlacementsProps) {
  const [applications, setApplications] = useState<ApplicationData[]>(initialApplications);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleApply = async (job: JobData) => {
    setLoadingId(job.id);
    try {
      const res = await fetch("/api/student/placements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: job.id }),
      });
      const data = await res.json();

      if (!res.ok) {
        alert(`❌ Error applying: ${data.error}`);
        return;
      }

      // Success
      alert(`🎉 Application Submitted!\nYou have successfully applied to ${job.company}.`);
      setApplications((prev) => [
        {
          id: data.application.id,
          jobId: job.id,
          round: "applied",
          feedback: "Application submitted. Undergoing resume screening.",
          job,
        },
        ...prev,
      ]);
    } catch {
      alert("Application transaction failed. Please try again.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {/* Active Jobs Board (Col-span 2) */}
      <div className="lg:col-span-2 space-y-6">
        <div className="glass-panel rounded-3xl p-6 border border-slate-900">
          <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center space-x-2">
                <Briefcase className="h-4 w-4 text-emerald-400" />
                <span>Active Recruitment Drives</span>
              </h2>
              <p className="text-[10px] text-slate-500 mt-1">Review companies, salaries, and threshold parameters.</p>
            </div>
            {/* CGPA Badge */}
            <span className="inline-flex px-3 py-1 rounded-xl bg-slate-950 text-slate-300 text-[10px] font-bold border border-slate-850">
              Your CGPA: {studentCgpa}
            </span>
          </div>

          {jobs.length === 0 ? (
            <p className="text-slate-500 text-xs py-4 text-center">No active recruitment drives at this time.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobs.map((job) => {
                const hasApplied = applications.some((app) => app.jobId === job.id);
                const isEligible = studentCgpa >= job.eligibilityCgpa;

                return (
                  <div
                    key={job.id}
                    className="p-5 bg-slate-950/40 rounded-2xl border border-slate-900 hover:border-slate-850 transition-all flex flex-col justify-between h-56 relative overflow-hidden"
                  >
                    {/* Glow status */}
                    <div className={`absolute -right-12 -bottom-12 w-24 h-24 rounded-full blur-[40px] opacity-15 ${
                      hasApplied ? "bg-indigo-500" : isEligible ? "bg-emerald-500" : "bg-red-500"
                    }`} />

                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-white text-sm">{job.company}</h3>
                          <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">{job.role}</p>
                        </div>
                        {/* Package Badge */}
                        <span className="text-[10px] font-bold text-slate-300 bg-slate-900 border border-slate-850/60 px-2 py-0.5 rounded-lg flex items-center space-x-0.5">
                          <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
                          <span>{job.package}</span>
                        </span>
                      </div>

                      <div className="mt-4 space-y-1.5 text-[10px] text-slate-400">
                        <div className="flex items-center space-x-1.5">
                          <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <Award className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                          <span>Required CGPA: {job.eligibilityCgpa}+</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 border-t border-slate-900/60 pt-3 flex items-center justify-between w-full z-10">
                      {/* Eligibility check */}
                      {hasApplied ? (
                        <span className="text-[10px] font-bold text-indigo-400 flex items-center space-x-1 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-lg">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Applied</span>
                        </span>
                      ) : isEligible ? (
                        <span className="text-[9px] font-extrabold text-emerald-400 uppercase tracking-wider bg-emerald-500/5 border border-emerald-500/10 px-2 py-0.5 rounded-md">
                          Eligible
                        </span>
                      ) : (
                        <span className="text-[9px] font-extrabold text-red-400 uppercase tracking-wider bg-red-500/5 border border-red-500/10 px-2 py-0.5 rounded-md flex items-center space-x-0.5">
                          <AlertCircle className="h-3 w-3 shrink-0" />
                          <span>Ineligible</span>
                        </span>
                      )}

                      {/* Apply trigger */}
                      {!hasApplied && (
                        <button
                          onClick={() => handleApply(job)}
                          disabled={!isEligible || loadingId === job.id}
                          className={`font-bold text-[9px] uppercase tracking-wider py-2 px-4 rounded-xl transition-all cursor-pointer ${
                            isEligible
                              ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/15"
                              : "bg-slate-800 text-slate-500 border border-slate-700/50 cursor-not-allowed"
                          }`}
                        >
                          {loadingId === job.id ? "Applying..." : "Apply Now"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Applications Tracking Column (Col-span 1) */}
      <div className="lg:col-span-1 space-y-6">
        <div className="glass-panel rounded-3xl p-6 border border-slate-900">
          <h2 className="text-sm font-bold text-white mb-6 flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4 text-indigo-400" />
            <span>Applications Tracker</span>
          </h2>

          <div className="space-y-4">
            {applications.length === 0 ? (
              <div className="p-6 bg-slate-950/40 rounded-2xl border border-slate-900 text-center text-xs text-slate-500">
                You have not applied to any job drives.
              </div>
            ) : (
              applications.map((app) => (
                <div key={app.id} className="p-4 bg-slate-950/40 rounded-2xl border border-slate-850 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-850/60 pb-2 mb-2">
                    <div>
                      <p className="font-bold text-white text-xs">{app.job.company}</p>
                      <p className="text-[9px] text-slate-500">{app.job.role}</p>
                    </div>
                    {/* Pipeline Round Badge */}
                    <span className={`inline-flex px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wider ${
                      app.round === "selected"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : app.round === "rejected"
                        ? "bg-red-500/10 text-red-400 border border-red-500/20"
                        : "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                    }`}>
                      {app.round}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed italic">
                    "{app.feedback || "Application processed under general review."}"
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
