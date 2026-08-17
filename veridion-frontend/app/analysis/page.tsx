// veridion-frontend/app/analysis/page.tsx
"use client";

import { Container } from "@/components/layout/Container";
import { Pipeline } from "@/components/analysis/pipeline";
import { ResultCard } from "@/components/analysis/result-card";
import { Timeline } from "@/components/analysis/timeline";
import { Chart } from "@/components/analysis/chart";
import { useAgentStore } from "@/store/agent.store";
import { useAgentSocket } from "@/hooks/useAgentSocket";

export default function AnalysisPage() {
  const { summary, formErrors, finished, loading } = useAgentStore();
  
  // Initialize WebSocket connection
  useAgentSocket();

  return (
    <Container className="py-8">
      <h1 className="text-3xl font-bold mb-8">Form Analysis Results</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Pipeline Status */}
        <div className="lg:col-span-1 space-y-6">
          <Pipeline />
          <Timeline />
        </div>

        {/* Right: Results */}
        <div className="lg:col-span-2 space-y-6">
          {loading && !finished && (
            <div className="text-center py-12 text-muted-foreground">
              Analyzing your form against document versions...
            </div>
          )}
          
          <ResultCard errors={formErrors} summary={summary} />
          
          {finished && summary && <Chart />}
        </div>
      </div>
    </Container>
  );
}