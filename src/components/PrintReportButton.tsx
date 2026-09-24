"use client";

import { Printer } from "lucide-react";

export default function PrintReportButton() {
  return (
    <button
      onClick={() => {
        if (typeof window !== "undefined") window.print();
      }}
      className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider bg-[#6E1E27] hover:bg-[#5A171F] text-white px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-md shadow-[#6E1E27]/10"
    >
      <Printer className="h-4 w-4" />
      <span>Print Report</span>
    </button>
  );
}
