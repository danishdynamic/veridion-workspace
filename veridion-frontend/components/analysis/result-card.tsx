// veridion-frontend/components/analysis/result-card.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { FormErrorItem } from "@/types/agent";

interface ResultCardProps {
  errors: FormErrorItem[];
  summary?: {
    currentVersion: string;
    affectedSections: string[];
    requiredChanges: string[];
  } | null;
}

export function ResultCard({ errors, summary }: ResultCardProps) {
  if (!errors.length && !summary) {
    return (
      <Card className="border-dashed">
        <CardContent className="pt-6 text-center text-muted-foreground">
          Submit a form to see analysis results
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {errors.length > 0 && (
        <Card className="border-red-200 bg-red-50/50 dark:bg-red-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
              <XCircle className="h-5 w-5" />
              Form Issues Found ({errors.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {errors.map((error, idx) => (
              <div
                key={idx}
                className="rounded-lg border bg-white p-4 dark:bg-black"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Badge
                    variant={error.severity === "error" ? "destructive" : "default"}
                  >
                    {error.severity}
                  </Badge>
                  <span className="font-semibold">{error.field}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{error.issue}</p>
                <div className="flex items-start gap-2 text-sm text-blue-600 dark:text-blue-400">
                  <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>{error.suggestion}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {summary && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Version Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <span className="text-sm font-medium">Current Version:</span>
              <span className="ml-2 text-sm text-muted-foreground">
                {summary.currentVersion}
              </span>
            </div>
            {summary.affectedSections.length > 0 && (
              <div>
                <span className="text-sm font-medium">Affected Sections:</span>
                <div className="mt-1 flex flex-wrap gap-2">
                  {summary.affectedSections.map((section) => (
                    <Badge key={section} variant="outline">
                      {section}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {summary.requiredChanges.length > 0 && (
              <div>
                <span className="text-sm font-medium">Required Changes:</span>
                <ul className="mt-1 space-y-1">
                  {summary.requiredChanges.map((change, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">•</span>
                      {change}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}