import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-pulse">
      <div className="h-10 w-64 bg-zinc-200 rounded-md" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl bg-zinc-100" />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-72 rounded-xl bg-zinc-100" />
        <Skeleton className="h-72 rounded-xl bg-zinc-100" />
      </div>
    </div>
  );
};