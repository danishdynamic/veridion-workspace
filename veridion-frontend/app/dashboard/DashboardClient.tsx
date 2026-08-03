"use client";

import React from "react";
import { useDashboard } from "@/hooks/useDashboard";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { IndustryChart } from "@/components/dashboard/IndustryChart";
import { VersionChart } from "@/components/dashboard/VersionChart";
import { AgentChart } from "@/components/dashboard/AgentChart";
import { CacheChart } from "@/components/dashboard/CacheChart";
import { RecentDocuments } from "@/components/dashboard/RecentDocuments";
import { RecentQueries } from "@/components/dashboard/RecentQueries";
import { SystemHealth } from "@/components/dashboard/SystemHealth";
import { DashboardSkeleton } from "@/components/skeletons/DashboardSkeleton";
import { NoAnalytics } from "@/components/dashboard/NoAnalytics";

export default function DashboardClient() {
  const { data, isLoading, isError, refetch } = useDashboard();

  if (isLoading) return <DashboardSkeleton />;
  if (isError || !data) return <NoAnalytics />;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <DashboardHeader
        title="Veridion Analytics & System Health"
        subtitle="Real-time compliance intelligence, agent performance, and infrastructure telemetry"
        lastUpdated={new Date().toLocaleTimeString()}
        onRefresh={() => refetch()}
        loading={isLoading}
      />

      {/* 8 Metric Stat Cards */}
      <StatsGrid stats={data.stats} />

      {/* Main Analytics Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <IndustryChart data={data.industryAnalytics} />
        <VersionChart data={data.versionAnalytics} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AgentChart data={data.agentAnalytics} />
        <CacheChart data={data.cacheAnalytics} />
      </div>

      {/* Recent Activity Data Tables */}
      <RecentDocuments documents={data.recentDocuments} />
      <RecentQueries queries={data.recentQueries} />

      {/* System Infrastructure Telemetry */}
      <SystemHealth health={data.systemHealth} />
    </div>
  );
}