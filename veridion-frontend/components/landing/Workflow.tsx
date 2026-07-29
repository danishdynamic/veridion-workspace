"use client";

import { motion } from "framer-motion";

export function Workflow() {
  const steps = [
    { num: "01", title: "Upload Regulation", desc: "Upload multi-page legislative PDFs to FastAPI." },
    { num: "02", title: "Chunking & Embedding", desc: "Parsed into Document → Version → Section → Clause using Gemini embeddings." },
    { num: "03", title: "Version Storage", desc: "Stored in PostgreSQL with pgvector indexes." },
    { num: "04", title: "User Submits Form", desc: "Compliance question or form payload submitted via Next.js." },
    { num: "05", title: "Retrieval & Comparator", desc: "LangGraph fetches sections and computes structured diffs." },
    { num: "06", title: "Form Guidance Agent", desc: "Cross-checks compliance diffs against target form inputs." },
    { num: "07", title: "Compliance Report", desc: "Live streamed over WebSocket with evidence & metrics." },
  ];

  return (
    <section className="py-20 bg-zinc-50 dark:bg-zinc-900/50">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
          End-to-End Workflow
        </h2>
        <p className="mt-3 text-base text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">
          From raw legal text to structured compliance guidance in real time.
        </p>
      </div>

      <div className="relative max-w-3xl mx-auto border-l-2 border-blue-500/30 pl-6 sm:pl-8 space-y-8">
        {steps.map((step, idx) => (
          <motion.div
            key={step.num}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.08 }}
            className="relative flex items-start gap-4"
          >
            {/* Timeline Dot */}
            <div className="absolute -left-[31px] sm:-left-[39px] top-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold ring-4 ring-white dark:ring-zinc-950">
              {idx + 1}
            </div>

            <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 w-full">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-zinc-900 dark:text-white text-base">
                  {step.title}
                </h3>
                <span className="text-xs font-mono text-blue-600 dark:text-blue-400 font-bold">
                  STEP {step.num}
                </span>
              </div>
              <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">{step.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}