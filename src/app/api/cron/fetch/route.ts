import { setSnapshot, setHistory, getSnapshot } from "@/lib/kv";
import { fetchInstagramData } from "@/lib/instagram";
import { fetchYouTubeData } from "@/lib/youtube";
import { fetchTikTokData } from "@/lib/tiktok";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date().toISOString().slice(0, 10);
  const results: Record<string, string> = {};

  // Instagram
  const igToken = process.env.IG_ACCESS_TOKEN;
  const igUserId = process.env.IG_USER_ID;
  if (igToken && igUserId) {
    const data = await fetchInstagramData(igToken, igUserId);
    if (data) {
      const prev = await getSnapshot("ig");
      if (prev && "followers" in prev.metrics && "followers" in data.metrics) {
        data.metrics.monthlyChange =
          data.metrics.followers - prev.metrics.followers + (prev.metrics.monthlyChange || 0);
      }
      await setSnapshot("ig", data);
      await setHistory("ig", today, data);
      results.instagram = "ok";
    } else {
      results.instagram = "failed";
    }
  } else {
    results.instagram = "skipped (no credentials)";
  }

  // YouTube
  const ytKey = process.env.YT_API_KEY;
  const ytChannel = process.env.YT_CHANNEL_ID;
  if (ytKey && ytChannel) {
    const data = await fetchYouTubeData(ytKey, ytChannel);
    if (data) {
      const prev = await getSnapshot("yt");
      if (prev && "followers" in prev.metrics && "followers" in data.metrics) {
        data.metrics.monthlyChange =
          data.metrics.followers - prev.metrics.followers + (prev.metrics.monthlyChange || 0);
      }
      await setSnapshot("yt", data);
      await setHistory("yt", today, data);
      results.youtube = "ok";
    } else {
      results.youtube = "failed";
    }
  } else {
    results.youtube = "skipped (no credentials)";
  }

  // TikTok
  const ttToken = process.env.TT_ACCESS_TOKEN;
  if (ttToken) {
    const data = await fetchTikTokData(ttToken);
    if (data) {
      const prev = await getSnapshot("tt");
      if (prev && "followers" in prev.metrics && "followers" in data.metrics) {
        data.metrics.monthlyChange =
          data.metrics.followers - prev.metrics.followers + (prev.metrics.monthlyChange || 0);
      }
      await setSnapshot("tt", data);
      await setHistory("tt", today, data);
      results.tiktok = "ok";
    } else {
      results.tiktok = "failed";
    }
  } else {
    results.tiktok = "skipped (no credentials)";
  }

  return Response.json({ success: true, results, fetchedAt: new Date().toISOString() });
}
