import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DashboardStats } from "@/types/dashboard";
import {
  FileText,
  Clock,
  Globe,
  TrendingUp,
  Activity,
  Zap,
  CheckCircle2,
  HardDrive,
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string;
  trend?: "up" | "down" | "neutral";
  description?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  change,
  trend = "neutral",
  description,
}) => {
  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between space-x-2">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
            {icon}
          </div>
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {value}
          </div>
          {change && (
            <span
              className={`text-xs font-medium ${
                trend === "up"
                  ? "text-emerald-600 dark:text-emerald-400"
                  : trend === "down"
                  ? "text-rose-600 dark:text-rose-400"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              {change}
            </span>
          )}
        </div>
        {description && (
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export const StatsGrid: React.FC<{ stats: DashboardStats }> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard
        title="Documents Ingested"
        value={stats.documents}
        change="+12%"
        trend="up"
        icon={<FileText className="w-5 h-5 text-indigo-600" />}
      />
      <StatCard
        title="Compliance Queries"
        value={stats.queries}
        change="+24%"
        trend="up"
        icon={<Activity className="w-5 h-5 text-indigo-600" />}
      />
      <StatCard
        title="Active Industries"
        value={stats.industries}
        change="Stable"
        trend="neutral"
        icon={<Globe className="w-5 h-5 text-indigo-600" />}
      />
      <StatCard
        title="Indexed Versions"
        value={stats.versions}
        change="+8"
        trend="up"
        icon={<TrendingUp className="w-5 h-5 text-indigo-600" />}
      />
      <StatCard
        title="Cache Hit Ratio"
        value={`${Math.round(stats.cacheHits * 100)}%`}
        change="+3%"
        trend="up"
        icon={<Zap className="w-5 h-5 text-emerald-600" />}
      />
      <StatCard
        title="Avg Query Latency"
        value={`${stats.latency}ms`}
        change="-45ms"
        trend="up"
        icon={<Clock className="w-5 h-5 text-amber-600" />}
      />
      <StatCard
        title="Agent Success Rate"
        value="99.2%"
        change="Optimal"
        trend="up"
        icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
      />
      <StatCard
        title="Vector Index Size"
        value="1.3 GB"
        change="+120MB"
        trend="neutral"
        icon={<HardDrive className="w-5 h-5 text-purple-600" />}
      />
    </div>
  );
};