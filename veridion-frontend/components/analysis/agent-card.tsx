// veridion-frontend/components/analysis/agent-card.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, XCircle, Clock } from "lucide-react";
import { AgentName, AgentStatus } from "@/types/agent";

interface AgentCardProps {
  name: AgentName;
  status: AgentStatus;
  message?: string;
  timestamp?: string;
}

const statusConfig: Record<AgentStatus, { icon: React.ReactNode; color: string }> = {
  IDLE: { icon: <Clock className="h-4 w-4" />, color: "text-gray-400" },
  THINKING: { icon: <Loader2 className="h-4 w-4 animate-spin" />, color: "text-blue-500" },
  SUCCESS: { icon: <CheckCircle className="h-4 w-4" />, color: "text-green-500" },
  FAILED: { icon: <XCircle className="h-4 w-4" />, color: "text-red-500" },
  WAITING: { icon: <Clock className="h-4 w-4" />, color: "text-yellow-500" },
};

export function AgentCard({ name, status, message, timestamp }: AgentCardProps) {
  const config = statusConfig[status];

  return (
    <Card className={status === "THINKING" ? "border-blue-200 bg-blue-50/50" : undefined}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={config.color}>{config.icon}</span>
            <div>
              <p className="font-medium text-sm">{name.replace(/_/g, " ")}</p>
              {message && (
                <p className="text-xs text-muted-foreground mt-0.5">{message}</p>
              )}
            </div>
          </div>
          <Badge variant={status === "SUCCESS" ? "default" : status === "FAILED" ? "destructive" : "secondary"}>
            {status}
          </Badge>
        </div>
        {timestamp && (
          <p className="text-xs text-muted-foreground mt-2 text-right">{timestamp}</p>
        )}
      </CardContent>
    </Card>
  );
}