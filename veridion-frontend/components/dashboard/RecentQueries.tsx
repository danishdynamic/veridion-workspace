import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {  RecentQuery } from "@/types/dashboard";
import { Clock } from "lucide-react";


export const RecentQueries: React.FC<{ queries: RecentQuery[] }> = ({ queries }) => (
  <Card className="border-zinc-200">
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-semibold flex items-center gap-2">
        <Clock className="w-4 h-4 text-indigo-600" />
        Recent Compliance Queries
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="text-zinc-400 border-b border-zinc-100">
            <tr>
              <th className="pb-2 font-medium">Query</th>
              <th className="pb-2 font-medium">Industry</th>
              <th className="pb-2 font-medium">Matches</th>
              <th className="pb-2 font-medium">Latency</th>
              <th className="pb-2 font-medium text-right">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {queries.map((q) => (
              <tr key={q.id} className="hover:bg-zinc-50/50">
                <td className="py-2.5 font-medium text-zinc-800 max-w-xs truncate">{q.query}</td>
                <td className="py-2.5 text-zinc-500">{q.industry}</td>
                <td className="py-2.5 text-zinc-500">{q.matches} chunks</td>
                <td className="py-2.5 text-zinc-500 font-mono">{q.responseTime}ms</td>
                <td className="py-2.5 text-right text-zinc-400">{q.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CardContent>
  </Card>
);