import { describe, it, expect, vi, beforeEach } from "vitest";

const mockFetch = vi.fn();
global.fetch = mockFetch;

import { fetchTikTokData } from "@/lib/tiktok";

describe("fetchTikTokData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns formatted metrics from API response", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          data: {
            user: {
              stats: {
                followerCount: 23104,
                heartCount: 184200,
                videoCount: 89,
              },
            },
          },
        }),
    });

    const result = await fetchTikTokData("test-token");
    expect(result).not.toBeNull();
    expect(result!.metrics.followers).toBe(23104);
  });

  it("returns null when API returns error", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 401 });
    const result = await fetchTikTokData("bad-token");
    expect(result).toBeNull();
  });
});
