"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { agentQuerySchema, AgentQueryFormValues } from "@/schemas/agent.schema";
import { useAgent } from "@/hooks/useAgent";
import { useAgentSocket } from "@/hooks/useAgentSocket";
import { AgentPipeline } from "@/components/agent/AgentPipeline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Network, Bot } from "lucide-react";

export default function AgentPage() {
  useAgentSocket(); // Connects WebSocket listener to state store
  const { runPipeline, isLoading } = useAgent();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AgentQueryFormValues>({
    resolver: zodResolver(agentQuerySchema),
    defaultValues: {
      query: "Check regulatory compliance for cross-border data transfer rules under EU GDPR 2026 update.",
      industrySector: "Fintech",
      deploymentRegion: "EU",
    },
  });

  const onSubmit = (values: AgentQueryFormValues) => {
    runPipeline({
      query: values.query,
      industrySector: values.industrySector,
      deploymentRegion: values.deploymentRegion,
    });
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-sm">
          <Network className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Regulatory Orchestrator
          </h1>
          <p className="text-xs text-zinc-500">
            Multi-agent compliance verification & delta synthesis
          </p>
        </div>
      </div>

      {/* Query Form */}
      <Card className="border-zinc-200">
        <CardHeader>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Bot className="w-4 h-4 text-indigo-600" />
            Orchestration Directives
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                Compliance Query
              </label>
              <textarea
                {...register("query")}
                rows={3}
                className="w-full text-xs p-2.5 rounded-md border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Describe your regulatory query..."
              />
              {errors.query && (
                <p className="text-[11px] text-rose-500 mt-1">{errors.query.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Industry Sector
                </label>
                <input
                  {...register("industrySector")}
                  type="text"
                  className="w-full text-xs p-2 rounded-md border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {errors.industrySector && (
                  <p className="text-[11px] text-rose-500 mt-1">{errors.industrySector.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Deployment Region
                </label>
                <input
                  {...register("deploymentRegion")}
                  type="text"
                  className="w-full text-xs p-2 rounded-md border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {errors.deploymentRegion && (
                  <p className="text-[11px] text-rose-500 mt-1">{errors.deploymentRegion.message}</p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium px-4 py-2"
            >
              {isLoading ? "Initiating Multi-Agent Pipeline..." : "Run Agents Pipeline"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Live Pipeline Monitor */}
      <AgentPipeline />
    </div>
  );
}