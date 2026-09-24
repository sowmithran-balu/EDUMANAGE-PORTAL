"use client";

import { useState } from "react";
import { Mail, ShieldAlert, CheckCircle2 } from "lucide-react";

interface CoPilotActionsProps {
  studentName: string;
}

export default function TeacherCoPilotActions({ studentName }: CoPilotActionsProps) {
  const [notified, setNotified] = useState(false);
  const [flagged, setFlagged] = useState(false);

  const handleNotify = () => {
    setNotified(true);
    alert(`⚡ AI Notification Dispatched:\n\nSent to ${studentName} & parent contact. Includes targeted study action plan for focus topics.`);
    setTimeout(() => setNotified(false), 3000);
  };

  const handleFlag = () => {
    setFlagged(true);
    alert(`🛡️ Counselor Flag Registered:\n\n${studentName} added to counselor review queue. Priority academic profile context compiled automatically.`);
    setTimeout(() => setFlagged(false), 3000);
  };

  return (
    <div className="flex items-center space-x-2 pt-2 border-t border-slate-900/60 text-[9px] font-bold uppercase tracking-wider">
      <button
        onClick={handleNotify}
        disabled={notified}
        className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
          notified
            ? "bg-emerald-600/10 border-emerald-500 text-emerald-400 font-bold"
            : "bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-400 hover:text-slate-300"
        }`}
      >
        <Mail className="h-3.5 w-3.5 text-indigo-400" />
        <span>{notified ? "Notified" : "Notify Student"}</span>
      </button>

      <button
        onClick={handleFlag}
        disabled={flagged}
        className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
          flagged
            ? "bg-red-600/10 border-red-500 text-red-400 font-bold"
            : "bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-400 hover:text-slate-300"
        }`}
      >
        <ShieldAlert className="h-3.5 w-3.5 text-amber-500" />
        <span>{flagged ? "Flagged" : "Flag Counselor"}</span>
      </button>
    </div>
  );
}
