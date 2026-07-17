'use client';

import { useState } from 'react';

interface RowData {
  id: string;
  sector: string;
  region: string;
  latency: number;
  status: 'IDLE' | 'RUNNING' | 'HITL' | string;
}

const rows: RowData[] = [
  {
    id: 'tx_8f2d91a0',
    sector: 'Chemicals',
    region: 'Europe (REACH)',
    latency: 1420,
    status: 'IDLE',
  },
  {
    id: 'tx_3c9e4b12',
    sector: 'Finance',
    region: 'Global (MiFID II)',
    latency: 890,
    status: 'HITL',
  },
  {
    id: 'tx_9e2f5d11',
    sector: 'Chemicals',
    region: 'Europe (RoHS)',
    latency: 1150,
    status: 'RUNNING',
  },
];

export function AnalyticsTable() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleAll = (checked: boolean) => {
    setSelectedIds(checked ? rows.map((r) => r.id) : []);
  };

  const toggleRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const styles = {
      IDLE: {
        text: 'Passed',
        bg: 'bg-emerald-50',
        color: 'text-emerald-700',
        dot: 'bg-emerald-500',
      },
      RUNNING: {
        text: 'Running',
        bg: 'bg-blue-50',
        color: 'text-blue-700',
        dot: 'bg-blue-500',
      },
      HITL: {
        text: 'Review',
        bg: 'bg-amber-50',
        color: 'text-amber-700',
        dot: 'bg-amber-500',
      },
    }[status] || {
      text: status,
      bg: 'bg-neutral-100',
      color: 'text-neutral-700',
      dot: 'bg-neutral-400',
    };

    return (
      <span
        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${styles.bg} ${styles.color}`}
      >
        <span className={`h-2 w-2 rounded-full ${styles.dot}`} />
        {styles.text}
      </span>
    );
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">

      {/* Header */}

      <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-5">

        <div>
          <h2 className="text-lg font-semibold text-neutral-900">
            Recent Executions
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            Latest compliance pipeline executions
          </p>
        </div>

        <button className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium transition hover:bg-neutral-50">
          Export
        </button>

      </div>

      {/* Table */}

      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead className="sticky top-0 bg-white">

            <tr className="border-b border-neutral-200 text-left text-sm text-neutral-500">

              <th className="w-14 px-6 py-4">

                <input
                  type="checkbox"
                  checked={
                    selectedIds.length === rows.length &&
                    rows.length > 0
                  }
                  onChange={(e) => toggleAll(e.target.checked)}
                  className="accent-black"
                />

              </th>

              <th className="px-6 py-4 font-medium">
                Execution ID
              </th>

              <th className="px-6 py-4 font-medium">
                Industry
              </th>

              <th className="px-6 py-4 font-medium">
                Region
              </th>

              <th className="px-6 py-4 font-medium">
                Latency
              </th>

              <th className="px-6 py-4 font-medium">
                Status
              </th>

            </tr>

          </thead>

          <tbody>

            {rows.map((row) => {
              const selected = selectedIds.includes(row.id);

              return (
                <tr
                  key={row.id}
                  className={`
                    border-b border-neutral-100
                    transition
                    hover:bg-neutral-50

                    ${selected ? 'bg-neutral-50' : ''}
                  `}
                >
                  <td className="px-6 py-5">

                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleRow(row.id)}
                      className="accent-black"
                    />

                  </td>

                  <td className="px-6 py-5">

                    <span className="rounded-md bg-neutral-100 px-2 py-1 font-mono text-xs">
                      {row.id}
                    </span>

                  </td>

                  <td className="px-6 py-5 font-medium text-neutral-900">
                    {row.sector}
                  </td>

                  <td className="px-6 py-5 text-neutral-600">
                    {row.region}
                  </td>

                  <td className="px-6 py-5">

                    <span className="font-medium text-neutral-900">
                      {row.latency}
                    </span>

                    <span className="ml-1 text-neutral-500">
                      ms
                    </span>

                  </td>

                  <td className="px-6 py-5">
                    <StatusBadge status={row.status} />
                  </td>

                </tr>
              );
            })}

          </tbody>

        </table>

      </div>

      {/* Footer */}

      <div className="flex items-center justify-between border-t border-neutral-200 bg-neutral-50 px-6 py-4">

        <p className="text-sm text-neutral-500">
          {selectedIds.length} selected • {rows.length} total executions
        </p>

        <button className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium transition hover:bg-neutral-100">
          View All
        </button>

      </div>

    </div>
  );
}