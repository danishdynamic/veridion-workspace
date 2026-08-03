"use client";

import React from "react";
import { QueryForm } from "@/components/query/QueryForm";
import { QueryResults } from "@/components/query/QueryResults";
import { ContextViewer } from "@/components/query/ContextViewer";
import { useQueryCompliance } from "@/hooks/useQueryCompliance";
import { useQueryStore } from "@/store/query.store";
import { QueryFormData } from "@/schemas/query.schema";

export default function QueryPage() {
  const queryMutation = useQueryCompliance();
  const { results, selectedResult, setResults, setSelectedResult } =
    useQueryStore();

  const handleQuery = async (data: QueryFormData) => {
    const res = await queryMutation.mutateAsync({
      query: data.query,
      industrySector: data.industrySector || undefined,
      deploymentRegion: data.deploymentRegion || undefined,
      limit: data.limit,
    });
    setResults(data, res);
    if (res.length > 0) setSelectedResult(res[0]);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 py-8 px-4">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Vector Retrieval Query
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Query indexed regulatory documents using semantic search against pgvector embeddings.
        </p>
      </div>

      <QueryForm loading={queryMutation.isPending} onSubmit={handleQuery} />

      <div className="grid gap-6 md:grid-cols-2">
        <QueryResults
          results={results}
          onSelectResult={setSelectedResult}
          selectedParentId={selectedResult?.parentId}
        />
        <ContextViewer
          legalContext={selectedResult?.legalContextChunk}
          matchedChunk={selectedResult?.matchedChildContext}
        />
      </div>
    </div>
  );
}