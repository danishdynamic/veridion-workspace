import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RecentDocument } from "@/types/dashboard";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";

export const RecentDocuments: React.FC<{ documents: RecentDocument[] }> = ({ documents }) => (
  <Card className="border-zinc-200">
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-semibold flex items-center gap-2">
        <FileText className="w-4 h-4 text-indigo-600" />
        Recently Uploaded Documents
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="text-zinc-400 border-b border-zinc-100">
            <tr>
              <th className="pb-2 font-medium">Title</th>
              <th className="pb-2 font-medium">Version</th>
              <th className="pb-2 font-medium">Industry</th>
              <th className="pb-2 font-medium">Country</th>
              <th className="pb-2 font-medium">Uploaded</th>
              <th className="pb-2 font-medium text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {documents.map((doc) => (
              <tr key={doc.id} className="hover:bg-zinc-50/50">
                <td className="py-2.5 font-medium text-zinc-800">{doc.title}</td>
                <td className="py-2.5 text-zinc-500">{doc.version}</td>
                <td className="py-2.5 text-zinc-500">{doc.industry}</td>
                <td className="py-2.5 text-zinc-500">{doc.country}</td>
                <td className="py-2.5 text-zinc-400">{doc.uploadedAt}</td>
                <td className="py-2.5 text-right">
                  <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">
                    {doc.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CardContent>
  </Card>
);