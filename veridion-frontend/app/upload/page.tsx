"use client";

import React, { useState } from "react";
import { UploadCard } from "@/components/upload/UploadCard";
import { UploadProgress, UploadStage } from "@/components/upload/UploadProgress";
import { useUpload } from "@/hooks/useUpload";
import { useDocumentStore } from "@/store/document.store";
import { UploadFormData } from "@/schemas/upload.schema";

export default function UploadPage() {
  const [stage, setStage] = useState<UploadStage>("idle");
  const uploadMutation = useUpload();
  const setUploadedDocument = useDocumentStore((s) => s.setUploadedDocument);

  const handleUpload = async (data: UploadFormData) => {
    setStage("uploading");
    try {
      setTimeout(() => setStage("processing"), 600);
      setTimeout(() => setStage("chunking"), 1200);

      const res = await uploadMutation.mutateAsync({
        title: data.title,
        version: data.versionTag,
        sector: data.sector,
        region: data.region,
        file: data.file,
      });

      setUploadedDocument(res);
      setStage("completed");
    } catch {
      setStage("idle");
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 py-8 px-4">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Upload Policy Document
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Upload PDF or TXT regulations to index into pgvector for compliance retrieval.
        </p>
      </div>

      <UploadCard loading={uploadMutation.isPending} onSubmit={handleUpload} />
      <UploadProgress status={stage} />
    </div>
  );
}