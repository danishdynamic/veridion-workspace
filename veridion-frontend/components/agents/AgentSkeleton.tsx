import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const AgentSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      <Skeleton className="h-16 w-full rounded-xl" />
      <Skeleton className="h-28 w-full rounded-xl" />
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-64 w-full rounded-xl" />
    </div>
  );
};