import type { Metadata } from "next";
import { DashboardView } from "@/components/DashboardView";

export const metadata: Metadata = {
  title: "Dashboard — BetaDigest",
  description: "Subscriber briefing dashboard: next dispatch countdown, hyperlocal weather, and curated editorial feed.",
};

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[var(--canvas)] text-[var(--text)]">
      <DashboardView />
    </main>
  );
}
