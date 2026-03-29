import { LatestPost } from "@/components/latest-post";
import { MetricsHydrator } from "@/components/metrics-hydrator";
import { getSnapshot, getConfig } from "@/lib/kv";
import type { TikTokMetrics, Post } from "@/lib/types";

const mockMetrics: TikTokMetrics = {
  followers: 23104,
  monthlyChange: 412,
  reach28d: 66933,
  engagement28d: 5463,
  engagementRate: 2.5,
  views28d: 66933,
  totalLikes: 184200,
  avgWatchTime: "0:08",
  updatedAt: new Date().toISOString(),
  source: "manual",
};

const mockPost: Post = {
  id: "1",
  type: "video",
  caption:
    "I know we said 2026 was the new 2016 but that doesn't mean we still post on YouTube the same way",
  thumbnailUrl: null,
  publishedAt: "2026-03-27T14:30:00Z",
  likes: 212,
  comments: 18,
  views: 8400,
  shares: 45,
  engagementRate: 2.5,
  recentComments: [],
};

async function getData() {
  try {
    const [snapshot, config] = await Promise.all([
      getSnapshot("tt"),
      getConfig(),
    ]);
    if (snapshot) {
      return {
        metrics: snapshot.metrics as TikTokMetrics,
        latestPost: snapshot.latestPosts[0] || null,
        goals: config?.goals,
      };
    }
  } catch {}
  return { metrics: mockMetrics, latestPost: mockPost, goals: { instagram: null, youtube: null, tiktok: { target: 50000, label: "50K" } } };
}

export default async function TikTokPage() {
  const { metrics, latestPost, goals } = await getData();

  return (
    <>
      <MetricsHydrator
        platform="tt"
        platformName="TikTok"
        defaultMetrics={metrics as unknown as Record<string, unknown>}
        defaultGoal={goals?.tiktok ?? { target: 50000, label: "50K" }}
        columns={[
          { label: "Followers", key: "followers", changeKey: "monthlyChange" },
          { label: "28D Views", key: "views28d" },
          { label: "Total Likes", key: "totalLikes" },
          { label: "Avg Watch Time", key: "avgWatchTime", format: "string" },
        ]}
      />

      {latestPost && <LatestPost post={latestPost} platform="tiktok" />}
    </>
  );
}
