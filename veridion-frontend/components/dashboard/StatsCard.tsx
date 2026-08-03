import React from "react";
import { Card, CardContent } from "@/components/ui/card";


interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string;
  trend?: "up" | "down" | "neutral";
  description?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, change, trend }) => (
  <Card className="border-zinc-200">
    <CardContent className="p-4 flex items-center justify-between">
      <div className="space-y-1">
        <p className="text-xs font-medium text-zinc-500">{title}</p>
        <div className="flex items-baseline space-x-2">
          <span className="text-xl font-bold tracking-tight text-zinc-900">{value}</span>
          {change && (
            <span
              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                trend === "up"
                  ? "bg-emerald-50 text-emerald-700"
                  : trend === "down"
                  ? "bg-rose-50 text-rose-700"
                  : "bg-zinc-100 text-zinc-600"
              }`}
            >
              {change}
            </span>
          )}
        </div>
      </div>
      <div className="p-2 bg-zinc-100 text-zinc-600 rounded-lg">{icon}</div>
    </CardContent>
  </Card>
);

