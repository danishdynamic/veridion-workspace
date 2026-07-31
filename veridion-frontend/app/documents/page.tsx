import { UploadCard } from "@/components/documents/UploadCard";
import { VersionTable } from "@/components/documents/VersionTable";

export const metadata = {
  title: "Upload Acts & Regulations | Veridion",
  description: "Manage legislative acts, versions, and indices for compliance intelligence.",
};

export default function DocumentsPage() {
  return (
    <div className="py-8 space-y-10">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          Regulation Index
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Upload and organize legislative versions for downstream multi-agent form intelligence.
        </p>
      </div>

      {/* Upload Section */}
      <UploadCard />

      {/* Version Table Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
            Indexed Regulations
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Active and historical regulatory document versions indexed in pgvector.
          </p>
        </div>

        <VersionTable />
      </div>
    </div>
  );
}