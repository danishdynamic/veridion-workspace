import { z } from "zod";

export const evaluationFilterSchema = z.object({
  dateRange: z.string().default("7d"),
  document: z.string().default("all"),
  version: z.string().default("all"),
  industry: z.string().default("all"),
  minimumScore: z.number().min(0).max(100).default(0),
  showFailuresOnly: z.boolean().default(false),
  searchQuery: z.string().optional(),
});

export const runEvaluationSchema = z.object({
  query: z.string().min(3, "Query must be at least 3 characters"),
  context: z.array(z.string()).min(1, "At least one context string is required"),
  answer: z.string().min(1, "Generated answer is required"),
  documentId: z.string().optional(),
  version: z.string().optional(),
});

export type RunEvaluationInput = z.infer<typeof runEvaluationSchema>;