"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { documentUploadSchema, DocumentUploadSchemaType } from "@/schemas/document.schema";
import { useUploadStore } from "@/store/upload.store";
import { useUploadDocument } from "@/hooks/useUploadDocument";
import { DocumentDropzone } from "./Dropzone";
import { UploadProgress } from "./UploadProgress";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, AlertCircle } from "lucide-react";

export function DocumentForm() {
  const { selectedFile, uploadProgress, isUploading, uploadSuccess, uploadError, setFile, reset } =
    useUploadStore();

  const { mutate: upload, isPending } = useUploadDocument();

  const {
    register,
    handleSubmit,
    setValue,
    reset: resetForm,
    formState: { errors },
  } = useForm<DocumentUploadSchemaType>({
    resolver: zodResolver(documentUploadSchema),
    defaultValues: {
      title: "",
      versionTag: "",
      sector: "",
      region: "",
    },
  });

  const handleFileChange = (file: File | null) => {
    setFile(file);
    if (file) {
      setValue("file", file, { shouldValidate: true });
    }
  };

  const onSubmit = (data: DocumentUploadSchemaType) => {
    upload(data, {
      onSuccess: () => {
        resetForm();
        setTimeout(() => reset(), 3000);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {uploadError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{uploadError}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Document Title
          </label>
          <Input
            {...register("title")}
            placeholder="e.g. Sustainability Act"
            className="mt-1"
          />
          {errors.title && (
            <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Version Tag
          </label>
          <Input
            {...register("versionTag")}
            placeholder="e.g. 2024 or v2.1"
            className="mt-1"
          />
          {errors.versionTag && (
            <p className="mt-1 text-xs text-red-500">{errors.versionTag.message}</p>
          )}
        </div>

        <div>
          <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Sector
          </label>
          <Input
            {...register("sector")}
            placeholder="e.g. Manufacturing, Finance"
            className="mt-1"
          />
          {errors.sector && (
            <p className="mt-1 text-xs text-red-500">{errors.sector.message}</p>
          )}
        </div>

        <div>
          <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Region
          </label>
          <Input
            {...register("region")}
            placeholder="e.g. EU, US-CA, Global"
            className="mt-1"
          />
          {errors.region && (
            <p className="mt-1 text-xs text-red-500">{errors.region.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1 block">
          Document File
        </label>
        <DocumentDropzone
          file={selectedFile}
          onFileSelect={handleFileChange}
          error={errors.file?.message as string}
        />
      </div>

      <UploadProgress
        progress={uploadProgress}
        isUploading={isUploading}
        completed={uploadSuccess}
      />

      <Button
        type="submit"
        disabled={isPending || isUploading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2"
      >
        <Upload className="h-4 w-4" />
        {isPending ? "Uploading & Indexing..." : "Upload & Index Regulation"}
      </Button>
    </form>
  );
}