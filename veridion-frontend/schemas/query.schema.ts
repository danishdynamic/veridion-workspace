import { z } from "zod";

export const querySchema = z.object({
  query: z.string().min(5, "Query must be at least 5 characters"),
  industrySector: z.string().optional(),
  deploymentRegion: z.string().optional(),
  limit: z.number().min(1).max(20).default(5),
});

export type QueryFormData = z.infer<typeof querySchema>;