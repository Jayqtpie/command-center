"use client";

import { cn } from "@/lib/utils";
import type { Platform } from "@/data/mock";

const platformColors: Record<Platform, string> = {
  instagram: "text-[#E1306C]",
  tiktok: "text-[#00F2EA]",
  youtube: "text-[#FF0000]",
};

const platformBg: Record<Platform, string> = {
  instagram: "bg-[#E1306C]/10",
  tiktok: "bg-[#00F2EA]/10",
  youtube: "bg-[#FF0000]/10",
};

export function PlatformIcon({ platform, size = "md" }: { platform: Platform; size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "w-4 h-4 text-[10px]", md: "w-8 h-8 text-xs", lg: "w-10 h-10 text-sm" };
  const labels = { instagram: "IG", tiktok: "TT", youtube: "YT" };

  return (
    <div className={cn("rounded-lg flex items-center justify-center font-bold shrink-0", sizes[size], platformBg[platform], platformColors[platform])}>
      {labels[platform]}
    </div>
  );
}

export { platformColors, platformBg };
