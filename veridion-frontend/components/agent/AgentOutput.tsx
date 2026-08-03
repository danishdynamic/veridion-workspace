import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SummaryOutput, ChartDataPoint, FormErrorItem } from "@/types/agent";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertCircle, FileText, BarChart3, ShieldAlert } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface Props {
  summary: SummaryOutput | null;
  chart: ChartDataPoint[] | null;
  errors: FormErrorItem[];
}

export const AgentOutput: React.FC<Props> = ({ summary, chart, errors }) => {
  if (!summary && (!chart || chart.length === 0) && errors.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      {summary && (
        <Card className="border-zinc-200">
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            <CardTitle className="text-base font-semibold">Regulatory Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="bg-zinc-50 p-3 rounded-md border border-zinc-100 flex justify-between items-center">
              <span className="font-medium text-zinc-600">Active Baseline Version:</span>
              <span className="font-bold text-zinc-800">{summary.currentVersion}</span>
            </div>

            <Accordion type="single" collapsible defaultValue="changes" className="w-full">
              <AccordionItem value="changes">
                <AccordionTrigger className="text-xs font-semibold text-zinc-700">
                  Required Changes ({summary.requiredChanges.length})
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-4 space-y-1 text-zinc-600">
                    {summary.requiredChanges.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="sections">
                <AccordionTrigger className="text-xs font-semibold text-zinc-700">
                  Affected Sections ({summary.affectedSections.length})
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-wrap gap-1.5">
                    {summary.affectedSections.map((sec, idx) => (
                      <span key={idx} className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-[11px]">
                        {sec}
                      </span>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="notes">
                <AccordionTrigger className="text-xs font-semibold text-zinc-700">
                  Compliance Notes
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-4 space-y-1 text-zinc-600">
                    {summary.complianceNotes.map((note, idx) => (
                      <li key={idx}>{note}</li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      )}

      {/* Visualizer Chart */}
      {chart && chart.length > 0 && (
        <Card className="border-zinc-200">
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            <CardTitle className="text-base font-semibold">Compliance Metrics Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chart}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Form Validation Error Suggestions */}
      {errors.length > 0 && (
        <Card className="border-rose-200 bg-rose-50/30">
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <CardTitle className="text-base font-semibold text-rose-800">
              Form Suggestions & Inconsistencies ({errors.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {errors.map((err, idx) => (
              <div key={idx} className="p-3 bg-white border border-rose-100 rounded-md shadow-sm text-xs space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-rose-700 uppercase tracking-wide text-[10px]">
                    Field: {err.field}
                  </span>
                  <span className="text-[10px] bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded font-medium">
                    {err.severity}
                  </span>
                </div>
                <p className="text-zinc-700">{err.issue}</p>
                <p className="text-emerald-700 font-medium">💡 Suggestion: {err.suggestion}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};