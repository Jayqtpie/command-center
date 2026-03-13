"use client";

import { ExecutiveOverview } from "@/components/bands/executive-overview";
import { StrategicFocus } from "@/components/bands/strategic-focus";
import { GrowthIntelligence } from "@/components/bands/growth-intelligence";
import { ContentIntelligence } from "@/components/bands/content-intelligence";
import { OperationsVisibility } from "@/components/bands/operations-visibility";
import { Workbench } from "@/components/bands/workbench";

export default function CommandCenter() {
  return (
    <main className="relative">
      {/* Subtle brand gradient overlay at top */}
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-brand-teal/5 via-transparent to-transparent" />

      <ExecutiveOverview />
      <StrategicFocus />
      <GrowthIntelligence />
      <ContentIntelligence />
      <OperationsVisibility />
      <Workbench />

      {/* Footer whisper */}
      <footer className="text-center py-8 text-[10px] text-text-dim/40 tracking-widest uppercase">
        GuidedBarakah Command Center
      </footer>
    </main>
  );
}
