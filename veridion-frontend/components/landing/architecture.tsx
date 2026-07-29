"use client";
import React from "react";
import { motion } from "framer-motion";
import { ArrowDown, Server, Database, Layers, Cpu, HardDrive } from "lucide-react";

export function Architecture() {
  const blocks = [
    { title: "Next.js 14", desc: "App Router Frontend & UI", icon: Layers, color: "text-blue-500" },
    { title: "Node.js Server", desc: "Express & WebSocket Gateway", icon: Server, color: "text-green-500" },
    { title: "LangGraph Orchestrator", desc: "4-Node Domain Agent Graph", icon: Cpu, color: "text-purple-500" },
    { title: "FastAPI Engine", desc: "Document Ingestion & Version Diffs", icon: Server, color: "text-emerald-500" },
    { title: "Postgres + pgvector", desc: "4-Tier Hierarchy (768d Embeddings)", icon: Database, color: "text-cyan-500" },
    { title: "Redis & BullMQ", desc: "Semantic Cache & Async Telemetry", icon: HardDrive, color: "text-red-500" },
  ];

  return (
    <section id="architecture" className="py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
          System Architecture
        </h2>
        <p className="mt-3 text-base text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">
          Decoupled high-performance backend stack separating LLM graph execution from database state.
        </p>
      </div>

      <div className="max-w-xl mx-auto flex flex-col items-center">
        {blocks.map((block, index) => {
          const Icon = block.icon;
          return (
            <React.Fragment key={block.title}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="w-full rounded-xl border border-zinc-200 bg-white p-4 shadow-sm flex items-center gap-4 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className={`p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800 ${block.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900 dark:text-white">{block.title}</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">{block.desc}</p>
                </div>
              </motion.div>

              {index < blocks.length - 1 && (
                <div className="my-2 flex justify-center text-zinc-400 dark:text-zinc-600">
                  <ArrowDown className="h-5 w-5 animate-pulse" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </section>
  );
}