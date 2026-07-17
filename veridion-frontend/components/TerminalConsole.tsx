'use client';

import { useEffect, useRef } from 'react';
import { useAgentStore } from '../store/store';

export const TerminalConsole = () => {
  const { logs, currentStatus } = useAgentStore();
  const consoleEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [logs]);

  const status = {
    RUNNING: {
      label: 'Running',
      color: 'bg-emerald-500',
      badge: 'bg-emerald-50 text-emerald-700',
    },
    HITL: {
      label: 'Awaiting Review',
      color: 'bg-amber-500',
      badge: 'bg-amber-50 text-amber-700',
    },
    IDLE: {
      label: 'Idle',
      color: 'bg-neutral-400',
      badge: 'bg-neutral-100 text-neutral-600',
    },
  }[
    currentStatus === 'RUNNING'
      ? 'RUNNING'
      : currentStatus === 'HITL'
      ? 'HITL'
      : 'IDLE'
  ];

  const getLogStyle = (log: string) => {
    if (log.includes('❌') || log.includes('🚨') || log.includes('Error')) {
      return 'border-red-200 bg-red-50 text-red-700';
    }

    if (log.includes('⚠️') || log.includes('paused')) {
      return 'border-amber-200 bg-amber-50 text-amber-700';
    }

    if (log.includes('✅')) {
      return 'border-emerald-200 bg-emerald-50 text-emerald-700';
    }

    return 'border-neutral-200 bg-white text-neutral-700';
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">

      {/* Header */}

      <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-5">

        <div>

          <h2 className="text-lg font-semibold text-neutral-900">
            Pipeline Activity
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            Live execution logs from the multi-agent workflow
          </p>

        </div>

        <div
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${status.badge}`}
        >
          <span
            className={`h-2 w-2 rounded-full ${status.color} ${
              currentStatus === 'RUNNING' ? 'animate-pulse' : ''
            }`}
          />

          {status.label}
        </div>
      </div>

      {/* Progress */}

      {currentStatus === 'RUNNING' && (
        <div className="h-1 w-full overflow-hidden bg-neutral-100">

          <div className="h-full w-1/3 animate-[pulse_1.2s_ease-in-out_infinite] bg-black" />

        </div>
      )}

      {/* Activity */}

      <div className="h-[420px] overflow-y-auto bg-neutral-50 p-5">

        {logs.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center">

            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">

              <svg
                className="h-7 w-7 text-neutral-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  d="M8 16h8M8 12h8M8 8h5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

            </div>

            <h3 className="text-base font-semibold text-neutral-900">
              No Active Pipeline
            </h3>

            <p className="mt-2 max-w-md text-center text-sm text-neutral-500">
              Start an execution from the Workspace to stream
              real-time agent activity and compliance events.
            </p>

          </div>
        ) : (
          <div className="space-y-3">

            {logs.map((log, index) => (
              <div
                key={index}
                className={`rounded-xl border p-4 transition-all ${getLogStyle(log)}`}
              >
                <div className="mb-2 flex items-center justify-between">

                  <span className="text-xs font-medium uppercase tracking-wide opacity-70">
                    Event #{index + 1}
                  </span>

                  <span className="font-mono text-xs opacity-60">
                    {new Date().toLocaleTimeString()}
                  </span>

                </div>

                <div className="whitespace-pre-wrap break-words font-mono text-sm leading-6">
                  {log}
                </div>
              </div>
            ))}

          </div>
        )}

        <div ref={consoleEndRef} />

      </div>
    </div>
  );
};