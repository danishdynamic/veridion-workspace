import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VersionAnalytics } from "@/types/dashboard";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { TrendingUp } from "lucide-react";

export const VersionChart: React.FC<{ data: VersionAnalytics[] }> = ({ data }) => {
  return (
    <Card className="border-zinc-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-indigo-600" />
          Version Ingestion & Delta Detection
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="newVersions" name="New Versions" stroke="#4f46e5" strokeWidth={2} />
              <Line type="monotone" dataKey="modifiedClauses" name="Modified Clauses" stroke="#f59e0b" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};