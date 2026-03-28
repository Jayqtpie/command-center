import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/kv", () => ({
  getConfig: vi.fn(),
  setSnapshot: vi.fn(),
  setHistory: vi.fn(),
  getSnapshot: vi.fn(),
}));

vi.mock("@/lib/instagram", () => ({
  fetchInstagramData: vi.fn(),
}));

vi.mock("@/lib/youtube", () => ({
  fetchYouTubeData: vi.fn(),
}));

vi.mock("@/lib/tiktok", () => ({
  fetchTikTokData: vi.fn(),
}));

import { getConfig, setSnapshot, setHistory, getSnapshot } from "@/lib/kv";
import { fetchInstagramData } from "@/lib/instagram";
import { fetchYouTubeData } from "@/lib/youtube";
import { fetchTikTokData } from "@/lib/tiktok";

const mockedSetSnapshot = vi.mocked(setSnapshot);
const mockedSetHistory = vi.mocked(setHistory);
const mockedGetSnapshot = vi.mocked(getSnapshot);
const mockedFetchIG = vi.mocked(fetchInstagramData);
const mockedFetchYT = vi.mocked(fetchYouTubeData);
const mockedFetchTT = vi.mocked(fetchTikTokData);

import { GET } from "@/app/api/cron/fetch/route";

describe("GET /api/cron/fetch", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.CRON_SECRET = "test-secret";
    process.env.IG_ACCESS_TOKEN = "ig-token";
    process.env.IG_USER_ID = "ig-user";
    process.env.YT_API_KEY = "yt-key";
    process.env.YT_CHANNEL_ID = "yt-channel";
    process.env.TT_ACCESS_TOKEN = "tt-token";
  });

  it("fetches and stores data from all platforms", async () => {
    const igData = { metrics: { followers: 100 }, latestPosts: [] };
    const ytData = { metrics: { followers: 200 }, latestPosts: [] };
    const ttData = { metrics: { followers: 300 }, latestPosts: [] };

    mockedFetchIG.mockResolvedValue(igData as never);
    mockedFetchYT.mockResolvedValue(ytData as never);
    mockedFetchTT.mockResolvedValue(ttData as never);
    mockedGetSnapshot.mockResolvedValue(null);

    const request = new Request("http://localhost/api/cron/fetch", {
      headers: { authorization: "Bearer test-secret" },
    });

    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(mockedSetSnapshot).toHaveBeenCalledTimes(3);
    expect(mockedSetHistory).toHaveBeenCalledTimes(3);
  });

  it("rejects unauthorized requests", async () => {
    const request = new Request("http://localhost/api/cron/fetch", {
      headers: { authorization: "Bearer wrong-secret" },
    });

    const response = await GET(request);
    expect(response.status).toBe(401);
  });
});
