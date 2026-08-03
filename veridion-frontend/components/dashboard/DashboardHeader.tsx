import React from "react";
import { Button } from "@/components/ui/button";
import { useDashboardStore } from "@/store/dashboard.store";
import { Activity, RefreshCcw } from "lucide-react";

interface Props {
  title: string;
  subtitle: string;
  lastUpdated?: string;
  onRefresh: () => void;
  loading?: boolean;
}

export const DashboardHeader: React.FC<Props> = ({
  title,
  subtitle,
  lastUpdated,
  onRefresh,
  loading,
}) => {
  const { refreshInterval, toggleRefresh } = useDashboardStore();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center space-x-3">
        <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-sm">
          <Activity className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">{title}</h1>
          <p className="text-xs text-zinc-500">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center space-x-3 text-xs">
        {lastUpdated && <span className="text-zinc-400">Updated: {lastUpdated}</span>}
        <Button
          variant={refreshInterval > 0 ? "default" : "outline"}
          size="sm"
          onClick={() => toggleRefresh()}
          className="text-xs h-8 gap-1"
        >
          <RefreshCcw className={`w-3.5 h-3.5 ${refreshInterval > 0 ? "animate-spin" : ""}`} />
          {refreshInterval > 0 ? "Auto (30s)" : "Auto Refresh"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={loading}
          className="text-xs h-8"
        >
          Refresh Now
        </Button>
      </div>
    </div>
  );
};