import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SystemHealth as SystemHealthType } from "@/types/dashboard";
import { Badge } from "@/components/ui/badge";
import { getHealthBadgeColor } from "@/lib/dashboard";
import { Server, Database, Cpu, Activity } from "lucide-react";

export const SystemHealth: React.FC<{ health: SystemHealthType }> = ({ health }) => {
  const services = [
    { name: "FastAPI Engine", status: health.fastapi, icon: <Server className="w-4 h-4" /> },
    { name: "Node Orchestrator", status: health.node, icon: <Activity className="w-4 h-4" /> },
    { name: "Redis Cache", status: health.redis, icon: <Cpu className="w-4 h-4" /> },
    { name: "Postgres (pgvector)", status: health.postgres, icon: <Database className="w-4 h-4" /> },
    { name: "Vector Search", status: health.vector, icon: <Database className="w-4 h-4" /> },
    { name: "LLM Pipeline", status: health.llm, icon: <Server className="w-4 h-4" /> },
  ];

  return (
    <Card className="border-zinc-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-600" />
            System Service Health & Metrics
          </span>
          <span className="text-xs font-mono font-normal text-zinc-400">
            System Uptime: {health.uptime}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {services.map((svc, i) => (
            <div key={i} className="p-3 bg-zinc-50 rounded-lg border border-zinc-100 flex flex-col justify-between space-y-2">
              <div className="text-zinc-600 flex items-center space-x-1.5">
                {svc.icon}
                <span className="text-xs font-semibold">{svc.name}</span>
              </div>
              <Badge variant="outline" className={`text-[10px] w-fit ${getHealthBadgeColor(svc.status)}`}>
                {svc.status}
              </Badge>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2 text-xs">
          <div>
            <div className="flex justify-between text-zinc-500 mb-1">
              <span>CPU Utilization</span>
              <span className="font-semibold">{health.cpu}%</span>
            </div>
            <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
              <div className="bg-indigo-600 h-full" style={{ width: `${health.cpu}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-zinc-500 mb-1">
              <span>Memory Utilization</span>
              <span className="font-semibold">{health.memory}%</span>
            </div>
            <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
              <div className="bg-cyan-600 h-full" style={{ width: `${health.memory}%` }} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};