import { z } from "zod";

export const dashboardFilterSchema = z.object({
  industry: z.string().optional(),
  country: z.string().optional(),
  version: z.string().optional(),
  document: z.string().optional(),
  search: z.string().optional(),
  dateRange: z.enum(["7d", "30d", "90d", "1y"]).default("30d"),
});

export type DashboardFilterValues = z.infer<typeof dashboardFilterSchema>;