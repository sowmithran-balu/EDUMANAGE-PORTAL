"use client";

import { useState } from "react";
import { Code2, Play, Terminal, CheckCircle2, XCircle, BrainCircuit } from "lucide-react";

interface CodingAssignmentData {
  id: string;
  title: string;
  description: string;
  starterCode: string;
  className: string;
  latestSubmission: {
    id: string;
    code: string;
    status: string;
    compileOutput: string | null;
  } | null;
}

interface SandboxProps {
  initialAssignments: CodingAssignmentData[];
}

export default function StudentCodingSandbox({ initialAssignments }: SandboxProps) {
  const [assignments, setAssignments] = useState<CodingAssignmentData[]>(initialAssignments);
  const [selectedId, setSelectedId] = useState<string | null>(
    assignments.length > 0 ? assignments[0].id : null
  );

  const activeAsg = assignments.find((a) => a.id === selectedId);

  // Editor code state (initialized based on selection)
  const [codeMap, setCodeMap] = useState<{ [id: string]: string }>(() => {
    const map: { [id: string]: string } = {};
    initialAssignments.forEach((a) => {
      map[a.id] = a.latestSubmission?.code || a.starterCode;
    });
    return map;
  });

  const [loading, setLoading] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<string>("");
  const [testResults, setTestResults] = useState<any[]>([]);
  const [statusText, setStatusText] = useState<string>("");

  const activeCode = activeAsg ? codeMap[activeAsg.id] : "";

  const handleCodeChange = (val: string) => {
    if (!activeAsg) return;
    setCodeMap({ ...codeMap, [activeAsg.id]: val });
  };

  const handleRunTests = async () => {
    if (!activeAsg) return;
    setLoading(true);
    setConsoleOutput("");
    setTestResults([]);
    setStatusText("");

    try {
      const res = await fetch("/api/student/coding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignmentId: activeAsg.id,
          code: codeMap[activeAsg.id],
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Execution failed");

      setConsoleOutput(data.compileOutput);
      setTestResults(data.testResults || []);
      setStatusText(data.status);

      // Update assignment local state
      setAssignments((prev) =>
        prev.map((a) => {
          if (a.id === activeAsg.id) {
            return {
              ...a,
              latestSubmission: {
                id: Math.random().toString(),
                code: codeMap[activeAsg.id],
                status: data.status,
                compileOutput: data.compileOutput,
              },
            };
          }
          return a;
        })
      );
    } catch (err: any) {
      setConsoleOutput(`Error: ${err.message}`);
      setStatusText("failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {/* Sidebar - Challenges list */}
      <div className="lg:col-span-1 glass-panel rounded-3xl p-6 border border-slate-900 space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center space-x-2">
          <Code2 className="h-4 w-4 text-emerald-400" />
          <span>Select Challenge</span>
        </h2>
        <p className="text-[10px] text-slate-500">Pick an assignment and evaluate compiler outcomes.</p>

        {assignments.length === 0 ? (
          <p className="text-slate-500 text-xs py-4 text-center">No active coding assignments.</p>
        ) : (
          <div className="space-y-2">
            {assignments.map((asg) => {
              const status = asg.latestSubmission?.status || "unsubmitted";
              return (
                <button
                  key={asg.id}
                  onClick={() => {
                    setSelectedId(asg.id);
                    setConsoleOutput(asg.latestSubmission?.compileOutput || "");
                    setTestResults([]);
                    setStatusText(asg.latestSubmission?.status || "");
                  }}
                  className={`w-full p-4 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                    selectedId === asg.id
                      ? "bg-emerald-600/15 border-emerald-500 text-emerald-400 font-bold"
                      : "bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <div className="flex items-start justify-between w-full">
                    <div>
                      <p className="text-xs text-white font-semibold line-clamp-1">{asg.title}</p>
                      <p className="text-[9px] text-slate-500 mt-1">{asg.className}</p>
                    </div>
                    <span className={`inline-flex px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wider shrink-0 ${
                      status === "passed"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : status === "failed"
                        ? "bg-red-500/10 text-red-400 border border-red-500/20"
                        : "bg-slate-800 text-slate-400 border border-slate-700/50"
                    }`}>
                      {status}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Code Editor Workspace */}
      <div className="lg:col-span-2 space-y-6">
        {activeAsg ? (
          <div className="glass-panel rounded-3xl p-6 border border-slate-900 space-y-6">
            {/* Header */}
            <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">{activeAsg.title}</h2>
                <p className="text-[10px] text-slate-500 mt-0.5">{activeAsg.className} • Coding Homework</p>
              </div>

              <button
                onClick={handleRunTests}
                disabled={loading}
                className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-600/50 text-white font-bold text-[10px] uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-lg shadow-emerald-600/10"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>{loading ? "Compiling..." : "Run Tests"}</span>
              </button>
            </div>

            {/* Description instructions */}
            <div className="p-4 bg-slate-950/40 rounded-2xl border border-slate-850 text-xs text-slate-300 leading-relaxed">
              <p className="font-bold text-white mb-1 flex items-center space-x-1.5">
                <BrainCircuit className="h-4 w-4 text-emerald-400" />
                <span>Instructions</span>
              </p>
              <p>{activeAsg.description}</p>
            </div>

            {/* Monaco-like Text Editor */}
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">JavaScript Code Editor</p>
              <div className="relative rounded-2xl overflow-hidden border border-slate-850 bg-[#0d1117] font-mono text-xs">
                {/* Editor Bar */}
                <div className="bg-[#161b22] px-4 py-2 text-[9px] text-slate-500 font-bold uppercase tracking-wider border-b border-slate-850/80 flex items-center justify-between">
                  <span>index.js</span>
                  <span className="text-emerald-400">active compiler</span>
                </div>
                {/* Editor Textarea */}
                <textarea
                  value={activeCode}
                  onChange={(e) => handleCodeChange(e.target.value)}
                  className="w-full h-64 bg-transparent text-[#e1e4e8] p-4 focus:outline-none resize-none leading-relaxed select-text"
                  spellCheck={false}
                  placeholder="function solve() { ... }"
                />
              </div>
            </div>

            {/* Console Output Window */}
            <div className="space-y-2">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center space-x-1.5">
                <Terminal className="h-3.5 w-3.5" />
                <span>Execution Console</span>
              </h3>

              <div className="bg-slate-950/80 border border-slate-850 rounded-2xl p-4 font-mono text-[11px] leading-relaxed min-h-24">
                {consoleOutput ? (
                  <pre className={`whitespace-pre-wrap ${statusText === "passed" ? "text-emerald-400" : "text-red-400"}`}>
                    {consoleOutput}
                  </pre>
                ) : (
                  <p className="text-slate-600">Press 'Run Tests' to execute compiler solutions.</p>
                )}

                {/* Test results grid details */}
                {testResults.length > 0 && (
                  <div className="mt-4 border-t border-slate-800/80 pt-4 space-y-2">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Test Outputs Summary</p>
                    <div className="grid grid-cols-1 gap-2">
                      {testResults.map((tc) => (
                        <div
                          key={tc.testCase}
                          className={`p-2.5 rounded-xl border flex items-center justify-between ${
                            tc.passed
                              ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400"
                              : "bg-red-500/5 border-red-500/20 text-red-400"
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            {tc.passed ? (
                              <CheckCircle2 className="h-4 w-4 shrink-0" />
                            ) : (
                              <XCircle className="h-4 w-4 shrink-0" />
                            )}
                            <span className="font-bold text-[10px]">Test Case {tc.testCase}</span>
                            <span className="text-slate-500 text-[9px]">(Input: {tc.input})</span>
                          </div>
                          <div className="text-right text-[10px]">
                            <span>Expected: {tc.expected} | Actual: {tc.actual}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="glass-panel rounded-3xl p-16 text-center border border-slate-900 text-slate-500 text-xs">
            No assignment selection made.
          </div>
        )}
      </div>
    </div>
  );
}
