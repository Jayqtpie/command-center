import type { YouTubeMetrics, Post, PlatformSnapshot } from "./types";

const BASE = "https://www.googleapis.com/youtube/v3";

export async function fetchYouTubeData(
  apiKey: string,
  channelId: string
): Promise<PlatformSnapshot | null> {
  try {
    const channelRes = await fetch(
      `${BASE}/channels?part=statistics&id=${channelId}&key=${apiKey}`
    );
    if (!channelRes.ok) return null;
    const channelData = await channelRes.json();
    const stats = channelData.items?.[0]?.statistics;
    if (!stats) return null;

    const subscribers = parseInt(stats.subscriberCount, 10);
    const totalViews = parseInt(stats.viewCount, 10);

    const searchRes = await fetch(
      `${BASE}/search?part=snippet,statistics&channelId=${channelId}&order=date&maxResults=5&type=video&key=${apiKey}`
    );
    const searchData = searchRes.ok ? await searchRes.json() : { items: [] };

    const latestPosts: Post[] = (searchData.items || []).map(
      (item: {
        id: { videoId: string } | string;
        snippet: {
          title: string;
          thumbnails: { medium?: { url: string } };
          publishedAt: string;
        };
        statistics?: {
          viewCount?: string;
          likeCount?: string;
          commentCount?: string;
        };
      }) => {
        const videoId =
          typeof item.id === "string" ? item.id : item.id.videoId;
        const vs = item.statistics || {};
        const views = parseInt(vs.viewCount || "0", 10);
        const likes = parseInt(vs.likeCount || "0", 10);
        const comments = parseInt(vs.commentCount || "0", 10);
        return {
          id: videoId,
          type: "video" as const,
          caption: item.snippet.title,
          thumbnailUrl: item.snippet.thumbnails?.medium?.url || null,
          publishedAt: item.snippet.publishedAt,
          likes,
          comments,
          views,
          engagementRate:
            views > 0
              ? Number((((likes + comments) / views) * 100).toFixed(2))
              : 0,
          recentComments: [],
        };
      }
    );

    const metrics: YouTubeMetrics = {
      followers: subscribers,
      subscribers,
      monthlyChange: 0,
      reach28d: totalViews,
      engagement28d: 0,
      engagementRate:
        latestPosts.length > 0
          ? Number(
              (
                latestPosts.reduce((sum: number, p: Post) => sum + p.engagementRate, 0) /
                latestPosts.length
              ).toFixed(2)
            )
          : 0,
      views28d: latestPosts.reduce((sum: number, p: Post) => sum + (p.views || 0), 0),
      watchTimeHours: 0,
      avgViewDuration: "0:00",
      updatedAt: new Date().toISOString(),
      source: "api",
    };

    return { metrics, latestPosts };
  } catch {
    return null;
  }
}
