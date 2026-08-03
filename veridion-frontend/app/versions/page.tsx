"use client";

import React from "react";
import { DocumentTable } from "@/components/documents/DocumentTable";
import { VersionCard } from "@/components/documents/VersionCard";
import { useVersions } from "@/hooks/useVersions";

export default function VersionsPage() {
  const { data: documents = [], isLoading } = useVersions();

  return (
    <div className="mx-auto max-w-5xl space-y-6 py-8 px-4">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Document Versions
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Manage regulatory policy versions indexed in PostgreSQL vector storage.
        </p>
      </div>

      {/* Grid view for top items */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {documents.slice(0, 3).map((doc) => (
          <VersionCard
            key={doc.id}
            id={doc.id}
            title={doc.title}
            version={doc.version}
            status={doc.status}
            updatedAt={doc.updatedAt}
            sector={doc.sector}
            region={doc.region}
          />
        ))}
      </div>

      {/* Full Table View */}
      <DocumentTable documents={documents} loading={isLoading} />
    </div>
  );
}