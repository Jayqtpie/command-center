"use client";

import { useLocalData } from "./local-data-provider";
import { MetricsRow } from "./metrics-row";
import { GoalTracker } from "./goal-tracker";

interface PlatformData {
  followers: number;
  monthlyChange: number;
  reach28d: number;
  engagement28d: number;
  engagementRate: number;
}

interface GoalData {
  instagram?: { target: number; label: string } | null;
  youtube?: { target: number; label: string } | null;
  tiktok?: { target: number; label: string } | null;
}

interface Props {
  defaultIg: PlatformData;
  defaultYt: PlatformData;
  defaultTt: PlatformData;
  defaultGoals: GoalData | null;
}

function merge(defaults: PlatformData, overrides: Record<string, unknown>): PlatformData {
  return {
    followers: Number(overrides.followers ?? defaults.followers),
    monthlyChange: Number(overrides.monthlyChange ?? defaults.monthlyChange),
    reach28d: Number(overrides.reach28d ?? defaults.reach28d),
    engagement28d: Number(overrides.engagement28d ?? defaults.engagement28d),
    engagementRate: Number(overrides.engagementRate ?? defaults.engagementRate),
  };
}

export function OverviewHydrator({ defaultIg, defaultYt, defaultTt, defaultGoals }: Props) {
  const { metrics: localMetrics, config } = useLocalData();

  const ig = merge(defaultIg, localMetrics.ig || {});
  const yt = merge(defaultYt, localMetrics.yt || {});
  const tt = merge(defaultTt, localMetrics.tt || {});

  const combined = ig.followers + yt.followers + tt.followers;
  const combinedChange = ig.monthlyChange + yt.monthlyChange + tt.monthlyChange;
  const totalReach = ig.reach28d + yt.reach28d + tt.reach28d;
  const totalEngagement = ig.engagement28d + yt.engagement28d + tt.engagement28d;
  const avgEngRate = (ig.engagementRate + yt.engagementRate + tt.engagementRate) / 3;

  const goals = config?.goals ?? defaultGoals;

  return (
    <>
      <MetricsRow
        items={[
          {
            label: "Instagram",
            value: ig.followers.toLocaleString(),
            change: `+${ig.monthlyChange} this month`,
          },
          {
            label: "YouTube",
            value: yt.followers.toLocaleString(),
            change: `+${yt.monthlyChange} this month`,
          },
          {
            label: "TikTok",
            value: tt.followers.toLocaleString(),
            change: `+${tt.monthlyChange} this month`,
          },
          {
            label: "Combined",
            value: combined.toLocaleString(),
            change: `+${combinedChange} this month`,
          },
        ]}
      />

      <MetricsRow
        darkBg
        items={[
          { label: "28D Reach", value: totalReach.toLocaleString() },
          { label: "28D Engagement", value: totalEngagement.toLocaleString() },
          { label: "Avg Eng. Rate", value: `${avgEngRate.toFixed(1)}%` },
        ]}
      />

      {goals && (
        <div className="px-9 py-7">
          <div className="text-[10px] tracking-[2px] uppercase text-[--text-secondary] mb-5">
            Goals
          </div>
          <div className="grid grid-cols-2 gap-10">
            {goals.instagram && (
              <GoalTracker
                platform="Instagram"
                current={ig.followers}
                target={goals.instagram.target}
                label={goals.instagram.label}
              />
            )}
            {goals.youtube && (
              <GoalTracker
                platform="YouTube"
                current={yt.followers}
                target={goals.youtube.target}
                label={goals.youtube.label}
              />
            )}
            {goals.tiktok && (
              <GoalTracker
                platform="TikTok"
                current={tt.followers}
                target={goals.tiktok.target}
                label={goals.tiktok.label}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
