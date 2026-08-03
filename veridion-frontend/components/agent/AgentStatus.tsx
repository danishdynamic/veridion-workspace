import React from "react";
import { Badge } from "@/components/ui/badge";
import { AgentStatus as StatusType } from "@/types/agent";
import { Loader2, CheckCircle2, AlertCircle, Clock, Brain } from "lucide-react";

interface Props {
  status: StatusType;
}

export const AgentStatus: React.FC<Props> = ({ status }) => {
  switch (status) {
    case "THINKING":
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 gap-1.5 animate-pulse">
          <Brain className="w-3.5 h-3.5 animate-bounce" />
          Thinking...
        </Badge>
      );
    case "SUCCESS":
      return (
        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Completed
        </Badge>
      );
    case "WAITING":
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          Waiting HITL
        </Badge>
      );
    case "FAILED":
      return (
        <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
          Failed
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="bg-zinc-50 text-zinc-500 border-zinc-200 gap-1.5">
          Idle
        </Badge>
      );
  }
};