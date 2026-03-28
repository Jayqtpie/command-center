import { NextResponse } from "next/server";
import { setSnapshot, setConfig, getConfig, getSnapshot } from "@/lib/kv";
import type { AppConfig } from "@/lib/types";

export async function POST(request: Request) {
  const body = await request.json();
  const { action } = body;

  if (action === "update-metrics") {
    const { platform, metrics } = body;
    const current = await getSnapshot(platform);
    const updated = {
      metrics: { ...current?.metrics, ...metrics, source: "manual", updatedAt: new Date().toISOString() },
      latestPosts: current?.latestPosts || [],
    };
    await setSnapshot(platform, updated);
    return NextResponse.json({ success: true });
  }

  if (action === "update-config") {
    const { config } = body as { config: AppConfig };
    await setConfig(config);
    return NextResponse.json({ success: true });
  }

  if (action === "get-config") {
    const config = await getConfig();
    return NextResponse.json({ config });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
