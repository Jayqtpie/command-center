import type { InstagramMetrics, Post, PlatformSnapshot } from "./types";

const BASE = "https://graph.facebook.com/v19.0";

export async function fetchInstagramData(
  accessToken: string,
  igUserId: string
): Promise<PlatformSnapshot | null> {
  try {
    const profileRes = await fetch(
      `${BASE}/${igUserId}?fields=followers_count,media_count&access_token=${accessToken}`
    );
    if (!profileRes.ok) return null;
    const profile = await profileRes.json();

    const insightsRes = await fetch(
      `${BASE}/${igUserId}/insights?metric=reach,accounts_engaged&period=day&metric_type=total_value&access_token=${accessToken}`
    );
    const insights = insightsRes.ok ? await insightsRes.json() : { data: [] };

    const reach =
      insights.data?.find((d: { name: string }) => d.name === "reach")?.values?.[0]?.value || 0;
    const accountsEngaged =
      insights.data?.find((d: { name: string }) => d.name === "accounts_engaged")?.values?.[0]?.value || 0;

    const mediaRes = await fetch(
      `${BASE}/${igUserId}/media?fields=id,caption,media_type,media_url,thumbnail_url,timestamp,like_count,comments_count&limit=5&access_token=${accessToken}`
    );
    const media = mediaRes.ok ? await mediaRes.json() : { data: [] };

    const latestPosts: Post[] = (media.data || []).map(
      (m: {
        id: string;
        caption?: string;
        media_type: string;
        media_url?: string;
        thumbnail_url?: string;
        timestamp: string;
        like_count?: number;
        comments_count?: number;
      }) => ({
        id: m.id,
        type:
          m.media_type === "VIDEO"
            ? "reel"
            : m.media_type === "CAROUSEL_ALBUM"
            ? "carousel"
            : "photo",
        caption: m.caption || "",
        thumbnailUrl: m.thumbnail_url || m.media_url || null,
        publishedAt: m.timestamp,
        likes: m.like_count || 0,
        comments: m.comments_count || 0,
        engagementRate:
          profile.followers_count > 0
            ? Number(
                (
                  (((m.like_count || 0) + (m.comments_count || 0)) /
                    profile.followers_count) *
                  100
                ).toFixed(2)
              )
            : 0,
        recentComments: [],
      })
    );

    const metrics: InstagramMetrics = {
      followers: profile.followers_count,
      monthlyChange: 0,
      reach28d: reach,
      engagement28d: accountsEngaged,
      engagementRate:
        latestPosts.length > 0
          ? Number(
              (
                latestPosts.reduce((sum: number, p: Post) => sum + p.engagementRate, 0) /
                latestPosts.length
              ).toFixed(2)
            )
          : 0,
      profileViews28d: 0,
      accountsEngaged28d: accountsEngaged,
      updatedAt: new Date().toISOString(),
      source: "api",
    };

    return { metrics, latestPosts };
  } catch {
    return null;
  }
}
