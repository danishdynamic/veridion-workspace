import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { querySchema, QueryFormData } from "@/schemas/query.schema";
import { SECTORS, REGIONS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";

interface QueryFormProps {
  onSubmit: (data: QueryFormData) => void;
  loading?: boolean;
}

export function QueryForm({ onSubmit, loading = false }: QueryFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<QueryFormData>({
    resolver: zodResolver(querySchema),
    defaultValues: { limit: 5 },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div>
        <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
          Compliance Question
        </label>
        <textarea
          {...register("query")}
          rows={3}
          placeholder="e.g. What are the mandatory reporting requirements for carbon emissions?"
          className="w-full rounded-md border border-zinc-200 bg-transparent p-3 text-xs text-zinc-900 outline-none focus:border-blue-500 dark:border-zinc-800 dark:text-zinc-100"
        />
        {errors.query && (
          <p className="mt-1 text-xs text-red-500">{errors.query.message}</p>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Sector (Optional)
          </label>
          <select
            {...register("industrySector")}
            className="w-full rounded-md border border-zinc-200 bg-transparent px-2.5 py-1.5 text-xs text-zinc-900 outline-none focus:border-blue-500 dark:border-zinc-800 dark:text-zinc-100"
          >
            <option value="">All Sectors</option>
            {SECTORS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Region (Optional)
          </label>
          <select
            {...register("deploymentRegion")}
            className="w-full rounded-md border border-zinc-200 bg-transparent px-2.5 py-1.5 text-xs text-zinc-900 outline-none focus:border-blue-500 dark:border-zinc-800 dark:text-zinc-100"
          >
            <option value="">All Regions</option>
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Result Limit
          </label>
          <input
            type="number"
            {...register("limit", { valueAsNumber: true })}
            className="w-full rounded-md border border-zinc-200 bg-transparent px-2.5 py-1.5 text-xs text-zinc-900 outline-none focus:border-blue-500 dark:border-zinc-800 dark:text-zinc-100"
          />
        </div>
      </div>

      <Button type="submit" disabled={loading} className="w-full text-xs">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Querying Vector DB...
          </>
        ) : (
          <>
            <Search className="mr-2 h-3.5 w-3.5" /> Execute Vector Search
          </>
        )}
      </Button>
    </form>
  );
}