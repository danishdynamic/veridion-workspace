import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { uploadSchema, UploadFormData } from "@/schemas/upload.schema";
import { SECTORS, REGIONS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Upload, File, X, Loader2 } from "lucide-react";

interface UploadCardProps {
  loading?: boolean;
  onSubmit: (data: UploadFormData) => void;
}

export function UploadCard({ loading = false, onSubmit }: UploadCardProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UploadFormData>({
    resolver: zodResolver(uploadSchema),
  });

  const selectedFile = watch("file");

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (file) setValue("file", file, { shouldValidate: true });
    },
    [setValue]
  );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="flex min-h-7.5 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-zinc-200 p-6 transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
      >
        <input
          type="file"
          accept=".pdf,.txt"
          className="hidden"
          id="file-upload"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) setValue("file", file, { shouldValidate: true });
          }}
        />

        {selectedFile ? (
          <div className="flex items-center gap-3">
            <File className="h-6 w-6 text-blue-500" />
            <div className="text-left">
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {selectedFile.name}
              </p>
              <p className="text-xs text-zinc-500">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-zinc-400 hover:text-zinc-600"
              onClick={() => setValue("file", undefined as unknown as File)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <label
            htmlFor="file-upload"
            className="flex cursor-pointer flex-col items-center gap-2"
          >
            <Upload className="h-8 w-8 text-zinc-400" />
            <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
              Drag & drop or <span className="text-blue-600">click to upload</span>
            </span>
            <span className="text-[10px] text-zinc-400">PDF or TXT up to 10MB</span>
          </label>
        )}
      </div>
      {errors.file && (
        <p className="text-xs text-red-500">{errors.file.message}</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Document Title
          </label>
          <input
            {...register("title")}
            placeholder="e.g. EU Sustainability Act"
            className="w-full rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-xs text-zinc-900 outline-none focus:border-blue-500 dark:border-zinc-800 dark:text-zinc-100"
          />
          {errors.title && (
            <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Version Tag
          </label>
          <input
            {...register("versionTag")}
            placeholder="e.g. v2026.2"
            className="w-full rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-xs text-zinc-900 outline-none focus:border-blue-500 dark:border-zinc-800 dark:text-zinc-100"
          />
          {errors.versionTag && (
            <p className="mt-1 text-xs text-red-500">
              {errors.versionTag.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Sector
          </label>
          <select
            {...register("sector")}
            className="w-full rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-xs text-zinc-900 outline-none focus:border-blue-500 dark:border-zinc-800 dark:text-zinc-100"
          >
            <option value="">Select Sector</option>
            {SECTORS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {errors.sector && (
            <p className="mt-1 text-xs text-red-500">{errors.sector.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Region
          </label>
          <select
            {...register("region")}
            className="w-full rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-xs text-zinc-900 outline-none focus:border-blue-500 dark:border-zinc-800 dark:text-zinc-100"
          >
            <option value="">Select Region</option>
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          {errors.region && (
            <p className="mt-1 text-xs text-red-500">{errors.region.message}</p>
          )}
        </div>
      </div>

      <Button type="submit" disabled={loading} className="w-full text-xs">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Indexing Document...
          </>
        ) : (
          "Upload & Process"
        )}
      </Button>
    </form>
  );
}