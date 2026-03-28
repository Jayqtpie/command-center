import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@vercel/kv", () => ({
  kv: {
    get: vi.fn(),
    set: vi.fn(),
    keys: vi.fn(),
  },
}));

import { kv } from "@vercel/kv";
import {
  getSnapshot,
  setSnapshot,
  getHistory,
  setHistory,
  getConfig,
  setConfig,
} from "@/lib/kv";

const mockedKv = vi.mocked(kv);

describe("kv helpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getSnapshot reads platform:current key", async () => {
    mockedKv.get.mockResolvedValue({ followers: 100 });
    const result = await getSnapshot("ig");
    expect(mockedKv.get).toHaveBeenCalledWith("ig:current");
    expect(result).toEqual({ followers: 100 });
  });

  it("setSnapshot writes to platform:current key", async () => {
    const data = { followers: 200 };
    await setSnapshot("yt", data);
    expect(mockedKv.set).toHaveBeenCalledWith("yt:current", data);
  });

  it("getHistory reads platform:history:date key", async () => {
    mockedKv.get.mockResolvedValue({ followers: 50 });
    const result = await getHistory("tt", "2026-03-01");
    expect(mockedKv.get).toHaveBeenCalledWith("tt:history:2026-03-01");
    expect(result).toEqual({ followers: 50 });
  });

  it("setHistory writes with 90-day TTL", async () => {
    const data = { followers: 75 };
    await setHistory("ig", "2026-03-28", data);
    expect(mockedKv.set).toHaveBeenCalledWith("ig:history:2026-03-28", data, {
      ex: 7776000,
    });
  });

  it("getConfig reads config key", async () => {
    mockedKv.get.mockResolvedValue({ goals: {} });
    const result = await getConfig();
    expect(mockedKv.get).toHaveBeenCalledWith("app:config");
    expect(result).toEqual({ goals: {} });
  });

  it("setConfig writes config key", async () => {
    const config = { goals: {}, checklist: [] };
    await setConfig(config);
    expect(mockedKv.set).toHaveBeenCalledWith("app:config", config);
  });

  it("getSnapshot returns null when key missing", async () => {
    mockedKv.get.mockResolvedValue(null);
    const result = await getSnapshot("ig");
    expect(result).toBeNull();
  });
});
