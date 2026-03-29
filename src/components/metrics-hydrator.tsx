"use client";

import { useLocalData } from "./local-data-provider";
import { MetricsRow } from "./metrics-row";
import { GoalTracker } from "./goal-tracker";

type Platform = "ig" | "yt" | "tt";
type PlatformName = "Instagram" | "YouTube" | "TikTok";

interface MetricDisplay {
  label: string;
  key: string;
  changeKey?: string;
  suffix?: string;
  prefix?: string;
  format?: "number" | "string";
}

interface Props {
  platform: Platform;
  platformName: PlatformName;
  defaultMetrics: Record<string, unknown>;
  columns: MetricDisplay[];
  defaultGoal: { target: number; label: string } | null;
  followerKey?: string;
}

export function MetricsHydrator({
  platform,
  platformName,
  defaultMetrics,
  columns,
  defaultGoal,
  followerKey = "followers",
}: Props) {
  const { metrics: localMetrics, config } = useLocalData();

  const merged = { ...defaultMetrics, ...localMetrics[platform] };
  const goalKey = platformName.toLowerCase() as "instagram" | "youtube" | "tiktok";
  const goal = config?.goals?.[goalKey] ?? defaultGoal;

  const items = columns.map((col) => {
    const raw = merged[col.key];
    const formatted =
      col.format === "string"
        ? String(raw || "0:00")
        : Number(raw || 0).toLocaleString();
    const value = `${col.prefix || ""}${formatted}${col.suffix || ""}`;

    const item: { label: string; value: string; change?: string } = {
      label: col.label,
      value,
    };

    if (col.changeKey) {
      item.change = `+${Number(merged[col.changeKey] || 0)} this month`;
    }

    return item;
  });

  return (
    <>
      <MetricsRow items={items} />
      {goal && (
        <div className="px-9 py-7">
          <div className="text-[10px] tracking-[2px] uppercase text-[--text-secondary] mb-5">
            Goal
          </div>
          <GoalTracker
            platform={platformName}
            current={Number(merged[followerKey]) || 0}
            target={goal.target}
            label={goal.label}
          />
        </div>
      )}
    </>
  );
}
