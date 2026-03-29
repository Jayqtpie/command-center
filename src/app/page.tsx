import { OverviewHydrator } from "@/components/overview-hydrator";
import { getSnapshot, getConfig } from "@/lib/kv";

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
      return { ig: ig.metrics, yt: yt.metrics, tt: tt.metrics, config };
    }
  } catch {}
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

  return (
    <OverviewHydrator
      defaultIg={ig as { followers: number; monthlyChange: number; reach28d: number; engagement28d: number; engagementRate: number }}
      defaultYt={yt as { followers: number; monthlyChange: number; reach28d: number; engagement28d: number; engagementRate: number }}
      defaultTt={tt as { followers: number; monthlyChange: number; reach28d: number; engagement28d: number; engagementRate: number }}
      defaultGoals={config?.goals ?? null}
    />
  );
}
