'use client';

import { useState } from 'react';
import { useAgentStore } from '../../store/store';
import { useAgentWebSocket } from '../../hooks/useAgentSocket';
import { useOrchestrate } from '../../hooks/useOrchestrate';
import { TerminalConsole } from '../../components/TerminalConsole';

export default function AgentsPage() {
  useAgentWebSocket();

  const { clientId, currentStatus } = useAgentStore();
  const orchestrateMutation = useOrchestrate();

  const [queryText, setQueryText] = useState('');
  const [sector, setSector] = useState('Chemicals');
  const [region, setRegion] = useState('Europe');

  const handleRun = () => {
    if (!queryText.trim()) return;

    orchestrateMutation.mutate({
      query: queryText,
      industrySector: sector,
      deploymentRegion: region,
      clientId,
    });
  };

  return (
    <div className="space-y-8">

      {/* Header */}

      <div>

        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
          Agent Workspace
        </h1>

        <p className="mt-2 max-w-3xl text-neutral-500">
          Configure and execute enterprise compliance workflows using the
          multi-agent orchestration engine.
        </p>

      </div>

      {/* Layout */}

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-5">

        {/* Left */}

        <section className="xl:col-span-2">

          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">

            <h2 className="text-lg font-semibold text-neutral-900">
              Workflow Configuration
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              Configure the orchestration request before starting execution.
            </p>

            {/* Prompt */}

            <div className="mt-8">

              <label className="mb-2 block text-sm font-medium text-neutral-700">
                Prompt
              </label>

              <textarea
                rows={8}
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
                placeholder="Describe the compliance workflow or extraction task..."
                className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-black"
              />

            </div>

            {/* Configuration */}

            <div className="mt-6 grid grid-cols-1 gap-4">

              <div>

                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Industry
                </label>

                <select
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-black"
                >
                  <option>Chemicals</option>
                  <option>Finance</option>
                  <option>Healthcare</option>
                  <option>Energy</option>
                </select>

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Deployment Region
                </label>

                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-black"
                >
                  <option>Europe</option>
                  <option>North America</option>
                  <option>Asia Pacific</option>
                </select>

              </div>

            </div>

            {/* Metadata */}

            <div className="mt-8 grid grid-cols-2 gap-4">

              <div className="rounded-xl bg-neutral-50 p-4">

                <p className="text-xs uppercase tracking-wide text-neutral-500">
                  Client ID
                </p>

                <p className="mt-2 truncate font-mono text-sm text-neutral-900">
                  {clientId}
                </p>

              </div>

              <div className="rounded-xl bg-neutral-50 p-4">

                <p className="text-xs uppercase tracking-wide text-neutral-500">
                  Status
                </p>

                <div className="mt-2 flex items-center gap-2">

                  <div
                    className={`h-2.5 w-2.5 rounded-full ${
                      currentStatus === 'RUNNING'
                        ? 'bg-emerald-500 animate-pulse'
                        : currentStatus === 'HITL'
                        ? 'bg-amber-500'
                        : 'bg-neutral-400'
                    }`}
                  />

                  <span className="text-sm font-medium">

                    {currentStatus === 'RUNNING'
                      ? 'Running'
                      : currentStatus === 'HITL'
                      ? 'Awaiting Review'
                      : 'Idle'}

                  </span>

                </div>

              </div>

            </div>

            {/* Button */}

            <button
              onClick={handleRun}
              disabled={
                currentStatus === 'RUNNING' ||
                !queryText.trim() ||
                orchestrateMutation.isPending
              }
              className="mt-8 flex w-full items-center justify-center rounded-xl bg-black px-4 py-3 font-medium text-white transition hover:bg-neutral-800 disabled:bg-neutral-200 disabled:text-neutral-500"
            >
              {orchestrateMutation.isPending
                ? 'Starting Workflow...'
                : 'Execute Pipeline'}
            </button>

          </div>

        </section>

        {/* Right */}

        <section className="xl:col-span-3 space-y-6">

          {/* Summary */}

          <div className="grid grid-cols-3 gap-4">

            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">

              <p className="text-xs uppercase tracking-wide text-neutral-500">
                Industry
              </p>

              <p className="mt-2 text-lg font-semibold text-neutral-900">
                {sector}
              </p>

            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">

              <p className="text-xs uppercase tracking-wide text-neutral-500">
                Region
              </p>

              <p className="mt-2 text-lg font-semibold text-neutral-900">
                {region}
              </p>

            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">

              <p className="text-xs uppercase tracking-wide text-neutral-500">
                Execution
              </p>

              <p className="mt-2 text-lg font-semibold text-neutral-900">
                {currentStatus}
              </p>

            </div>

          </div>

          {/* Activity */}

          <TerminalConsole />

        </section>

      </div>

    </div>
  );
}