import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IndustryAnalytics } from "@/types/dashboard";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Globe } from "lucide-react";

export const IndustryChart: React.FC<{ data: IndustryAnalytics[] }> = ({ data }) => {
  return (
    <Card className="border-zinc-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Globe className="w-4 h-4 text-indigo-600" />
          Volume & Queries by Industry
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="industry" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="documents" name="Documents" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              <Bar dataKey="queries" name="Queries" fill="#06b6d4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};