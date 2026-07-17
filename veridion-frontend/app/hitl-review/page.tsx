
'use client';

import { useMutation } from '@tanstack/react-query';
import { useAgentStore } from '../../store/store';
import { apiClient } from '../../utils/api';

export default function HitlReviewPage() {
  const { currentStatus, setStatus, addLog } = useAgentStore();

  const hitlMutation = useMutation({
    mutationFn: async (variables: { approved: boolean }) => {
      const { data } = await apiClient.post('/agents/hitl-resolution', {
        approved: variables.approved,
        resolutionTimestamp: new Date().toISOString(),
      });

      return data;
    },

    onSuccess: (_, variables) => {
      setStatus('IDLE');

      addLog(
        variables.approved
          ? '✅ Supervisor approved execution.'
          : '⚠️ Supervisor rejected execution.'
      );
    },

    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        'Unable to communicate with the orchestration service.';

      addLog(`🚨 HITL Error: ${message}`);
    },
  });

  const handleDecision = (approved: boolean) => {
    hitlMutation.mutate({ approved });
  };

  return (
    <div className="space-y-8">

      {/* Header */}

      <div>

        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
          Human Review
        </h1>

        <p className="mt-2 max-w-3xl text-neutral-500">
          Review workflows that require manual approval before the
          orchestration engine can continue execution.
        </p>

      </div>

      {currentStatus !== 'HITL' ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-12 shadow-sm">

          <div className="mx-auto max-w-md text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">

              <svg
                className="h-8 w-8 text-emerald-600"
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

                <circle
                  cx="12"
                  cy="12"
                  r="9"
                />
              </svg>

            </div>

            <h2 className="mt-6 text-2xl font-semibold">
              No Pending Reviews
            </h2>

            <p className="mt-3 text-neutral-500">
              All workflows have completed successfully or are currently
              executing. No human intervention is required.
            </p>

          </div>

        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">

          {/* LEFT */}

          <section className="space-y-6 lg:col-span-2">

            <div className="rounded-2xl border border-amber-300 bg-white p-8 shadow-sm">

              <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-amber-100">

                  <svg
                    className="h-7 w-7 text-amber-700"
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

                </div>

                <div>

                  <h2 className="text-xl font-semibold">
                    Manual Approval Required
                  </h2>

                  <p className="mt-1 text-sm text-neutral-500">
                    The orchestration engine paused execution because one
                    or more compliance checks require human verification.
                  </p>

                </div>

              </div>

              <div className="mt-8 rounded-xl bg-neutral-50 p-6">

                <p className="text-xs uppercase tracking-wider text-neutral-500">
                  Review Summary
                </p>

                <ul className="mt-5 space-y-3 text-sm text-neutral-700">

                  <li>
                    • Compliance validation produced ambiguous output.
                  </li>

                  <li>
                    • Confidence score dropped below approval threshold.
                  </li>

                  <li>
                    • Runtime execution has been paused.
                  </li>

                  <li>
                    • Supervisor confirmation is required.
                  </li>

                </ul>

              </div>

              <div className="mt-8 flex flex-wrap gap-4">

                <button
                  disabled={hitlMutation.isPending}
                  onClick={() => handleDecision(true)}
                  className="rounded-xl bg-black px-6 py-3 font-medium text-white transition hover:bg-neutral-800 disabled:bg-neutral-300"
                >
                  {hitlMutation.isPending
                    ? 'Submitting...'
                    : 'Approve & Continue'}
                </button>

                <button
                  disabled={hitlMutation.isPending}
                  onClick={() => handleDecision(false)}
                  className="rounded-xl border border-red-200 bg-red-50 px-6 py-3 font-medium text-red-700 transition hover:bg-red-100 disabled:opacity-50"
                >
                  Reject Workflow
                </button>

              </div>

            </div>

          </section>

          {/* RIGHT */}

          <aside className="space-y-6">

            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">

              <h3 className="text-lg font-semibold">
                Workflow Status
              </h3>

              <div className="mt-6 space-y-5">

                <div className="flex justify-between">

                  <span className="text-neutral-500">
                    State
                  </span>

                  <span className="font-semibold text-amber-600">
                    Awaiting Review
                  </span>

                </div>

                <div className="flex justify-between">

                  <span className="text-neutral-500">
                    Engine
                  </span>

                  <span>
                    Multi-Agent
                  </span>

                </div>

                <div className="flex justify-between">

                  <span className="text-neutral-500">
                    Compliance
                  </span>

                  <span>
                    Pending
                  </span>

                </div>

                <div className="flex justify-between">

                  <span className="text-neutral-500">
                    Risk Level
                  </span>

                  <span className="font-medium text-amber-600">
                    Medium
                  </span>

                </div>

              </div>

            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">

              <h3 className="text-lg font-semibold">
                Next Action
              </h3>

              <p className="mt-3 text-sm leading-7 text-neutral-500">
                Approve the workflow if the execution logs indicate the
                compliance decision is acceptable. Reject the workflow if
                manual inspection identifies an invalid result.
              </p>

            </div>

          </aside>

        </div>
      )}
    </div>
  );
}
