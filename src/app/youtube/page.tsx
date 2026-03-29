import { LatestPost } from "@/components/latest-post";
import { MetricsHydrator } from "@/components/metrics-hydrator";
import { getSnapshot, getConfig } from "@/lib/kv";
import type { YouTubeMetrics, Post } from "@/lib/types";

const mockMetrics: YouTubeMetrics = {
  followers: 8421,
  subscribers: 8421,
  monthlyChange: 67,
  reach28d: 42100,
  engagement28d: 5800,
  engagementRate: 3.2,
  views28d: 42100,
  watchTimeHours: 1250,
  avgViewDuration: "4:32",
  updatedAt: new Date().toISOString(),
  source: "manual",
};

const mockPost: Post = {
  id: "1",
  type: "video",
  caption: "4 things that don't work anymore on YouTube that worked in 2016",
  thumbnailUrl: null,
  publishedAt: "2026-03-25T18:00:00Z",
  likes: 34,
  comments: 12,
  views: 2100,
  engagementRate: 1.6,
  recentComments: [
    { username: "tessbarclay", text: "The creators who were there for the bye sister era get it" },
  ],
};

async function getData() {
  try {
    const [snapshot, config] = await Promise.all([
      getSnapshot("yt"),
      getConfig(),
    ]);
    if (snapshot) {
      return {
        metrics: snapshot.metrics as YouTubeMetrics,
        latestPost: snapshot.latestPosts[0] || null,
        goals: config?.goals,
      };
    }
  } catch {}
  return { metrics: mockMetrics, latestPost: mockPost, goals: { instagram: null, youtube: { target: 10000, label: "10K" }, tiktok: null } };
}

export default async function YouTubePage() {
  const { metrics, latestPost, goals } = await getData();

  return (
    <>
      <MetricsHydrator
        platform="yt"
        platformName="YouTube"
        defaultMetrics={metrics as unknown as Record<string, unknown>}
        defaultGoal={goals?.youtube ?? { target: 10000, label: "10K" }}
        followerKey="subscribers"
        columns={[
          { label: "Subscribers", key: "subscribers", changeKey: "monthlyChange" },
          { label: "28D Views", key: "views28d" },
          { label: "Watch Time", key: "watchTimeHours", suffix: " hrs" },
          { label: "Avg Duration", key: "avgViewDuration", format: "string" },
        ]}
      />

      {latestPost && <LatestPost post={latestPost} platform="youtube" />}
    </>
  );
}
