import { kv } from "@vercel/kv";
import type { PlatformSnapshot, AppConfig } from "./types";

type Platform = "ig" | "yt" | "tt";

const HISTORY_TTL = 90 * 24 * 60 * 60; // 90 days in seconds

export async function getSnapshot(
  platform: Platform
): Promise<PlatformSnapshot | null> {
  return kv.get<PlatformSnapshot>(`${platform}:current`);
}

export async function setSnapshot(
  platform: Platform,
  data: unknown
): Promise<void> {
  await kv.set(`${platform}:current`, data);
}

export async function getHistory(
  platform: Platform,
  date: string
): Promise<PlatformSnapshot | null> {
  return kv.get<PlatformSnapshot>(`${platform}:history:${date}`);
}

export async function setHistory(
  platform: Platform,
  date: string,
  data: unknown
): Promise<void> {
  await kv.set(`${platform}:history:${date}`, data, { ex: HISTORY_TTL });
}

export async function getConfig(): Promise<AppConfig | null> {
  return kv.get<AppConfig>("app:config");
}

export async function setConfig(config: AppConfig): Promise<void> {
  await kv.set("app:config", config);
}
