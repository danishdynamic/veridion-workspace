import { z } from "zod";

export const ServiceEnum = z.enum(["all", "fastapi", "nodejs", "nextjs", "redis"]);
export type ServiceType = z.infer<typeof ServiceEnum>;

export const DateRangeEnum = z.enum(["1h", "24h", "7d", "30d"]);
export type DateRangeType = z.infer<typeof DateRangeEnum>;

export const PerformanceQuerySchema = z.object({
  service: ServiceEnum.default("all"),
  range: DateRangeEnum.default("24h"),
  benchmark: z.string().optional(),
  warningsOnly: z.boolean().optional(),
});

export type PerformanceQuery = z.infer<typeof PerformanceQuerySchema>;