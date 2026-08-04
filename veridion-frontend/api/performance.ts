import { PerformancePayload } from "@/types/performance";
import { DateRangeType, ServiceType } from "@/schemas/performance.schema";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export async function fetchPerformanceMetrics(
  range: DateRangeType,
  service: ServiceType
): Promise<PerformancePayload> {
  const res = await fetch(`${BASE_URL}/performance?range=${range}&service=${service}`, {
    next: { revalidate: 0 },
  });
  if (!res.ok) throw new Error("Failed to fetch performance telemetry");
  return res.json();
}

export async function triggerBenchmarkRun(): Promise<{ success: boolean; id: string }> {
  const res = await fetch(`${BASE_URL}/performance/benchmark`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to execute benchmark suite");
  return res.json();
}