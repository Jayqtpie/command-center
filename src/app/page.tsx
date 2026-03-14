"use client";

import { DataProvider } from "@/lib/data-context";
import { ExecutiveOverview } from "@/components/bands/executive-overview";
import { PostPerformance } from "@/components/bands/post-performance";
import { GrowthIntelligence } from "@/components/bands/growth-intelligence";
import { Schedule } from "@/components/bands/schedule";

export default function CommandCenter() {
  return (
    <DataProvider>
      <main className="relative">
        <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-brand-teal/5 via-transparent to-transparent" />

        <ExecutiveOverview />
        <PostPerformance />
        <GrowthIntelligence />
        <Schedule />

        <footer className="text-center py-8 text-[10px] text-text-dim/40 tracking-widest uppercase">
          GuidedBarakah Command Center
        </footer>
      </main>
    </DataProvider>
  );
}
