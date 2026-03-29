import { setSnapshot, setConfig, getConfig, getSnapshot } from "@/lib/kv";
import type { AppConfig } from "@/lib/types";

function hasKV(): boolean {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { action } = body;

  if (!hasKV()) {
    // No KV store configured — return success so the client-side
    // localStorage fallback handles persistence
    if (action === "update-metrics" || action === "update-config") {
      return Response.json({ success: true, storage: "local" });
    }
    if (action === "get-config") {
      return Response.json({ config: null, storage: "local" });
    }
    return Response.json({ error: "Unknown action" }, { status: 400 });
  }

  try {
    if (action === "update-metrics") {
      const { platform, metrics } = body;
      const current = await getSnapshot(platform);
      const updated = {
        metrics: { ...current?.metrics, ...metrics, source: "manual", updatedAt: new Date().toISOString() },
        latestPosts: current?.latestPosts || [],
      };
      await setSnapshot(platform, updated);
      return Response.json({ success: true, storage: "kv" });
    }

    if (action === "update-config") {
      const { config } = body as { config: AppConfig };
      await setConfig(config);
      return Response.json({ success: true, storage: "kv" });
    }

    if (action === "get-config") {
      const config = await getConfig();
      return Response.json({ config, storage: "kv" });
    }
  } catch {
    // KV call failed — let client fall back to localStorage
    return Response.json({ success: true, storage: "local" });
  }

  return Response.json({ error: "Unknown action" }, { status: 400 });
}
