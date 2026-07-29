"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Cpu, CheckCircle2 } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28 bg-gradient-to-b from-blue-50/50 via-white to-white dark:from-zinc-900/40 dark:via-zinc-950 dark:to-zinc-950">
      {/* Background Gradient Mesh */}
      <div className="absolute top-0 left-1/2 -z-10 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-blue-400/10 blur-3xl dark:bg-blue-600/10" />

      <div className="flex flex-col items-center text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3 py-1 text-xs font-semibold text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/50 dark:text-blue-300 mb-6"
        >
          <Cpu className="h-3.5 w-3.5" />
          <span>Multi-Agent LangGraph + FastAPI Pipeline</span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-4xl text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-5xl md:text-6xl lg:text-6xl"
        >
          AI-Powered Regulatory <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Version Intelligence
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 max-w-2xl text-base text-zinc-600 dark:text-zinc-400 sm:text-lg"
        >
          Track document versions, compare legislative changes, and guide users to the correct form sections using multi-agent RAG.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 flex flex-col sm:flex-row items-center gap-4"
        >
          <Link href="/documents">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-lg shadow-blue-500/20">
              Upload Acts
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <a href="#architecture">
            <Button size="lg" variant="outline" className="border-zinc-300 dark:border-zinc-800">
              View Architecture
            </Button>
          </a>
        </motion.div>

        {/* Mock Graphic / Card Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-14 w-full max-w-4xl rounded-2xl border border-zinc-200 bg-white/70 p-4 sm:p-6 shadow-2xl backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/70"
        >
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-400" />
              <div className="h-3 w-3 rounded-full bg-yellow-400" />
              <div className="h-3 w-3 rounded-full bg-green-400" />
            </div>
            <span className="text-xs text-zinc-400 font-mono">Live Agent Audit Stream</span>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-left">
            <div className="rounded-lg border border-zinc-100 p-3 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
                <CheckCircle2 className="h-3.5 w-3.5" /> Retrieval Agent
              </div>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Fetched Section 4.1 & Clause 12b (pgvector 768d)</p>
            </div>
            <div className="rounded-lg border border-zinc-100 p-3 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <CheckCircle2 className="h-3.5 w-3.5" /> Version Comparator
              </div>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Diff computed: 2024 Act updates threshold to 15%</p>
            </div>
            <div className="rounded-lg border border-zinc-100 p-3 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" /> Form Guidance Agent
              </div>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Part 6 Form requires update on field #3</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}