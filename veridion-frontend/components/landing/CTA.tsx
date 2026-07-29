"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="rounded-3xl bg-blue-600 p-8 sm:p-12 text-center text-white shadow-xl dark:bg-blue-600/90"
      >
        <h2 className="text-3xl font-extrabold sm:text-4xl">Ready to analyze your regulations?</h2>
        <p className="mt-4 text-blue-100 max-w-xl mx-auto text-base">
          Upload your legislative document versions and start real-time multi-agent compliance audits.
        </p>
        <div className="mt-8 flex justify-center">
          <Link href="/documents">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 font-bold gap-2">
              Upload Acts
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}