import { describe, it, expect, vi, beforeEach } from "vitest";

const mockFetch = vi.fn();
global.fetch = mockFetch;

import { fetchInstagramData } from "@/lib/instagram";

describe("fetchInstagramData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns formatted metrics from API response", async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            followers_count: 12847,
            media_count: 250,
          }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            data: [
              { name: "reach", period: "day", values: [{ value: 54210 }] },
              { name: "accounts_engaged", period: "day", values: [{ value: 9765 }] },
            ],
          }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            data: [
              {
                id: "123",
                caption: "Test post",
                media_type: "VIDEO",
                media_url: "https://example.com/img.jpg",
                timestamp: "2026-03-26T09:15:00+0000",
                like_count: 118,
                comments_count: 8,
              },
            ],
          }),
      });

    const result = await fetchInstagramData("test-token", "test-ig-id");
    expect(result).not.toBeNull();
    expect(result!.metrics.followers).toBe(12847);
    expect(result!.latestPosts).toHaveLength(1);
    expect(result!.latestPosts[0].type).toBe("reel");
  });

  it("returns null when API returns error", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 401 });
    const result = await fetchInstagramData("bad-token", "test-ig-id");
    expect(result).toBeNull();
  });
});
