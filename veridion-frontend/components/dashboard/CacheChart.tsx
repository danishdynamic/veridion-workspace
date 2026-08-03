import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CacheAnalytics } from "@/types/dashboard";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { PIE_COLORS } from "@/lib/colors";
import { Zap } from "lucide-react";

export const CacheChart: React.FC<{ data: CacheAnalytics }> = ({ data }) => {
  const chartData = [
    { name: "Cache Hits", value: data.hits },
    { name: "Cache Misses", value: data.misses },
  ];

  return (
    <Card className="border-zinc-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Zap className="w-4 h-4 text-emerald-600" />
          Semantic Vector Cache Efficiency
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};