export function getHealthBadgeColor(status: string): string {
  switch (status.toLowerCase()) {
    case "online":
    case "healthy":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "degraded":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "offline":
      return "bg-rose-50 text-rose-700 border-rose-200";
    default:
      return "bg-zinc-50 text-zinc-600 border-zinc-200";
  }
}