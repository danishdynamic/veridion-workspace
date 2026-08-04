import React from "react";
import { QueueJob } from "@/types/agent-monitor";
import { Badge } from "@/components/ui/badge";

interface AgentQueueProps {
  jobs: QueueJob[];
}

export const AgentQueue: React.FC<AgentQueueProps> = ({ jobs }) => {
  return (
    <div className="p-4 bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
          BullMQ Queue Monitor
        </h3>
        <span className="text-xs text-zinc-400">{jobs.length} Jobs</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="text-zinc-400 border-b border-zinc-100 dark:border-zinc-800">
            <tr>
              <th className="pb-2">Job ID</th>
              <th className="pb-2">Queue</th>
              <th className="pb-2">Status</th>
              <th className="pb-2">Attempts</th>
              <th className="pb-2 text-right">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {jobs.map((job) => (
              <tr key={job.id}>
                <td className="py-2 font-mono text-zinc-600 dark:text-zinc-400">{job.id}</td>
                <td className="py-2 font-medium">{job.queue}</td>
                <td className="py-2">
                  <Badge variant="outline" className="text-[10px] capitalize">
                    {job.status}
                  </Badge>
                </td>
                <td className="py-2 text-zinc-500">{job.attempts}</td>
                <td className="py-2 text-right text-zinc-400">{job.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};