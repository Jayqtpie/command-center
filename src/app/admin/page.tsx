"use client";

import { useState } from "react";

type Platform = "ig" | "yt" | "tt";

export default function AdminPage() {
  const [platform, setPlatform] = useState<Platform>("ig");
  const [followers, setFollowers] = useState("");
  const [reach, setReach] = useState("");
  const [engagement, setEngagement] = useState("");
  const [status, setStatus] = useState("");

  const [goalIg, setGoalIg] = useState("25000");
  const [goalYt, setGoalYt] = useState("10000");
  const [goalTt, setGoalTt] = useState("50000");

  async function submitMetrics(e: React.FormEvent) {
    e.preventDefault();
    setStatus("Saving...");
    const metrics: Record<string, number> = {};
    if (followers) metrics.followers = parseInt(followers, 10);
    if (reach) metrics.reach28d = parseInt(reach, 10);
    if (engagement) metrics.engagement28d = parseInt(engagement, 10);

    // Always save to localStorage so platform pages can read it
    const existing = JSON.parse(localStorage.getItem(`cc:metrics:${platform}`) || "{}");
    localStorage.setItem(`cc:metrics:${platform}`, JSON.stringify({
      ...existing,
      ...metrics,
      source: "manual",
      updatedAt: new Date().toISOString(),
    }));

    try {
      await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update-metrics", platform, metrics }),
      });
    } catch {
      // KV unavailable — localStorage is the fallback
    }
    setStatus("Saved!");
    setTimeout(() => setStatus(""), 2000);
  }

  async function submitGoals(e: React.FormEvent) {
    e.preventDefault();
    setStatus("Saving goals...");
    const config = {
      goals: {
        instagram: goalIg ? { target: parseInt(goalIg, 10), label: formatLabel(parseInt(goalIg, 10)) } : null,
        youtube: goalYt ? { target: parseInt(goalYt, 10), label: formatLabel(parseInt(goalYt, 10)) } : null,
        tiktok: goalTt ? { target: parseInt(goalTt, 10), label: formatLabel(parseInt(goalTt, 10)) } : null,
      },
      checklist: [],
    };

    // Always save to localStorage
    localStorage.setItem("cc:config", JSON.stringify(config));

    try {
      await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update-config", config }),
      });
    } catch {
      // KV unavailable — localStorage is the fallback
    }
    setStatus("Goals saved!");
    setTimeout(() => setStatus(""), 2000);
  }

  return (
    <div className="px-9 py-7 max-w-2xl">
      <h2 className="text-xl font-light mb-6">Admin</h2>

      {status && (
        <div className="mb-4 px-4 py-2 bg-linen-dark rounded text-sm text-terracotta font-medium">
          {status}
        </div>
      )}

      {/* Manual Metrics */}
      <section className="mb-10">
        <h3 className="text-[10px] tracking-[2px] uppercase text-[--text-secondary] mb-4">
          Manual Metric Override
        </h3>
        <form onSubmit={submitMetrics} className="space-y-4">
          <div>
            <label className="text-sm text-[--text-muted] block mb-1">Platform</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value as Platform)}
              className="w-full p-2 rounded border border-[--border] bg-white text-sm"
            >
              <option value="ig">Instagram</option>
              <option value="yt">YouTube</option>
              <option value="tt">TikTok</option>
            </select>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-[--text-muted] block mb-1">Followers</label>
              <input
                type="number"
                value={followers}
                onChange={(e) => setFollowers(e.target.value)}
                className="w-full p-2 rounded border border-[--border] bg-white text-sm"
                placeholder="e.g. 12847"
              />
            </div>
            <div>
              <label className="text-sm text-[--text-muted] block mb-1">28D Reach</label>
              <input
                type="number"
                value={reach}
                onChange={(e) => setReach(e.target.value)}
                className="w-full p-2 rounded border border-[--border] bg-white text-sm"
                placeholder="e.g. 54210"
              />
            </div>
            <div>
              <label className="text-sm text-[--text-muted] block mb-1">28D Engagement</label>
              <input
                type="number"
                value={engagement}
                onChange={(e) => setEngagement(e.target.value)}
                className="w-full p-2 rounded border border-[--border] bg-white text-sm"
                placeholder="e.g. 6200"
              />
            </div>
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-terracotta text-white rounded-md text-sm font-semibold cursor-pointer"
          >
            Save Metrics
          </button>
        </form>
      </section>

      {/* Goals */}
      <section>
        <h3 className="text-[10px] tracking-[2px] uppercase text-[--text-secondary] mb-4">
          Follower Goals
        </h3>
        <form onSubmit={submitGoals} className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-[--text-muted] block mb-1">Instagram Target</label>
              <input
                type="number"
                value={goalIg}
                onChange={(e) => setGoalIg(e.target.value)}
                className="w-full p-2 rounded border border-[--border] bg-white text-sm"
              />
            </div>
            <div>
              <label className="text-sm text-[--text-muted] block mb-1">YouTube Target</label>
              <input
                type="number"
                value={goalYt}
                onChange={(e) => setGoalYt(e.target.value)}
                className="w-full p-2 rounded border border-[--border] bg-white text-sm"
              />
            </div>
            <div>
              <label className="text-sm text-[--text-muted] block mb-1">TikTok Target</label>
              <input
                type="number"
                value={goalTt}
                onChange={(e) => setGoalTt(e.target.value)}
                className="w-full p-2 rounded border border-[--border] bg-white text-sm"
              />
            </div>
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-terracotta text-white rounded-md text-sm font-semibold cursor-pointer"
          >
            Save Goals
          </button>
        </form>
      </section>
    </div>
  );
}

function formatLabel(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(n % 1000000 === 0 ? 0 : 1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K`;
  return n.toString();
}
