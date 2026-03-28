import { describe, it, expect, vi, beforeEach } from "vitest";

const mockFetch = vi.fn();
global.fetch = mockFetch;

import { fetchYouTubeData } from "@/lib/youtube";

describe("fetchYouTubeData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns formatted metrics from API response", async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            items: [
              {
                statistics: {
                  subscriberCount: "8421",
                  viewCount: "250000",
                },
              },
            ],
          }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            items: [
              {
                snippet: {
                  title: "Test Video",
                  thumbnails: { medium: { url: "https://example.com/thumb.jpg" } },
                  publishedAt: "2026-03-25T18:00:00Z",
                },
                statistics: {
                  viewCount: "2100",
                  likeCount: "34",
                  commentCount: "12",
                },
                id: { videoId: "abc123" },
              },
            ],
          }),
      });

    const result = await fetchYouTubeData("test-key", "test-channel-id");
    expect(result).not.toBeNull();
    expect(result!.metrics.followers).toBe(8421);
    expect(result!.latestPosts).toHaveLength(1);
  });

  it("returns null when API returns error", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 403 });
    const result = await fetchYouTubeData("bad-key", "test-channel-id");
    expect(result).toBeNull();
  });
});
