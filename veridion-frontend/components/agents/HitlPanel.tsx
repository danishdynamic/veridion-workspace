import React from "react";
import { HitlRequest } from "@/types/agent-monitor";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Check, X } from "lucide-react";

interface HitlPanelProps {
  requests: HitlRequest[];
  onResolve: (id: string, action: "approve" | "reject") => void;
}

export const HitlPanel: React.FC<HitlPanelProps> = ({ requests, onResolve }) => {
  return (
    <div className="p-4 bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-indigo-600" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Human-in-the-Loop (HITL) Queue
          </h3>
        </div>
        <Badge variant="secondary" className="text-[10px]">
          {requests.filter((r) => r.status === "pending").length} Pending
        </Badge>
      </div>

      <div className="space-y-2">
        {requests.map((item) => (
          <div
            key={item.id}
            className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
          >
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-indigo-600">{item.id}</span>
                <span className="text-zinc-400">({item.executionId})</span>
                <Badge
                  className={`text-[9px] capitalize ${
                    item.status === "pending"
                      ? "bg-amber-100 text-amber-800"
                      : item.status === "approved"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-rose-100 text-rose-800"
                  }`}
                >
                  {item.status}
                </Badge>
              </div>
              <p className="text-zinc-600 dark:text-zinc-300">{item.reason}</p>
            </div>

            {item.status === "pending" && (
              <div className="flex items-center space-x-2 shrink-0">
                <Button
                  size="sm"
                  className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={() => onResolve(item.id, "approve")}
                >
                  <Check className="w-3.5 h-3.5 mr-1" /> Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs border-rose-300 text-rose-600 hover:bg-rose-50"
                  onClick={() => onResolve(item.id, "reject")}
                >
                  <X className="w-3.5 h-3.5 mr-1" /> Reject
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};