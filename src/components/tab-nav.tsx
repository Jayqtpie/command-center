"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { label: "Overview", href: "/" },
  { label: "Instagram", href: "/instagram" },
  { label: "YouTube", href: "/youtube" },
  { label: "TikTok", href: "/tiktok" },
];

export function TabNav() {
  const pathname = usePathname();

  return (
    <div className="flex gap-6 mt-5 border-b border-[--border]">
      {tabs.map((tab) => {
        const isActive =
          tab.href === "/"
            ? pathname === "/"
            : pathname.startsWith(tab.href);

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`pb-[10px] text-[13px] transition-colors ${
              isActive
                ? "font-semibold tracking-wide text-[--text-primary] border-b-2 border-terracotta"
                : "text-[--text-secondary] hover:text-[--text-primary]"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
