import React from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const qualityData = [
  { time: "09:00", quality: 88 },
  { time: "10:00", quality: 92 },
  { time: "11:00", quality: 85 },
  { time: "12:00", quality: 94 },
  { time: "13:00", quality: 91 },
];

const latencyData = [
  { name: "09:00", retrieval: 120, llm: 650, eval: 40 },
  { name: "10:00", retrieval: 95, llm: 580, eval: 35 },
  { name: "11:00", retrieval: 150, llm: 720, eval: 45 },
  { name: "12:00", retrieval: 110, llm: 600, eval: 30 },
];

const hallucinationData = [
  { name: "Grounded", value: 94 },
  { name: "Hallucinated", value: 6 },
];

const COLORS = ["#10b981", "#ef4444"];

export const EvaluationCharts: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 1. Quality Trend Line */}
      <div className="p-5 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <h3 className="text-xs font-bold text-zinc-500 uppercase mb-4">Quality Score Trend</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={qualityData}>
              <XAxis dataKey="time" stroke="#888888" fontSize={11} />
              <YAxis domain={[60, 100]} stroke="#888888" fontSize={11} />
              <Tooltip />
              <Line type="monotone" dataKey="quality" stroke="#6366f1" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Latency Area Chart */}
      <div className="p-5 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <h3 className="text-xs font-bold text-zinc-500 uppercase mb-4">Latency Breakdown (ms)</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={latencyData}>
              <XAxis dataKey="name" stroke="#888888" fontSize={11} />
              <YAxis stroke="#888888" fontSize={11} />
              <Tooltip />
              <Area type="monotone" dataKey="llm" stackId="1" stroke="#f59e0b" fill="#f59e0b" />
              <Area type="monotone" dataKey="retrieval" stackId="1" stroke="#3b82f6" fill="#3b82f6" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Hallucination Pie Chart */}
      <div className="p-5 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <h3 className="text-xs font-bold text-zinc-500 uppercase mb-4">Hallucination Distribution</h3>
        <div className="h-48 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={hallucinationData} innerRadius={40} outerRadius={65} paddingAngle={5} dataKey="value">
                {hallucinationData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};