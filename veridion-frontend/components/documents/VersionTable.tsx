"use client";

import React from "react";
import { useDocuments } from "@/hooks/useDocuments";
import { VersionRow } from "./VersionRow";
import { EmptyState } from "./EmptyState";
import { Skeleton } from "@/components/ui/skeleton";

export function VersionTable() {
  const { documents, isLoading, deleteDocument, isDeleting } = useDocuments();

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-12 w-full rounded-lg" />
        <Skeleton className="h-12 w-full rounded-lg" />
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
    );
  }

  if (!documents || documents.length === 0) {
    return <EmptyState />;
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
              <th className="px-3 py-3">Created</th>
              <th className="px-3 py-3">Status</th>
              <th className="py-3 pl-3 pr-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {documents.map((doc) => (
              <VersionRow
                key={doc.id}
                document={doc}
                onDelete={deleteDocument}
                isDeleting={isDeleting}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}