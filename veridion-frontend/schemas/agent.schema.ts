import { z } from "zod";

export const agentQuerySchema = z.object({
  query: z.string().min(5, "Query must be at least 5 characters long"),
  industrySector: z.string().min(1, "Please select an industry sector"),
  deploymentRegion: z.string().min(1, "Please select a deployment region"),
});

export type AgentQueryFormValues = z.infer<typeof agentQuerySchema>;