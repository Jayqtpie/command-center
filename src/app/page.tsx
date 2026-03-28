import { MetricsRow } from "@/components/metrics-row";
import { GoalTracker } from "@/components/goal-tracker";
import { getSnapshot, getConfig } from "@/lib/kv";

// Mock data used when KV is not configured (local dev)
const mockData = {
  ig: { followers: 12847, monthlyChange: 103, reach28d: 54210, engagement28d: 6200, engagementRate: 4.7 },
  yt: { followers: 8421, monthlyChange: 67, reach28d: 42100, engagement28d: 5800, engagementRate: 3.2 },
  tt: { followers: 23104, monthlyChange: 412, reach28d: 66933, engagement28d: 5463, engagementRate: 2.5 },
};

async function getData() {
  try {
    const [ig, yt, tt, config] = await Promise.all([
      getSnapshot("ig"),
      getSnapshot("yt"),
      getSnapshot("tt"),
      getConfig(),
    ]);
    if (ig && yt && tt) {
      return {
        ig: ig.metrics,
        yt: yt.metrics,
        tt: tt.metrics,
        config,
      };
    }
  } catch {
    // KV not configured — fall through to mock data
  }
  return {
    ig: mockData.ig,
    yt: mockData.yt,
    tt: mockData.tt,
    config: {
      goals: {
        instagram: { target: 25000, label: "25K" },
        youtube: { target: 10000, label: "10K" },
        tiktok: { target: 50000, label: "50K" },
      },
      checklist: [],
    },
  };
}

export default async function OverviewPage() {
  const { ig, yt, tt, config } = await getData();

  const igFollowers = "followers" in ig ? ig.followers : 0;
  const ytFollowers = "followers" in yt ? yt.followers : 0;
  const ttFollowers = "followers" in tt ? tt.followers : 0;
  const igChange = "monthlyChange" in ig ? ig.monthlyChange : 0;
  const ytChange = "monthlyChange" in yt ? yt.monthlyChange : 0;
  const ttChange = "monthlyChange" in tt ? tt.monthlyChange : 0;

  const combined = igFollowers + ytFollowers + ttFollowers;
  const combinedChange = igChange + ytChange + ttChange;

  const totalReach =
    ("reach28d" in ig ? ig.reach28d : 0) +
    ("reach28d" in yt ? yt.reach28d : 0) +
    ("reach28d" in tt ? tt.reach28d : 0);

  const totalEngagement =
    ("engagement28d" in ig ? ig.engagement28d : 0) +
    ("engagement28d" in yt ? yt.engagement28d : 0) +
    ("engagement28d" in tt ? tt.engagement28d : 0);

  const avgEngRate =
    (("engagementRate" in ig ? ig.engagementRate : 0) +
      ("engagementRate" in yt ? yt.engagementRate : 0) +
      ("engagementRate" in tt ? tt.engagementRate : 0)) /
    3;

  const goals = config?.goals;

  return (
    <>
      <MetricsRow
        items={[
          {
            label: "Instagram",
            value: igFollowers.toLocaleString(),
            change: `+${igChange} this month`,
          },
          {
            label: "YouTube",
            value: ytFollowers.toLocaleString(),
            change: `+${ytChange} this month`,
          },
          {
            label: "TikTok",
            value: ttFollowers.toLocaleString(),
            change: `+${ttChange} this month`,
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
          {
            label: "Avg Eng. Rate",
            value: `${avgEngRate.toFixed(1)}%`,
          },
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
                current={igFollowers}
                target={goals.instagram.target}
                label={goals.instagram.label}
              />
            )}
            {goals.youtube && (
              <GoalTracker
                platform="YouTube"
                current={ytFollowers}
                target={goals.youtube.target}
                label={goals.youtube.label}
              />
            )}
            {goals.tiktok && (
              <GoalTracker
                platform="TikTok"
                current={ttFollowers}
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
