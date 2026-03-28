import { MetricsRow } from "@/components/metrics-row";
import { GoalTracker } from "@/components/goal-tracker";
import { LatestPost } from "@/components/latest-post";
import { EngagementTimer } from "@/components/engagement-timer";
import { EngagementChecklist } from "@/components/engagement-checklist";
import { getSnapshot, getConfig } from "@/lib/kv";
import type { InstagramMetrics, Post, ChecklistItem } from "@/lib/types";

const defaultChecklist: ChecklistItem[] = [
  { id: "1", text: "Comment on 5 Reels in your niche" },
  { id: "2", text: "Reply to 3 Stories from peers" },
  { id: "3", text: "Like 10 posts from hashtag feed" },
  { id: "4", text: "Reply to all DMs" },
  { id: "5", text: "Share a post to your Story" },
  { id: "6", text: "Reply to all comments on latest post" },
  { id: "7", text: "Send 3 DMs to engaged followers" },
];

const mockMetrics: InstagramMetrics = {
  followers: 12847,
  monthlyChange: 103,
  reach28d: 54210,
  engagement28d: 6200,
  engagementRate: 4.7,
  profileViews28d: 9765,
  accountsEngaged28d: 9765,
  updatedAt: new Date().toISOString(),
  source: "manual",
};

const mockPost: Post = {
  id: "1",
  type: "reel",
  caption:
    "Hot take: Time stamps are one of the most important things to add to your YouTube video. You just add them by droppin...",
  thumbnailUrl: null,
  publishedAt: "2026-03-26T09:15:00Z",
  likes: 118,
  comments: 8,
  engagementRate: 0.44,
  recentComments: [
    { username: "racquelhenry", text: "I will be adding them from now on! Thanks!" },
    { username: "enter.angela", text: "Had no idea" },
  ],
};

async function getData() {
  try {
    const [snapshot, config] = await Promise.all([
      getSnapshot("ig"),
      getConfig(),
    ]);
    if (snapshot) {
      return {
        metrics: snapshot.metrics as InstagramMetrics,
        latestPost: snapshot.latestPosts[0] || null,
        checklist: config?.checklist || defaultChecklist,
        goals: config?.goals,
      };
    }
  } catch {}
  return {
    metrics: mockMetrics,
    latestPost: mockPost,
    checklist: defaultChecklist,
    goals: { instagram: { target: 25000, label: "25K" }, youtube: null, tiktok: null },
  };
}

export default async function InstagramPage() {
  const { metrics, latestPost, checklist, goals } = await getData();

  return (
    <>
      {/* Engagement Timer + Checklist */}
      <div className="mx-9 mt-6 grid grid-cols-2 bg-linen-dark rounded-xl border border-[--border] overflow-hidden">
        <EngagementTimer />
        <EngagementChecklist items={checklist} />
      </div>

      {/* Metrics */}
      <MetricsRow
        items={[
          {
            label: "Followers",
            value: metrics.followers.toLocaleString(),
            change: `+${metrics.monthlyChange} this month`,
          },
          { label: "28D Reach", value: metrics.reach28d.toLocaleString() },
          {
            label: "Accounts Engaged",
            value: metrics.accountsEngaged28d.toLocaleString(),
          },
          { label: "Eng. Rate", value: `${metrics.engagementRate}%` },
        ]}
      />

      {/* Goal */}
      {goals?.instagram && (
        <div className="px-9 py-7">
          <div className="text-[10px] tracking-[2px] uppercase text-[--text-secondary] mb-5">
            Goal
          </div>
          <GoalTracker
            platform="Instagram"
            current={metrics.followers}
            target={goals.instagram.target}
            label={goals.instagram.label}
          />
        </div>
      )}

      {/* Latest Post */}
      {latestPost && <LatestPost post={latestPost} platform="instagram" />}
    </>
  );
}
