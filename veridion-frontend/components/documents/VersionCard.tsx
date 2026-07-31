import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { FileText, Eye, Globe, Building2, Calendar } from "lucide-react";

interface VersionCardProps {
  id: string;
  title: string;
  version: string;
  status: "ACTIVE" | "ARCHIVED";
  updatedAt: string;
  sector: string;
  region: string;
  onView?: () => void;
}

export function VersionCard({
  title,
  version,
  status,
  updatedAt,
  sector,
  region,
  onView,
}: VersionCardProps) {
  const isActive = status === "ACTIVE";

  return (
    <Card className="flex flex-col justify-between border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              <FileText className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-base font-bold text-zinc-900 dark:text-zinc-100">
                {title}
              </h3>
              <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                Version: {version}
              </p>
            </div>
          </div>
          <Badge
            className={`shrink-0 font-mono text-[10px] ${
              isActive
                ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-400"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-400"
            }`}
          >
            {isActive ? "Active Version" : "Archived"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="py-2 text-xs text-zinc-600 dark:text-zinc-400 space-y-2">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-zinc-500">
            <Building2 className="h-3.5 w-3.5" /> Sector
          </span>
          <span className="font-medium text-zinc-800 dark:text-zinc-200">{sector}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-zinc-500">
            <Globe className="h-3.5 w-3.5" /> Region
          </span>
          <span className="font-medium text-zinc-800 dark:text-zinc-200">{region}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-zinc-500">
            <Calendar className="h-3.5 w-3.5" /> Last Updated
          </span>
          <span className="font-medium text-zinc-800 dark:text-zinc-200">{updatedAt}</span>
        </div>
      </CardContent>

      <CardFooter className="pt-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onView}
          className="w-full gap-1.5 text-xs border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800"
        >
          <Eye className="h-3.5 w-3.5" />
          View
        </Button>
      </CardFooter>
    </Card>
  );
}