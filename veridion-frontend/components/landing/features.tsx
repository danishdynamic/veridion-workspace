"use client";

import { motion } from "framer-motion";
import { GitCompare, Bot, Database } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card" // fallback wrapper or card imports;

// Using direct card HTML styling for full control matching instructions
export function Features() {
  const features = [
    {
      title: "Version Detection",
      description: "Upload multiple document versions and automatically identify structural changes and clause-level diffs.",
      icon: GitCompare,
      details: ["Automatic diffing", "Clause-level history", "Inactive vs Active states"],
    },
    {
      title: "Multi-Agent Analysis",
      description: "Decoupled LangGraph agent graph running Retrieval, Version Comparison, and Form Guidance pipelines.",
      icon: Bot,
      details: ["Real-time WS events", "Human-In-The-Loop capability", "Groundedness telemetry"],
    },
    {
      title: "Advanced Retrieval",
      description: "PostgreSQL pgvector database with hybrid vector-keyword retrieval and Redis semantic caching.",
      icon: Database,
      details: ["Gemini text-embedding-004", "Redis Cache", "Sub-15ms evaluator"],
    },
  ];

  return (
    <section className="py-20 bg-zinc-50 dark:bg-zinc-900/50">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
          Engineered for Regulatory Complexity
        </h2>
        <p className="mt-3 text-base text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">
          High-performance backend split into stateful orchestration and vectorized PostgreSQL storage.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 mb-5">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{feature.title}</h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {feature.description}
              </p>
              <ul className="mt-4 space-y-2 border-t border-zinc-100 pt-4 dark:border-zinc-800">
                {feature.details.map((item) => (
                  <li key={item} className="flex items-center text-xs text-zinc-500 dark:text-zinc-400">
                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-blue-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}