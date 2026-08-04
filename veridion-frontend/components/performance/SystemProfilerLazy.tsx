"use client";

import React from "react";
import { SystemMetric } from "@/types/performance";

interface Props {
  profiler: SystemMetric;
}

export default function SystemProfilerLazy({ profiler }: Props) {
  const metrics = [
    { name: "CPU Utilization", value: `${profiler.cpuUsagePercentage}%`, desc: "Multi-core load" },
    { name: "Memory Allocated", value: `${profiler.memoryUsageMb} MB`, desc: "Heap & RSS usage" },
    { name: "PostgreSQL Connections", value: profiler.postgresConnections, desc: "Active pgvector pool" },
    { name: "Redis Active Clients", value: profiler.redisConnectedClients, desc: "PubSub & Cache channels" },
    { name: "Node.js Event Loop Tasks", value: profiler.nodeActiveRequests, desc: "LangGraph async queue" },
    { name: "FastAPI Workers", value: profiler.fastapiActiveTasks, desc: "Uvicorn worker tasks" },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
      <h3 className="text-base font-semibold text-white mb-4">Infrastructure Resource Profiler</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {metrics.map((m, idx) => (
          <div key={idx} className="bg-slate-800/50 border border-slate-700/60 p-3 rounded-lg">
            <span className="text-xs text-slate-400 block">{m.name}</span>
            <span className="text-lg font-bold text-white block mt-1 font-mono">{m.value}</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">{m.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}