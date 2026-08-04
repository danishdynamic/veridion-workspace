import { z } from "zod";

export const agentQuerySchema = z.object({
  query: z.string().min(5, "Query must be at least 5 characters long"),
  industrySector: z.string().min(1, "Please select an industry sector"),
  deploymentRegion: z.string().min(1, "Please select a deployment region"),
});

export const agentStatusSchema = z.enum(["idle", "running", "success", "failed", "waiting"]);

export const agentExecutionSchema = z.object({
  id: z.string().min(1, "Execution ID is required"),
  agentName: z.string().min(1, "Agent name is required"),
  status: agentStatusSchema,
  date: z.string().datetime().or(z.string()),
  pipeline: z.string().optional(),
  search: z.string().optional(),
});

export const filterAgentSchema = z.object({
  search: z.string().optional(),
  status: agentStatusSchema.optional().or(z.literal("all")),
  dateRange: z.object({
    from: z.string().optional(),
    to: z.string().optional(),
  }).optional(),
});

export type AgentExecutionSchemaInput = z.infer<typeof agentExecutionSchema>;
export type FilterAgentSchemaInput = z.infer<typeof filterAgentSchema>;

export type AgentQueryFormValues = z.infer<typeof agentQuerySchema>;