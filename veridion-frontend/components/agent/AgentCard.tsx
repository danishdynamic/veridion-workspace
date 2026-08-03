import React from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AgentStatus } from "./AgentStatus";
import { AgentStatus as StatusType } from "@/types/agent";
import { Bot, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";

interface Props {
  title: string;
  description: string;
  status: StatusType;
  duration?: string;
}

export const AgentCard: React.FC<Props> = ({ title, description, status, duration }) => {
  return (
    <Card className={`transition-all duration-200 ${status === "THINKING" ? "border-amber-400 shadow-md ring-1 ring-amber-300" : ""}`}>
      <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-zinc-100 text-zinc-700">
            {status === "THINKING" ? (
              <Loader2 className="w-5 h-5 animate-spin text-amber-600" />
            ) : status === "SUCCESS" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            ) : status === "FAILED" ? (
              <AlertTriangle className="w-5 h-5 text-rose-600" />
            ) : (
              <Bot className="w-5 h-5" />
            )}
          </div>
          <div>
            <CardTitle className="text-sm font-semibold">{title}</CardTitle>
            <CardDescription className="text-xs text-zinc-500">{description}</CardDescription>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <AgentStatus status={status} />
          {duration && <span className="text-[10px] text-zinc-400">{duration}</span>}
        </div>
      </CardHeader>
    </Card>
  );
};