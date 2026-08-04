import React from "react";
import { StatCard } from "@/components/dashboard/StatsCard";
import { DollarSign, Cpu, Clock, Layers, Database } from "lucide-react";

export const ExecutionSummary: React.FC = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      <StatCard title="Total Runtime" value="1.42s" icon={<Clock className="w-4 h-4 text-indigo-600" />} />
      <StatCard title="Total Tokens" value="3,840" icon={<Cpu className="w-4 h-4 text-blue-600" />} />
      <StatCard title="Total Cost" value="$0.0042" icon={<DollarSign className="w-4 h-4 text-emerald-600" />} />
      <StatCard title="Cache Hit" value="84%" icon={<Layers className="w-4 h-4 text-amber-600" />} />
      <StatCard title="RAG Hits" value="12 Docs" icon={<Database className="w-4 h-4 text-purple-600" />} />
      <StatCard title="Docs Used" value="4 Files" icon={<Database className="w-4 h-4 text-cyan-600" />} />
    </div>
  );
};