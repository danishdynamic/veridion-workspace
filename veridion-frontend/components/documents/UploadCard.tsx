import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { DocumentForm } from "./DocumentForm";
import { FileUp } from "lucide-react";

export function UploadCard() {
  return (
    <Card className="border border-zinc-200 dark:border-zinc-800 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
            <FileUp className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold text-zinc-900 dark:text-white">
              Upload Regulation Document
            </CardTitle>
            <CardDescription className="text-xs text-zinc-500 dark:text-zinc-400">
              Add new legislative documents to FastAPI and store chunks into pgvector.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <DocumentForm />
      </CardContent>
    </Card>
  );
}