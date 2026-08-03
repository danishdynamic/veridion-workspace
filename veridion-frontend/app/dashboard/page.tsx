import { Metadata } from "next";
import DashboardClient from "./DashboardClient";

export const metadata: Metadata = {
  title: "Analytics Dashboard | Veridion",
  description:
    "Enterprise compliance analytics dashboard for monitoring document versions, AI agent performance, retrieval metrics, and system health.",
  keywords: [
    "Compliance Dashboard",
    "AI Analytics",
    "Document Version Tracking",
    "Regulatory Intelligence",
    "RAG Analytics",
  ],
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardPage() {
  return <DashboardClient />;
}