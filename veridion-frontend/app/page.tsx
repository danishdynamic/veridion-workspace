'use client';

import React from 'react';

export default function HomePage() {
  return (
    <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden">

      {/* background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#f3f4f6,transparent_60%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f5f5f5_1px,transparent_1px),linear-gradient(to_bottom,#f5f5f5_1px,transparent_1px)] bg-[size:48px_48px] opacity-60" />

      <div className="relative mx-auto max-w-5xl text-center">

        <div className="mb-6 inline-flex items-center rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-600 shadow-sm">
          Enterprise AI Platform
        </div>

        <h1 className="text-6xl font-black tracking-tight text-neutral-900 md:text-7xl">
          Veridion
          <br />

          <span className="bg-gradient-to-r from-black via-neutral-700 to-neutral-400 bg-clip-text text-transparent">
            Multi-Agent RAG
          </span>
        </h1>

        <p className="mx-auto mt-8 max-w-3xl text-xl leading-8 text-neutral-500">
          Enterprise strategy execution, compliance intelligence,
          and graph-powered retrieval built for large organizations.
        </p>

        <div className="mt-10 flex justify-center gap-4">

          <button className="rounded-lg bg-black px-7 py-3 text-white transition hover:bg-neutral-800">
            Get Started
          </button>

          <button className="rounded-lg border border-neutral-300 bg-white px-7 py-3 transition hover:bg-neutral-50">
            Documentation
          </button>

        </div>

        <div className="mt-24 grid grid-cols-3 gap-10">

          <div>
            <h2 className="text-4xl font-bold">15+</h2>
            <p className="mt-2 text-neutral-500">
              Specialized AI Agents
            </p>
          </div>

          <div>
            <h2 className="text-4xl font-bold">100%</h2>
            <p className="mt-2 text-neutral-500">
              Compliance Traceability
            </p>
          </div>

          <div>
            <h2 className="text-4xl font-bold">Enterprise</h2>
            <p className="mt-2 text-neutral-500">
              Production Ready
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}