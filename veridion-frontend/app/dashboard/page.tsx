'use client';

import React from 'react';
import { AnalyticsTable } from '../../components/AnalyticsTable';
import { useAgentWebSocket } from '../../hooks/useAgentSocket';
import { useAgentStore } from '../../store/store';

export default function DashboardPage() {
  useAgentWebSocket();

  const totalDispatches = useAgentStore((state) => state.totalDispatches);
  const compliancePasses = useAgentStore((state) => state.compliancePasses);
  const hitlTriggers = useAgentStore((state) => state.hitlTriggers);

  const telemetryStats = [
    {
      title: 'Total Executions',
      value: totalDispatches,
      description: 'Agent workflows executed',
      color: 'bg-neutral-900',
      icon: (
        <svg
          className="h-5 w-5 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            d="M13 10V3L4 14h7v7l9-11h-7z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      title: 'Compliance Passed',
      value: compliancePasses,
      description: 'Successful validations',
      color: 'bg-emerald-500',
      icon: (
        <svg
          className="h-5 w-5 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            d="M9 12l2 2 4-4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="12" r="9" />
        </svg>
      ),
    },
    {
      title: 'HITL Reviews',
      value: hitlTriggers,
      description: 'Manual interventions',
      color: 'bg-amber-500',
      icon: (
        <svg
          className="h-5 w-5 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            d="M12 9v2m0 4h.01"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-8">

      {/* Header */}

      <div>

        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
          Analytics Dashboard
        </h1>

        <p className="mt-2 max-w-3xl text-neutral-500">
          Monitor workflow execution, compliance performance, and
          human-in-the-loop activities across the platform.
        </p>

      </div>

      {/* KPI Cards */}

      <section className="grid gap-6 md:grid-cols-3">

        {telemetryStats.map((card) => (

          <div
            key={card.title}
            className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:shadow-md"
          >

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-neutral-500">
                  {card.title}
                </p>

                <h2 className="mt-4 text-4xl font-bold tracking-tight text-neutral-900">
                  {card.value}
                </h2>

                <p className="mt-2 text-sm text-neutral-500">
                  {card.description}
                </p>

              </div>

              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.color}`}
              >
                {card.icon}
              </div>

            </div>

          </div>

        ))}

      </section>

      {/* Overview */}

      <section className="grid gap-6 lg:grid-cols-3">

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">

          <h3 className="text-lg font-semibold text-neutral-900">
            Platform Status
          </h3>

          <div className="mt-6 space-y-4">

            <div className="flex justify-between">

              <span className="text-neutral-500">
                Agent Network
              </span>

              <span className="font-medium text-emerald-600">
                Online
              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-neutral-500">
                Knowledge Base
              </span>

              <span className="font-medium">
                Ready
              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-neutral-500">
                WebSocket
              </span>

              <span className="font-medium">
                Connected
              </span>

            </div>

          </div>

        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm lg:col-span-2">

          <h3 className="text-lg font-semibold text-neutral-900">
            Execution Summary
          </h3>

          <p className="mt-2 text-sm text-neutral-500">
            The orchestration platform continuously monitors execution
            pipelines, validates compliance, and escalates workflows that
            require manual review.
          </p>

          <div className="mt-8 grid grid-cols-3 gap-6">

            <div>

              <p className="text-xs uppercase tracking-wide text-neutral-400">
                Success Rate
              </p>

              <p className="mt-2 text-2xl font-bold">
                {totalDispatches > 0
                  ? `${Math.round(
                      (compliancePasses / totalDispatches) * 100
                    )}%`
                  : '0%'}
              </p>

            </div>

            <div>

              <p className="text-xs uppercase tracking-wide text-neutral-400">
                HITL Rate
              </p>

              <p className="mt-2 text-2xl font-bold">
                {totalDispatches > 0
                  ? `${Math.round(
                      (hitlTriggers / totalDispatches) * 100
                    )}%`
                  : '0%'}
              </p>

            </div>

            <div>

              <p className="text-xs uppercase tracking-wide text-neutral-400">
                Active Version
              </p>

              <p className="mt-2 text-2xl font-bold">
                v1.0
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* Table */}

      <section className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden">

        <div className="border-b border-neutral-200 px-6 py-5">

          <h2 className="text-lg font-semibold text-neutral-900">
            Recent Workflow Executions
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            Latest orchestration runs processed by the platform.
          </p>

        </div>

        <div className="p-6">

          <AnalyticsTable />

        </div>

      </section>

    </div>
  );
}