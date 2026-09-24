"use client";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from "recharts";

interface ChartDataPoint {
  name: string;
  score: number;
}

interface DeviationDataPoint {
  subject: string;
  average: number;
  deviation: number;
}

interface ChartsProps {
  gradeHistory: ChartDataPoint[];
  deviations: DeviationDataPoint[];
}

export default function StudentProgressCharts({ gradeHistory, deviations }: ChartsProps) {
  // Format tooltips for dark UI
  const tooltipStyle = {
    backgroundColor: "#0f172a",
    borderColor: "#1e293b",
    color: "#f8fafc",
    borderRadius: "12px",
    fontSize: "11px",
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Grade Trajectory (Line Chart) */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-900 h-96 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-white text-sm">Exam Score Trajectory</h3>
          <p className="text-[10px] text-slate-500 mt-1">Chronological trend of raw exam percentage marks</p>
        </div>

        <div className="flex-grow w-full h-64 mt-4">
          {gradeHistory.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-slate-500">
              No exam results recorded.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={gradeHistory} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={9} />
                <YAxis domain={[0, 100]} stroke="#64748b" fontSize={9} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#10b981"
                  strokeWidth={3}
                  activeDot={{ r: 6 }}
                  dot={{ r: 4, stroke: "#10b981", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Subject Deviations (Bar Chart) */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-900 h-96 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-white text-sm">Subject Performance Deviations</h3>
          <p className="text-[10px] text-slate-500 mt-1">Subject average compared against your overall academic baseline</p>
        </div>

        <div className="flex-grow w-full h-64 mt-4">
          {deviations.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-slate-500">
              Consistent performance across all courses.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deviations} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="subject" stroke="#64748b" fontSize={8} />
                <YAxis domain={[-30, 30]} stroke="#64748b" fontSize={9} />
                <Tooltip contentStyle={tooltipStyle} />
                <ReferenceLine y={0} stroke="#475569" strokeWidth={1.5} />
                <Bar
                  dataKey="deviation"
                  fill="#14b8a6"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={35}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
