import React from "react";
import { Document } from "@/types/document";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Eye, GitCompare, Trash2 } from "lucide-react";

interface VersionRowProps {
  document: Document;
  onView?: (id: string) => void;
  onCompare?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function VersionRow({
  document,
  onView,
  onCompare,
  onDelete,
}: VersionRowProps) {
  const isActive = document.status === "ACTIVE";

  return (
    <tr className="border-b border-zinc-100 transition-colors hover:bg-zinc-50/50 dark:border-zinc-800/60 dark:hover:bg-zinc-900/50">
      <td className="py-3.5 pl-4 pr-3 text-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
            <FileText className="h-4 w-4" />
          </div>
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">
            {document.title}
          </span>
        </div>
      </td>

      <td className="px-3 py-3.5 text-xs font-mono font-medium text-zinc-700 dark:text-zinc-300">
        <Badge variant="outline" className="font-mono">
          {document.version}
        </Badge>
      </td>

      <td className="px-3 py-3.5 text-xs text-zinc-600 dark:text-zinc-400">
        {document.sector}
      </td>

      <td className="px-3 py-3.5 text-xs text-zinc-600 dark:text-zinc-400">
        {document.region}
      </td>

      <td className="px-3 py-3.5 text-xs">
        <Badge
          className={
            isActive
              ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-400"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-400"
          }
        >
          {isActive ? "Active" : "Archived"}
        </Badge>
      </td>

      <td className="px-3 py-3.5 text-xs text-zinc-500 dark:text-zinc-400">
        {document.updatedAt}
      </td>

      <td className="py-3.5 pl-3 pr-4 text-right text-xs">
        <div className="flex items-center justify-end gap-1">
          {onView && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onView(document.id)}
              className="h-8 w-8 text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400"
              title="View Document"
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}
          {onCompare && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onCompare(document.id)}
              className="h-8 w-8 text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400"
              title="Compare Version"
            >
              <GitCompare className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(document.id)}
              className="h-8 w-8 text-zinc-500 hover:text-red-600 dark:hover:text-red-400"
              title="Delete Version"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
}