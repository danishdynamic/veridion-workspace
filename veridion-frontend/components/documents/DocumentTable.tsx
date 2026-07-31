import React from "react";
import { DocumentVersion } from "@/types/document";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Eye, GitCompare, Trash2 } from "lucide-react";

interface DocumentTableProps {
  documents: DocumentVersion[];
  loading?: boolean;
  onView?: (id: string) => void;
  onCompare?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function DocumentTable({
  documents,
  loading = false,
  onView,
  onCompare,
  onDelete,
}: DocumentTableProps) {
  if (loading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-12 w-full rounded-lg" />
        <Skeleton className="h-12 w-full rounded-lg" />
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-zinc-200 p-8 text-center dark:border-zinc-800">
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          No document versions found.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50/50 text-xs font-semibold text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
              <th className="py-3 pl-4 pr-3">Document</th>
              <th className="px-3 py-3">Version</th>
              <th className="px-3 py-3">Sector</th>
              <th className="px-3 py-3">Region</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3">Updated</th>
              <th className="py-3 pl-3 pr-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {documents.map((doc) => {
              const isActive = doc.status === "ACTIVE";
              return (
                <tr
                  key={doc.id}
                  className="border-b border-zinc-100 transition-colors hover:bg-zinc-50/50 dark:border-zinc-800/60 dark:hover:bg-zinc-900/50"
                >
                  <td className="py-3.5 pl-4 pr-3 text-sm">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                        <FileText className="h-4 w-4" />
                      </div>
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                        {doc.title}
                      </span>
                    </div>
                  </td>

                  <td className="px-3 py-3.5 text-xs font-mono font-medium text-zinc-700 dark:text-zinc-300">
                    <Badge variant="outline" className="font-mono">
                      {doc.version}
                    </Badge>
                  </td>

                  <td className="px-3 py-3.5 text-xs text-zinc-600 dark:text-zinc-400">
                    {doc.sector}
                  </td>

                  <td className="px-3 py-3.5 text-xs text-zinc-600 dark:text-zinc-400">
                    {doc.region}
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
                    {doc.updatedAt}
                  </td>

                  <td className="py-3.5 pl-3 pr-4 text-right text-xs">
                    <div className="flex items-center justify-end gap-1">
                      {onView && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onView(doc.id)}
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
                          onClick={() => onCompare(doc.id)}
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
                          onClick={() => onDelete(doc.id)}
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
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}