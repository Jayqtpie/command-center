import type { TikTokMetrics, PlatformSnapshot } from "./types";

const BASE = "https://open.tiktokapis.com/v2";

export async function fetchTikTokData(
  accessToken: string
): Promise<PlatformSnapshot | null> {
  try {
    const res = await fetch(
      `${BASE}/user/info/?fields=follower_count,likes_count,video_count`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const user =
      data.data?.user?.stats || data.data?.user || data.data;
    if (!user) return null;

    const followers = user.followerCount || user.follower_count || 0;
    const totalLikes = user.heartCount || user.likes_count || 0;

    const metrics: TikTokMetrics = {
      followers,
      monthlyChange: 0,
      reach28d: 0,
      engagement28d: 0,
      engagementRate: 0,
      views28d: 0,
      totalLikes,
      avgWatchTime: "0:00",
      updatedAt: new Date().toISOString(),
      source: "api",
    };

    return { metrics, latestPosts: [] };
  } catch {
    return null;
  }
}
