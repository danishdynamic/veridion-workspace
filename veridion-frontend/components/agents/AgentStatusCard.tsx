import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/StatsCard"; 
import {
  Activity,
  CheckCircle2,
  Clock,
  XCircle,
  Cpu,
  Zap,
} from "lucide-react";
import { ExecutionMetric } from "@/types/agent-monitor";

interface AgentStatusCardGroupProps {
  metrics: ExecutionMetric | null;
  runningCount: number;
}

export const AgentStatusCardGroup: React.FC<AgentStatusCardGroupProps> = ({
  metrics,
  runningCount,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      <StatCard
        title="Running"
        value={runningCount}
        change="Active"
        trend="up"
        icon={<Activity className="w-4 h-4 text-amber-600" />}
      />
      <StatCard
        title="Success Rate"
        value={`${metrics?.successRate ?? 0}%`}
        change="+1.2%"
        trend="up"
        icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />}
      />
      <StatCard
        title="Avg Runtime"
        value={`${metrics?.averageRuntime ?? 0}ms`}
        change="-40ms"
        trend="up"
        icon={<Clock className="w-4 h-4 text-indigo-600" />}
      />
      <StatCard
        title="Cache Hit Ratio"
        value={`${metrics?.cacheHits ?? 0}%`}
        change="+4%"
        trend="up"
        icon={<Zap className="w-4 h-4 text-blue-600" />}
      />
      <StatCard
        title="Avg Tokens"
        value={metrics?.averageTokens ?? 0}
        change="Stable"
        trend="neutral"
        icon={<Cpu className="w-4 h-4 text-purple-600" />}
      />
      <StatCard
        title="Failures"
        value={metrics?.failures ?? 0}
        change="-2"
        trend="up"
        icon={<XCircle className="w-4 h-4 text-rose-600" />}
      />
    </div>
  );
};