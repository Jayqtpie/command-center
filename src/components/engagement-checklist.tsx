"use client";

import { useState, useEffect } from "react";
import type { ChecklistItem } from "@/lib/types";

interface EngagementChecklistProps {
  items: ChecklistItem[];
}

function getStoredCompleted(): { date: string; completed: string[] } {
  if (typeof window === "undefined") return { date: "", completed: [] };
  try {
    const stored = localStorage.getItem("engagement-checklist");
    if (stored) {
      const parsed = JSON.parse(stored);
      const today = new Date().toISOString().slice(0, 10);
      if (parsed.date === today) return parsed;
    }
  } catch {}
  return { date: new Date().toISOString().slice(0, 10), completed: [] };
}

export function EngagementChecklist({ items }: EngagementChecklistProps) {
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    const stored = getStoredCompleted();
    setCompleted(stored.completed);
  }, []);

  function toggle(id: string) {
    setCompleted((prev) => {
      const next = prev.includes(id)
        ? prev.filter((c) => c !== id)
        : [...prev, id];
      const today = new Date().toISOString().slice(0, 10);
      localStorage.setItem(
        "engagement-checklist",
        JSON.stringify({ date: today, completed: next })
      );
      return next;
    });
  }

  return (
    <div className="p-7">
      <div className="flex items-baseline justify-between mb-4">
        <div className="text-[10px] tracking-[2px] uppercase text-[--text-secondary]">
          Engagement Checklist
        </div>
        <div className="text-[11px] font-semibold text-terracotta">
          {completed.length} / {items.length}
        </div>
      </div>
      <div className="flex flex-col gap-[10px]">
        {items.map((item) => {
          const isChecked = completed.includes(item.id);
          return (
            <button
              key={item.id}
              onClick={() => toggle(item.id)}
              className="flex items-center gap-[10px] text-left cursor-pointer bg-transparent border-none p-0"
            >
              <div
                className={`w-[18px] h-[18px] rounded flex-shrink-0 flex items-center justify-center ${
                  isChecked
                    ? "bg-terracotta"
                    : "bg-transparent border-[1.5px] border-[#ccc4b8]"
                }`}
              >
                {isChecked && (
                  <svg width="10" height="10" viewBox="0 0 10 10">
                    <path
                      d="M2 5 L4 7 L8 3"
                      fill="none"
                      stroke="#fff"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
              <span
                className={`text-[13px] ${
                  isChecked
                    ? "text-[--text-secondary] line-through"
                    : "text-[--text-primary]"
                }`}
              >
                {item.text}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
