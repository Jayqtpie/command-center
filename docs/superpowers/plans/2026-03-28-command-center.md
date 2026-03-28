# Social Media Command Center Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a personal social media analytics dashboard tracking Instagram, YouTube, and TikTok with an engagement timer, deployed on Vercel.

**Architecture:** Next.js 14 App Router with tab-based navigation (Overview, Instagram, YouTube, TikTok). Server components read from Vercel KV for metrics; Vercel Cron Jobs fetch data from platform APIs on a schedule. Client-side localStorage handles engagement timer/checklist state. An admin page allows manual metric overrides and configuration.

**Tech Stack:** Next.js 14 (App Router), TypeScript, Vercel KV, Vercel Cron Jobs, Tailwind CSS (with custom design tokens), Instagram Graph API, YouTube Data API v3, TikTok API

---

## File Structure

```
src/
├── app/
│   ├── layout.tsx              — Root layout: grain texture, accent strip, header, tab nav
│   ├── page.tsx                — Overview tab (default route)
│   ├── instagram/
│   │   └── page.tsx            — Instagram tab with timer, checklist, metrics, latest post
│   ├── youtube/
│   │   └── page.tsx            — YouTube tab with metrics, goal, latest videos
│   ├── tiktok/
│   │   └── page.tsx            — TikTok tab with metrics, goal, latest videos
│   ├── admin/
│   │   └── page.tsx            — Admin page for manual entry, goals, checklist config, API keys
│   ├── api/
│   │   └── cron/
│   │       └── fetch/
│   │           └── route.ts    — Cron endpoint: fetches all platform data, writes to KV
│   ├── api/
│   │   └── admin/
│   │       └── route.ts        — Admin API: save manual overrides, goals, checklist, API keys
│   └── globals.css             — Tailwind base + custom design tokens as CSS variables
├── components/
│   ├── header.tsx              — Title, LIVE indicator, date
│   ├── tab-nav.tsx             — Tab navigation with active state
│   ├── metrics-row.tsx         — Reusable metrics grid (N columns with vertical dividers)
│   ├── goal-tracker.tsx        — Progress bar with percentage and serif-italic target
│   ├── latest-post.tsx         — Post display: thumbnail, badge, caption, stats, comments
│   ├── engagement-timer.tsx    — Client component: circular SVG countdown, pause/reset, session stats
│   └── engagement-checklist.tsx — Client component: checkable items, progress counter, daily reset
├── lib/
│   ├── kv.ts                   — Vercel KV read/write helpers (get/set snapshots, history, config)
│   ├── types.ts                — TypeScript types for platform metrics, config, KV schema
│   ├── instagram.ts            — Instagram Graph API fetch logic
│   ├── youtube.ts              — YouTube Data API v3 fetch logic
│   └── tiktok.ts               — TikTok API fetch logic
tests/
├── lib/
│   ├── kv.test.ts              — KV helper tests
│   ├── instagram.test.ts       — Instagram fetch tests
│   ├── youtube.test.ts         — YouTube fetch tests
│   └── tiktok.test.ts          — TikTok fetch tests
├── components/
│   ├── metrics-row.test.tsx    — Metrics row render tests
│   ├── goal-tracker.test.tsx   — Goal tracker render tests
│   ├── engagement-timer.test.tsx — Timer logic tests
│   └── engagement-checklist.test.tsx — Checklist logic tests
└── api/
    └── cron-fetch.test.ts      — Cron route tests
```

---

### Task 1: Project Scaffolding & Design Tokens

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `tailwind.config.ts`
- Create: `next.config.ts`
- Create: `vercel.json`
- Create: `src/app/globals.css`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`

- [ ] **Step 1: Initialize Next.js project**

Run:
```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

Expected: Project scaffolded with `src/app/` structure.

- [ ] **Step 2: Install dependencies**

Run:
```bash
npm install @vercel/kv
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom @vitejs/plugin-react
```

- [ ] **Step 3: Create Vitest config**

Create `vitest.config.ts`:
```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    globals: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

Create `tests/setup.ts`:
```typescript
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 4: Add test script to package.json**

Add to `scripts` in `package.json`:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 5: Write design tokens in globals.css**

Replace `src/app/globals.css` with:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg-primary: #f5f0eb;
  --bg-secondary: #ece5dc;
  --text-primary: #1a1a1a;
  --text-secondary: #999999;
  --text-muted: #888888;
  --accent: #c67a3c;
  --accent-dark: #b5693a;
  --accent-light: #d4956a;
  --border: #e0d8cf;
  --success: #4ade80;
  --font-serif: "Palatino Linotype", Palatino, Georgia, serif;
}

body {
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: system-ui, -apple-system, sans-serif;
}
```

- [ ] **Step 6: Extend Tailwind config with design tokens**

Replace `tailwind.config.ts`:
```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        linen: { DEFAULT: "#f5f0eb", dark: "#ece5dc" },
        terracotta: { DEFAULT: "#c67a3c", dark: "#b5693a", light: "#d4956a" },
        border: "#e0d8cf",
      },
      fontFamily: {
        serif: ['"Palatino Linotype"', "Palatino", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 7: Create Vercel cron config**

Create `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/fetch",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

- [ ] **Step 8: Create root layout with grain texture and accent strip**

Replace `src/app/layout.tsx`:
```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Command Center",
  description: "Social media analytics dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="relative min-h-screen">
        {/* Grain texture overlay */}
        <div
          className="pointer-events-none fixed inset-0 z-50 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
        {/* Accent strip */}
        <div className="h-[3px] bg-gradient-to-r from-terracotta-dark via-terracotta to-terracotta-dark" />
        <main>{children}</main>
      </body>
    </html>
  );
}
```

- [ ] **Step 9: Create placeholder Overview page**

Replace `src/app/page.tsx`:
```tsx
export default function OverviewPage() {
  return (
    <div className="px-9 pt-7">
      <p className="text-[--text-secondary]">Overview coming soon</p>
    </div>
  );
}
```

- [ ] **Step 10: Verify dev server starts**

Run:
```bash
npm run dev
```

Expected: App runs at `http://localhost:3000` with linen background, accent strip, and placeholder text.

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js project with design tokens and Tailwind config"
```

---

### Task 2: TypeScript Types

**Files:**
- Create: `src/lib/types.ts`

- [ ] **Step 1: Define all types**

Create `src/lib/types.ts`:
```typescript
export interface PlatformMetrics {
  followers: number;
  monthlyChange: number;
  reach28d: number;
  engagement28d: number;
  engagementRate: number;
  updatedAt: string;
  source: "api" | "manual";
}

export interface InstagramMetrics extends PlatformMetrics {
  profileViews28d: number;
  accountsEngaged28d: number;
}

export interface YouTubeMetrics extends PlatformMetrics {
  subscribers: number;
  views28d: number;
  watchTimeHours: number;
  avgViewDuration: string;
}

export interface TikTokMetrics extends PlatformMetrics {
  views28d: number;
  totalLikes: number;
  avgWatchTime: string;
}

export interface Post {
  id: string;
  type: "reel" | "carousel" | "photo" | "video";
  caption: string;
  thumbnailUrl: string | null;
  publishedAt: string;
  likes: number;
  comments: number;
  views?: number;
  shares?: number;
  engagementRate: number;
  recentComments: Comment[];
}

export interface Comment {
  username: string;
  text: string;
}

export interface PlatformSnapshot {
  metrics: PlatformMetrics | InstagramMetrics | YouTubeMetrics | TikTokMetrics;
  latestPosts: Post[];
}

export interface GoalConfig {
  instagram: { target: number; label: string } | null;
  youtube: { target: number; label: string } | null;
  tiktok: { target: number; label: string } | null;
}

export interface ChecklistItem {
  id: string;
  text: string;
}

export interface AppConfig {
  goals: GoalConfig;
  checklist: ChecklistItem[];
}

export interface TimerState {
  isRunning: boolean;
  timeRemaining: number;
  sessionsToday: number;
  totalSessionsTarget: number;
  totalTimeToday: number;
  streakDays: number;
  lastSessionDate: string;
}

export interface ChecklistState {
  date: string;
  completed: string[];
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/types.ts
git commit -m "feat: add TypeScript types for metrics, posts, config, and client state"
```

---

### Task 3: Vercel KV Helpers

**Files:**
- Create: `src/lib/kv.ts`
- Create: `tests/lib/kv.test.ts`

- [ ] **Step 1: Write failing tests for KV helpers**

Create `tests/lib/kv.test.ts`:
```typescript
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run:
```bash
npm test -- tests/lib/kv.test.ts
```

Expected: FAIL — module `@/lib/kv` does not exist.

- [ ] **Step 3: Implement KV helpers**

Create `src/lib/kv.ts`:
```typescript
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
```

- [ ] **Step 4: Run tests to verify they pass**

Run:
```bash
npm test -- tests/lib/kv.test.ts
```

Expected: All 7 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/kv.ts tests/lib/kv.test.ts
git commit -m "feat: add Vercel KV read/write helpers with 90-day TTL for history"
```

---

### Task 4: Header & Tab Navigation Components

**Files:**
- Create: `src/components/header.tsx`
- Create: `src/components/tab-nav.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Write Header component**

Create `src/components/header.tsx`:
```tsx
export function Header() {
  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="flex items-baseline justify-between">
      <h1 className="text-[28px] font-light tracking-tight">
        Command{" "}
        <span className="font-serif italic font-normal">Center</span>
      </h1>
      <div className="flex items-center gap-3 text-[11px] text-[--text-secondary] tracking-wide">
        <span className="inline-flex items-center gap-[5px]">
          <span className="inline-block h-[6px] w-[6px] rounded-full bg-[--success] shadow-[0_0_6px_rgba(74,222,128,0.4)]" />
          LIVE
        </span>
        <span>{today}</span>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Write TabNav component**

Create `src/components/tab-nav.tsx`:
```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { label: "Overview", href: "/" },
  { label: "Instagram", href: "/instagram" },
  { label: "YouTube", href: "/youtube" },
  { label: "TikTok", href: "/tiktok" },
];

export function TabNav() {
  const pathname = usePathname();

  return (
    <div className="flex gap-6 mt-5 border-b border-[--border]">
      {tabs.map((tab) => {
        const isActive =
          tab.href === "/"
            ? pathname === "/"
            : pathname.startsWith(tab.href);

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`pb-[10px] text-[13px] transition-colors ${
              isActive
                ? "font-semibold tracking-wide text-[--text-primary] border-b-2 border-terracotta"
                : "text-[--text-secondary] hover:text-[--text-primary]"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 3: Update root layout to include Header and TabNav**

Replace `src/app/layout.tsx`:
```tsx
import type { Metadata } from "next";
import { Header } from "@/components/header";
import { TabNav } from "@/components/tab-nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "Command Center",
  description: "Social media analytics dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="relative min-h-screen">
        {/* Grain texture overlay */}
        <div
          className="pointer-events-none fixed inset-0 z-50 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
        {/* Accent strip */}
        <div className="h-[3px] bg-gradient-to-r from-terracotta-dark via-terracotta to-terracotta-dark" />
        <div className="px-9 pt-7">
          <Header />
          <TabNav />
        </div>
        <main>{children}</main>
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Verify in browser**

Run:
```bash
npm run dev
```

Expected: Header shows "Command Center" with serif italic "Center", LIVE dot, date. Tab nav shows 4 tabs, Overview is active with terracotta underline.

- [ ] **Step 5: Commit**

```bash
git add src/components/header.tsx src/components/tab-nav.tsx src/app/layout.tsx
git commit -m "feat: add header with LIVE indicator and tab navigation"
```

---

### Task 5: MetricsRow Component

**Files:**
- Create: `src/components/metrics-row.tsx`
- Create: `tests/components/metrics-row.test.tsx`

- [ ] **Step 1: Write failing test**

Create `tests/components/metrics-row.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MetricsRow } from "@/components/metrics-row";

describe("MetricsRow", () => {
  it("renders all metrics with labels and values", () => {
    render(
      <MetricsRow
        items={[
          { label: "Instagram", value: "12,847", change: "+103 this month" },
          { label: "YouTube", value: "8,421", change: "+67 this month" },
        ]}
      />
    );
    expect(screen.getByText("Instagram")).toBeInTheDocument();
    expect(screen.getByText("12,847")).toBeInTheDocument();
    expect(screen.getByText("+103 this month")).toBeInTheDocument();
    expect(screen.getByText("YouTube")).toBeInTheDocument();
    expect(screen.getByText("8,421")).toBeInTheDocument();
  });

  it("renders without change text when not provided", () => {
    render(
      <MetricsRow items={[{ label: "Reach", value: "163,243" }]} />
    );
    expect(screen.getByText("Reach")).toBeInTheDocument();
    expect(screen.getByText("163,243")).toBeInTheDocument();
  });

  it("renders subtitle when provided", () => {
    render(
      <MetricsRow
        items={[
          { label: "Reach", value: "163,243", subtitle: "All platforms" },
        ]}
      />
    );
    expect(screen.getByText("All platforms")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:
```bash
npm test -- tests/components/metrics-row.test.tsx
```

Expected: FAIL — cannot find module `@/components/metrics-row`.

- [ ] **Step 3: Implement MetricsRow**

Create `src/components/metrics-row.tsx`:
```tsx
interface MetricItem {
  label: string;
  value: string;
  change?: string;
  subtitle?: string;
}

interface MetricsRowProps {
  items: MetricItem[];
  darkBg?: boolean;
}

export function MetricsRow({ items, darkBg = false }: MetricsRowProps) {
  return (
    <div
      className={`grid gap-0 ${darkBg ? "bg-linen-dark border-y border-[--border]" : ""}`}
      style={{
        gridTemplateColumns: `repeat(${items.length}, 1fr)`,
        padding: darkBg ? "24px 36px" : "28px 36px",
      }}
    >
      {items.map((item, i) => (
        <div
          key={item.label}
          className={`py-4 ${i > 0 ? "border-l border-[--border] pl-6" : ""}`}
        >
          <div className="text-[10px] tracking-[2px] uppercase text-[--text-secondary]">
            {item.label}
          </div>
          <div className="text-[36px] font-normal tracking-[-1.5px] mt-1">
            {item.value}
          </div>
          {item.change && (
            <div className="text-xs font-semibold text-terracotta mt-1">
              {item.change}
            </div>
          )}
          {item.subtitle && (
            <div className="text-[11px] text-[--text-muted]">
              {item.subtitle}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run:
```bash
npm test -- tests/components/metrics-row.test.tsx
```

Expected: All 3 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/metrics-row.tsx tests/components/metrics-row.test.tsx
git commit -m "feat: add MetricsRow component with vertical dividers"
```

---

### Task 6: GoalTracker Component

**Files:**
- Create: `src/components/goal-tracker.tsx`
- Create: `tests/components/goal-tracker.test.tsx`

- [ ] **Step 1: Write failing test**

Create `tests/components/goal-tracker.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { GoalTracker } from "@/components/goal-tracker";

describe("GoalTracker", () => {
  it("renders platform name, target, and percentage", () => {
    render(
      <GoalTracker
        platform="Instagram"
        current={12847}
        target={25000}
        label="25K"
      />
    );
    expect(screen.getByText("Instagram")).toBeInTheDocument();
    expect(screen.getByText("25K")).toBeInTheDocument();
    expect(screen.getByText("51%")).toBeInTheDocument();
  });

  it("caps percentage at 100%", () => {
    render(
      <GoalTracker
        platform="TikTok"
        current={60000}
        target={50000}
        label="50K"
      />
    );
    expect(screen.getByText("100%")).toBeInTheDocument();
  });

  it("renders progress bar with correct width", () => {
    const { container } = render(
      <GoalTracker
        platform="YouTube"
        current={5000}
        target={10000}
        label="10K"
      />
    );
    const progressBar = container.querySelector("[data-testid='progress-fill']");
    expect(progressBar).toHaveStyle({ width: "50%" });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:
```bash
npm test -- tests/components/goal-tracker.test.tsx
```

Expected: FAIL — cannot find module.

- [ ] **Step 3: Implement GoalTracker**

Create `src/components/goal-tracker.tsx`:
```tsx
interface GoalTrackerProps {
  platform: string;
  current: number;
  target: number;
  label: string;
}

export function GoalTracker({
  platform,
  current,
  target,
  label,
}: GoalTrackerProps) {
  const percentage = Math.min(Math.round((current / target) * 100), 100);

  return (
    <div>
      <div className="flex items-baseline justify-between mb-[10px]">
        <span className="text-[15px] font-medium">
          {platform}{" "}
          <span className="font-light text-[--text-secondary]">&rarr;</span>{" "}
          <span className="font-serif italic">{label}</span>
        </span>
        <span className="text-xl font-normal text-terracotta">
          {percentage}%
        </span>
      </div>
      <div className="h-2 bg-[--border] rounded overflow-hidden">
        <div
          data-testid="progress-fill"
          className="h-full rounded bg-gradient-to-r from-terracotta-dark via-terracotta to-terracotta-light shadow-[0_0_8px_rgba(198,122,60,0.3)]"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run:
```bash
npm test -- tests/components/goal-tracker.test.tsx
```

Expected: All 3 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/goal-tracker.tsx tests/components/goal-tracker.test.tsx
git commit -m "feat: add GoalTracker component with terracotta gradient progress bar"
```

---

### Task 7: LatestPost Component

**Files:**
- Create: `src/components/latest-post.tsx`

- [ ] **Step 1: Implement LatestPost**

Create `src/components/latest-post.tsx`:
```tsx
import type { Post } from "@/lib/types";

interface LatestPostProps {
  post: Post;
  platform: "instagram" | "youtube" | "tiktok";
}

const badgeColors: Record<string, string> = {
  reel: "bg-terracotta",
  carousel: "bg-terracotta",
  photo: "bg-[#555]",
  video: "bg-[#555]",
};

const platformIcons: Record<string, { bg: string; content: React.ReactNode }> = {
  instagram: {
    bg: "bg-gradient-to-br from-[#f09433] via-[#dc2743] to-[#bc1888]",
    content: null,
  },
  youtube: {
    bg: "bg-[#ff0000]",
    content: (
      <div className="w-0 h-0 border-l-[6px] border-l-white border-y-[4px] border-y-transparent ml-[2px]" />
    ),
  },
  tiktok: {
    bg: "bg-[#010101]",
    content: <span className="text-[10px] text-white font-bold">T</span>,
  },
};

export function LatestPost({ post, platform }: LatestPostProps) {
  const icon = platformIcons[platform];
  const date = new Date(post.publishedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className="border-t border-[--border] px-9 py-7">
      <div className="text-[10px] tracking-[2px] uppercase text-[--text-secondary] mb-4">
        Latest Post
      </div>
      <div className="flex gap-5 items-start">
        {post.thumbnailUrl ? (
          <img
            src={post.thumbnailUrl}
            alt=""
            className="w-[120px] h-[120px] rounded-lg object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-[120px] h-[120px] bg-linen-dark rounded-lg flex-shrink-0 flex items-center justify-center text-[11px] text-[--text-secondary]">
            Thumbnail
          </div>
        )}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div
              className={`w-5 h-5 rounded-[5px] flex items-center justify-center ${icon.bg}`}
            >
              {icon.content}
            </div>
            <span className="text-xs font-semibold capitalize">{platform}</span>
            <span
              className={`inline-block px-[7px] py-[2px] text-[9px] tracking-[1px] uppercase font-semibold text-white rounded-[3px] ${badgeColors[post.type]}`}
            >
              {post.type}
            </span>
            <span className="text-[11px] text-[--text-secondary]">{date}</span>
          </div>
          <p className="text-sm text-[#444] leading-relaxed line-clamp-2 mb-3">
            {post.caption}
          </p>
          <div className="flex gap-5 text-[13px] text-[--text-muted]">
            <span>
              <strong className="text-[--text-primary]">
                {post.likes.toLocaleString()}
              </strong>{" "}
              likes
            </span>
            <span>
              <strong className="text-[--text-primary]">
                {post.comments.toLocaleString()}
              </strong>{" "}
              comments
            </span>
            {post.views !== undefined && (
              <span>
                <strong className="text-[--text-primary]">
                  {post.views.toLocaleString()}
                </strong>{" "}
                views
              </span>
            )}
            <span className="font-semibold text-terracotta">
              {post.engagementRate.toFixed(2)}%
            </span>
          </div>
          {post.recentComments.length > 0 && (
            <div className="mt-3 text-xs text-[--text-muted] leading-relaxed space-y-1">
              {post.recentComments.slice(0, 3).map((comment, i) => (
                <div key={i}>
                  <strong className="text-[#666]">@{comment.username}</strong>{" "}
                  {comment.text}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/latest-post.tsx
git commit -m "feat: add LatestPost component with platform icons and type badges"
```

---

### Task 8: Overview Page

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Implement Overview page with mock data**

Replace `src/app/page.tsx`:
```tsx
import { MetricsRow } from "@/components/metrics-row";
import { GoalTracker } from "@/components/goal-tracker";
import { getSnapshot, getConfig } from "@/lib/kv";

// Mock data used when KV is not configured (local dev)
const mockData = {
  ig: { followers: 12847, monthlyChange: 103, reach28d: 54210, engagement28d: 6200, engagementRate: 4.7 },
  yt: { followers: 8421, monthlyChange: 67, reach28d: 42100, engagement28d: 5800, engagementRate: 3.2 },
  tt: { followers: 23104, monthlyChange: 412, reach28d: 66933, engagement28d: 5463, engagementRate: 2.5 },
};

async function getData() {
  try {
    const [ig, yt, tt, config] = await Promise.all([
      getSnapshot("ig"),
      getSnapshot("yt"),
      getSnapshot("tt"),
      getConfig(),
    ]);
    if (ig && yt && tt) {
      return {
        ig: ig.metrics,
        yt: yt.metrics,
        tt: tt.metrics,
        config,
      };
    }
  } catch {
    // KV not configured — fall through to mock data
  }
  return {
    ig: mockData.ig,
    yt: mockData.yt,
    tt: mockData.tt,
    config: {
      goals: {
        instagram: { target: 25000, label: "25K" },
        youtube: { target: 10000, label: "10K" },
        tiktok: { target: 50000, label: "50K" },
      },
      checklist: [],
    },
  };
}

export default async function OverviewPage() {
  const { ig, yt, tt, config } = await getData();

  const igFollowers = "followers" in ig ? ig.followers : 0;
  const ytFollowers = "followers" in yt ? yt.followers : 0;
  const ttFollowers = "followers" in tt ? tt.followers : 0;
  const igChange = "monthlyChange" in ig ? ig.monthlyChange : 0;
  const ytChange = "monthlyChange" in yt ? yt.monthlyChange : 0;
  const ttChange = "monthlyChange" in tt ? tt.monthlyChange : 0;

  const combined = igFollowers + ytFollowers + ttFollowers;
  const combinedChange = igChange + ytChange + ttChange;

  const totalReach =
    ("reach28d" in ig ? ig.reach28d : 0) +
    ("reach28d" in yt ? yt.reach28d : 0) +
    ("reach28d" in tt ? tt.reach28d : 0);

  const totalEngagement =
    ("engagement28d" in ig ? ig.engagement28d : 0) +
    ("engagement28d" in yt ? yt.engagement28d : 0) +
    ("engagement28d" in tt ? tt.engagement28d : 0);

  const avgEngRate =
    (("engagementRate" in ig ? ig.engagementRate : 0) +
      ("engagementRate" in yt ? yt.engagementRate : 0) +
      ("engagementRate" in tt ? tt.engagementRate : 0)) /
    3;

  const goals = config?.goals;

  return (
    <>
      <MetricsRow
        items={[
          {
            label: "Instagram",
            value: igFollowers.toLocaleString(),
            change: `+${igChange} this month`,
          },
          {
            label: "YouTube",
            value: ytFollowers.toLocaleString(),
            change: `+${ytChange} this month`,
          },
          {
            label: "TikTok",
            value: ttFollowers.toLocaleString(),
            change: `+${ttChange} this month`,
          },
          {
            label: "Combined",
            value: combined.toLocaleString(),
            change: `+${combinedChange} this month`,
          },
        ]}
      />

      <MetricsRow
        darkBg
        items={[
          { label: "28D Reach", value: totalReach.toLocaleString() },
          { label: "28D Engagement", value: totalEngagement.toLocaleString() },
          {
            label: "Avg Eng. Rate",
            value: `${avgEngRate.toFixed(1)}%`,
          },
        ]}
      />

      {goals && (
        <div className="px-9 py-7">
          <div className="text-[10px] tracking-[2px] uppercase text-[--text-secondary] mb-5">
            Goals
          </div>
          <div className="grid grid-cols-2 gap-10">
            {goals.instagram && (
              <GoalTracker
                platform="Instagram"
                current={igFollowers}
                target={goals.instagram.target}
                label={goals.instagram.label}
              />
            )}
            {goals.youtube && (
              <GoalTracker
                platform="YouTube"
                current={ytFollowers}
                target={goals.youtube.target}
                label={goals.youtube.label}
              />
            )}
            {goals.tiktok && (
              <GoalTracker
                platform="TikTok"
                current={ttFollowers}
                target={goals.tiktok.target}
                label={goals.tiktok.label}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 2: Verify in browser**

Run:
```bash
npm run dev
```

Expected: Overview page shows 4-column follower metrics, 3-column secondary metrics on darker background, and goal progress bars.

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: implement Overview page with metrics, secondary stats, and goals"
```

---

### Task 9: Engagement Timer Component

**Files:**
- Create: `src/components/engagement-timer.tsx`
- Create: `tests/components/engagement-timer.test.tsx`

- [ ] **Step 1: Write failing test**

Create `tests/components/engagement-timer.test.tsx`:
```tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { EngagementTimer } from "@/components/engagement-timer";

describe("EngagementTimer", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  it("renders initial 20:00 timer", () => {
    render(<EngagementTimer />);
    expect(screen.getByText("20:00")).toBeInTheDocument();
    expect(screen.getByText("remaining")).toBeInTheDocument();
  });

  it("starts countdown when Start is clicked", () => {
    render(<EngagementTimer />);
    fireEvent.click(screen.getByText("Start"));
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByText("19:59")).toBeInTheDocument();
  });

  it("pauses when Pause is clicked", () => {
    render(<EngagementTimer />);
    fireEvent.click(screen.getByText("Start"));
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    fireEvent.click(screen.getByText("Pause"));
    const timeAfterPause = screen.getByText("19:55");
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(timeAfterPause).toBeInTheDocument();
  });

  it("resets to 20:00 when Reset is clicked", () => {
    render(<EngagementTimer />);
    fireEvent.click(screen.getByText("Start"));
    act(() => {
      vi.advanceTimersByTime(60000);
    });
    fireEvent.click(screen.getByText("Reset"));
    expect(screen.getByText("20:00")).toBeInTheDocument();
  });

  it("shows session count", () => {
    render(<EngagementTimer />);
    expect(screen.getByText(/Sessions:/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:
```bash
npm test -- tests/components/engagement-timer.test.tsx
```

Expected: FAIL.

- [ ] **Step 3: Implement EngagementTimer**

Create `src/components/engagement-timer.tsx`:
```tsx
"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const TIMER_DURATION = 20 * 60; // 20 minutes in seconds
const SESSIONS_TARGET = 3;

interface StoredTimerState {
  sessionsToday: number;
  totalTimeToday: number;
  streakDays: number;
  lastSessionDate: string;
}

function getStoredState(): StoredTimerState {
  if (typeof window === "undefined") {
    return { sessionsToday: 0, totalTimeToday: 0, streakDays: 0, lastSessionDate: "" };
  }
  try {
    const stored = localStorage.getItem("engagement-timer");
    if (stored) {
      const parsed = JSON.parse(stored) as StoredTimerState;
      const today = new Date().toISOString().slice(0, 10);
      if (parsed.lastSessionDate !== today) {
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        const streak = parsed.lastSessionDate === yesterday ? parsed.streakDays : 0;
        return { sessionsToday: 0, totalTimeToday: 0, streakDays: streak, lastSessionDate: today };
      }
      return parsed;
    }
  } catch {}
  return { sessionsToday: 0, totalTimeToday: 0, streakDays: 0, lastSessionDate: "" };
}

function saveState(state: StoredTimerState) {
  localStorage.setItem("engagement-timer", JSON.stringify(state));
}

export function EngagementTimer() {
  const [timeRemaining, setTimeRemaining] = useState(TIMER_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [storedState, setStoredState] = useState<StoredTimerState>(getStoredState);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearTimer();
            setIsRunning(false);
            const today = new Date().toISOString().slice(0, 10);
            setStoredState((s) => {
              const updated = {
                sessionsToday: s.sessionsToday + 1,
                totalTimeToday: s.totalTimeToday + TIMER_DURATION,
                streakDays: s.lastSessionDate === today ? s.streakDays : s.streakDays + 1,
                lastSessionDate: today,
              };
              saveState(updated);
              return updated;
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return clearTimer;
  }, [isRunning, timeRemaining, clearTimer]);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const display = `${minutes}:${seconds.toString().padStart(2, "0")}`;
  const progress = timeRemaining / TIMER_DURATION;
  const circumference = 2 * Math.PI * 46;
  const dashOffset = circumference * (1 - progress);

  return (
    <div className="p-7 border-r border-[--border]">
      <div className="text-[10px] tracking-[2px] uppercase text-[--text-secondary] mb-5">
        Engagement Timer
      </div>
      <div className="flex items-center gap-7">
        <div className="relative w-[110px] h-[110px] flex-shrink-0">
          <svg width="110" height="110" viewBox="0 0 110 110" className="-rotate-90">
            <circle cx="55" cy="55" r="46" fill="none" stroke="var(--border)" strokeWidth="5" />
            <circle
              cx="55"
              cy="55"
              r="46"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              style={{ filter: "drop-shadow(0 0 4px rgba(198,122,60,0.4))" }}
            />
          </svg>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="text-[28px] font-normal tracking-tight leading-none">
              {display}
            </div>
            <div className="text-[9px] tracking-[1px] uppercase text-[--text-secondary] mt-[3px]">
              remaining
            </div>
          </div>
        </div>
        <div>
          <div className="text-[11px] text-[--text-muted] mb-1">
            Sessions: <strong className="text-[--text-primary]">{storedState.sessionsToday} of {SESSIONS_TARGET}</strong>
          </div>
          <div className="text-[11px] text-[--text-muted] mb-1">
            Time today: <strong className="text-[--text-primary]">{Math.floor(storedState.totalTimeToday / 60)} min</strong>
          </div>
          <div className="text-[11px] text-[--text-muted] mb-3">
            Streak: <strong className="text-terracotta">{storedState.streakDays} days</strong>
          </div>
          <div className="flex gap-2">
            {isRunning ? (
              <button
                onClick={() => setIsRunning(false)}
                className="px-4 py-[6px] bg-terracotta text-white rounded-md text-xs font-semibold tracking-wide cursor-pointer"
              >
                Pause
              </button>
            ) : (
              <button
                onClick={() => setIsRunning(true)}
                className="px-4 py-[6px] bg-terracotta text-white rounded-md text-xs font-semibold tracking-wide cursor-pointer"
              >
                Start
              </button>
            )}
            <button
              onClick={() => {
                setIsRunning(false);
                setTimeRemaining(TIMER_DURATION);
              }}
              className="px-[14px] py-[6px] bg-transparent border border-[#ccc4b8] text-[--text-muted] rounded-md text-xs cursor-pointer"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run:
```bash
npm test -- tests/components/engagement-timer.test.tsx
```

Expected: All 5 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/engagement-timer.tsx tests/components/engagement-timer.test.tsx
git commit -m "feat: add EngagementTimer with circular SVG countdown, pause/reset, streak tracking"
```

---

### Task 10: Engagement Checklist Component

**Files:**
- Create: `src/components/engagement-checklist.tsx`
- Create: `tests/components/engagement-checklist.test.tsx`

- [ ] **Step 1: Write failing test**

Create `tests/components/engagement-checklist.test.tsx`:
```tsx
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { EngagementChecklist } from "@/components/engagement-checklist";

const defaultItems = [
  { id: "1", text: "Comment on 5 Reels in your niche" },
  { id: "2", text: "Reply to 3 Stories from peers" },
  { id: "3", text: "Like 10 posts from hashtag feed" },
];

describe("EngagementChecklist", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders all checklist items", () => {
    render(<EngagementChecklist items={defaultItems} />);
    expect(screen.getByText("Comment on 5 Reels in your niche")).toBeInTheDocument();
    expect(screen.getByText("Reply to 3 Stories from peers")).toBeInTheDocument();
    expect(screen.getByText("Like 10 posts from hashtag feed")).toBeInTheDocument();
  });

  it("shows progress counter", () => {
    render(<EngagementChecklist items={defaultItems} />);
    expect(screen.getByText("0 / 3")).toBeInTheDocument();
  });

  it("toggles item on click and updates counter", () => {
    render(<EngagementChecklist items={defaultItems} />);
    fireEvent.click(screen.getByText("Comment on 5 Reels in your niche"));
    expect(screen.getByText("1 / 3")).toBeInTheDocument();
  });

  it("un-toggles item on second click", () => {
    render(<EngagementChecklist items={defaultItems} />);
    fireEvent.click(screen.getByText("Comment on 5 Reels in your niche"));
    fireEvent.click(screen.getByText("Comment on 5 Reels in your niche"));
    expect(screen.getByText("0 / 3")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:
```bash
npm test -- tests/components/engagement-checklist.test.tsx
```

Expected: FAIL.

- [ ] **Step 3: Implement EngagementChecklist**

Create `src/components/engagement-checklist.tsx`:
```tsx
"use client";

import { useState, useEffect } from "react";
import type { ChecklistItem } from "@/lib/types";

interface EngagementChecklistProps {
  items: ChecklistItem[];
}

function getStoredCompleted(): { date: string; completed: string[] } {
  if (typeof window === "undefined") return { date: "", completed: [] };
  try {
    const stored = localStorage.getItem("engagement-checklist");
    if (stored) {
      const parsed = JSON.parse(stored);
      const today = new Date().toISOString().slice(0, 10);
      if (parsed.date === today) return parsed;
    }
  } catch {}
  return { date: new Date().toISOString().slice(0, 10), completed: [] };
}

export function EngagementChecklist({ items }: EngagementChecklistProps) {
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    const stored = getStoredCompleted();
    setCompleted(stored.completed);
  }, []);

  function toggle(id: string) {
    setCompleted((prev) => {
      const next = prev.includes(id)
        ? prev.filter((c) => c !== id)
        : [...prev, id];
      const today = new Date().toISOString().slice(0, 10);
      localStorage.setItem(
        "engagement-checklist",
        JSON.stringify({ date: today, completed: next })
      );
      return next;
    });
  }

  return (
    <div className="p-7">
      <div className="flex items-baseline justify-between mb-4">
        <div className="text-[10px] tracking-[2px] uppercase text-[--text-secondary]">
          Engagement Checklist
        </div>
        <div className="text-[11px] font-semibold text-terracotta">
          {completed.length} / {items.length}
        </div>
      </div>
      <div className="flex flex-col gap-[10px]">
        {items.map((item) => {
          const isChecked = completed.includes(item.id);
          return (
            <button
              key={item.id}
              onClick={() => toggle(item.id)}
              className="flex items-center gap-[10px] text-left cursor-pointer bg-transparent border-none p-0"
            >
              <div
                className={`w-[18px] h-[18px] rounded flex-shrink-0 flex items-center justify-center ${
                  isChecked
                    ? "bg-terracotta"
                    : "bg-transparent border-[1.5px] border-[#ccc4b8]"
                }`}
              >
                {isChecked && (
                  <svg width="10" height="10" viewBox="0 0 10 10">
                    <path
                      d="M2 5 L4 7 L8 3"
                      fill="none"
                      stroke="#fff"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
              <span
                className={`text-[13px] ${
                  isChecked
                    ? "text-[--text-secondary] line-through"
                    : "text-[--text-primary]"
                }`}
              >
                {item.text}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run:
```bash
npm test -- tests/components/engagement-checklist.test.tsx
```

Expected: All 4 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/engagement-checklist.tsx tests/components/engagement-checklist.test.tsx
git commit -m "feat: add EngagementChecklist with daily reset and localStorage persistence"
```

---

### Task 11: Instagram Page

**Files:**
- Create: `src/app/instagram/page.tsx`

- [ ] **Step 1: Implement Instagram page**

Create `src/app/instagram/page.tsx`:
```tsx
import { MetricsRow } from "@/components/metrics-row";
import { GoalTracker } from "@/components/goal-tracker";
import { LatestPost } from "@/components/latest-post";
import { EngagementTimer } from "@/components/engagement-timer";
import { EngagementChecklist } from "@/components/engagement-checklist";
import { getSnapshot, getConfig } from "@/lib/kv";
import type { InstagramMetrics, Post, ChecklistItem } from "@/lib/types";

const defaultChecklist: ChecklistItem[] = [
  { id: "1", text: "Comment on 5 Reels in your niche" },
  { id: "2", text: "Reply to 3 Stories from peers" },
  { id: "3", text: "Like 10 posts from hashtag feed" },
  { id: "4", text: "Reply to all DMs" },
  { id: "5", text: "Share a post to your Story" },
  { id: "6", text: "Reply to all comments on latest post" },
  { id: "7", text: "Send 3 DMs to engaged followers" },
];

const mockMetrics: InstagramMetrics = {
  followers: 12847,
  monthlyChange: 103,
  reach28d: 54210,
  engagement28d: 6200,
  engagementRate: 4.7,
  profileViews28d: 9765,
  accountsEngaged28d: 9765,
  updatedAt: new Date().toISOString(),
  source: "manual",
};

const mockPost: Post = {
  id: "1",
  type: "reel",
  caption:
    "Hot take: Time stamps are one of the most important things to add to your YouTube video. You just add them by droppin...",
  thumbnailUrl: null,
  publishedAt: "2026-03-26T09:15:00Z",
  likes: 118,
  comments: 8,
  engagementRate: 0.44,
  recentComments: [
    { username: "racquelhenry", text: "I will be adding them from now on! Thanks!" },
    { username: "enter.angela", text: "Had no idea" },
  ],
};

async function getData() {
  try {
    const [snapshot, config] = await Promise.all([
      getSnapshot("ig"),
      getConfig(),
    ]);
    if (snapshot) {
      return {
        metrics: snapshot.metrics as InstagramMetrics,
        latestPost: snapshot.latestPosts[0] || null,
        checklist: config?.checklist || defaultChecklist,
        goals: config?.goals,
      };
    }
  } catch {}
  return {
    metrics: mockMetrics,
    latestPost: mockPost,
    checklist: defaultChecklist,
    goals: { instagram: { target: 25000, label: "25K" }, youtube: null, tiktok: null },
  };
}

export default async function InstagramPage() {
  const { metrics, latestPost, checklist, goals } = await getData();

  return (
    <>
      {/* Engagement Timer + Checklist */}
      <div className="mx-9 mt-6 grid grid-cols-2 bg-linen-dark rounded-xl border border-[--border] overflow-hidden">
        <EngagementTimer />
        <EngagementChecklist items={checklist} />
      </div>

      {/* Metrics */}
      <MetricsRow
        items={[
          {
            label: "Followers",
            value: metrics.followers.toLocaleString(),
            change: `+${metrics.monthlyChange} this month`,
          },
          { label: "28D Reach", value: metrics.reach28d.toLocaleString() },
          {
            label: "Accounts Engaged",
            value: metrics.accountsEngaged28d.toLocaleString(),
          },
          { label: "Eng. Rate", value: `${metrics.engagementRate}%` },
        ]}
      />

      {/* Goal */}
      {goals?.instagram && (
        <div className="px-9 py-7">
          <div className="text-[10px] tracking-[2px] uppercase text-[--text-secondary] mb-5">
            Goal
          </div>
          <GoalTracker
            platform="Instagram"
            current={metrics.followers}
            target={goals.instagram.target}
            label={goals.instagram.label}
          />
        </div>
      )}

      {/* Latest Post */}
      {latestPost && <LatestPost post={latestPost} platform="instagram" />}
    </>
  );
}
```

- [ ] **Step 2: Verify in browser**

Run:
```bash
npm run dev
```

Navigate to `http://localhost:3000/instagram`.

Expected: Timer + checklist side by side on linen background, metrics row below, goal tracker, latest post.

- [ ] **Step 3: Commit**

```bash
git add src/app/instagram/page.tsx
git commit -m "feat: implement Instagram page with engagement timer, checklist, metrics, and latest post"
```

---

### Task 12: YouTube Page

**Files:**
- Create: `src/app/youtube/page.tsx`

- [ ] **Step 1: Implement YouTube page**

Create `src/app/youtube/page.tsx`:
```tsx
import { MetricsRow } from "@/components/metrics-row";
import { GoalTracker } from "@/components/goal-tracker";
import { LatestPost } from "@/components/latest-post";
import { getSnapshot, getConfig } from "@/lib/kv";
import type { YouTubeMetrics, Post } from "@/lib/types";

const mockMetrics: YouTubeMetrics = {
  followers: 8421,
  subscribers: 8421,
  monthlyChange: 67,
  reach28d: 42100,
  engagement28d: 5800,
  engagementRate: 3.2,
  views28d: 42100,
  watchTimeHours: 1250,
  avgViewDuration: "4:32",
  updatedAt: new Date().toISOString(),
  source: "manual",
};

const mockPost: Post = {
  id: "1",
  type: "video",
  caption: "4 things that don't work anymore on YouTube that worked in 2016",
  thumbnailUrl: null,
  publishedAt: "2026-03-25T18:00:00Z",
  likes: 34,
  comments: 12,
  views: 2100,
  engagementRate: 1.6,
  recentComments: [
    { username: "tessbarclay", text: "The creators who were there for the bye sister era get it" },
  ],
};

async function getData() {
  try {
    const [snapshot, config] = await Promise.all([
      getSnapshot("yt"),
      getConfig(),
    ]);
    if (snapshot) {
      return {
        metrics: snapshot.metrics as YouTubeMetrics,
        latestPost: snapshot.latestPosts[0] || null,
        goals: config?.goals,
      };
    }
  } catch {}
  return { metrics: mockMetrics, latestPost: mockPost, goals: { instagram: null, youtube: { target: 10000, label: "10K" }, tiktok: null } };
}

export default async function YouTubePage() {
  const { metrics, latestPost, goals } = await getData();

  return (
    <>
      <MetricsRow
        items={[
          {
            label: "Subscribers",
            value: metrics.subscribers.toLocaleString(),
            change: `+${metrics.monthlyChange} this month`,
          },
          { label: "28D Views", value: metrics.views28d.toLocaleString() },
          { label: "Watch Time", value: `${metrics.watchTimeHours.toLocaleString()} hrs` },
          { label: "Avg Duration", value: metrics.avgViewDuration },
        ]}
      />

      {goals?.youtube && (
        <div className="px-9 py-7">
          <div className="text-[10px] tracking-[2px] uppercase text-[--text-secondary] mb-5">
            Goal
          </div>
          <GoalTracker
            platform="YouTube"
            current={metrics.subscribers}
            target={goals.youtube.target}
            label={goals.youtube.label}
          />
        </div>
      )}

      {latestPost && <LatestPost post={latestPost} platform="youtube" />}
    </>
  );
}
```

- [ ] **Step 2: Verify in browser**

Navigate to `http://localhost:3000/youtube`.

Expected: Metrics row with subscribers/views/watch time/duration, goal tracker, latest video.

- [ ] **Step 3: Commit**

```bash
git add src/app/youtube/page.tsx
git commit -m "feat: implement YouTube page with metrics, goal tracker, and latest video"
```

---

### Task 13: TikTok Page

**Files:**
- Create: `src/app/tiktok/page.tsx`

- [ ] **Step 1: Implement TikTok page**

Create `src/app/tiktok/page.tsx`:
```tsx
import { MetricsRow } from "@/components/metrics-row";
import { GoalTracker } from "@/components/goal-tracker";
import { LatestPost } from "@/components/latest-post";
import { getSnapshot, getConfig } from "@/lib/kv";
import type { TikTokMetrics, Post } from "@/lib/types";

const mockMetrics: TikTokMetrics = {
  followers: 23104,
  monthlyChange: 412,
  reach28d: 66933,
  engagement28d: 5463,
  engagementRate: 2.5,
  views28d: 66933,
  totalLikes: 184200,
  avgWatchTime: "0:08",
  updatedAt: new Date().toISOString(),
  source: "manual",
};

const mockPost: Post = {
  id: "1",
  type: "video",
  caption:
    "I know we said 2026 was the new 2016 but that doesn't mean we still post on YouTube the same way",
  thumbnailUrl: null,
  publishedAt: "2026-03-27T14:30:00Z",
  likes: 212,
  comments: 18,
  views: 8400,
  shares: 45,
  engagementRate: 2.5,
  recentComments: [],
};

async function getData() {
  try {
    const [snapshot, config] = await Promise.all([
      getSnapshot("tt"),
      getConfig(),
    ]);
    if (snapshot) {
      return {
        metrics: snapshot.metrics as TikTokMetrics,
        latestPost: snapshot.latestPosts[0] || null,
        goals: config?.goals,
      };
    }
  } catch {}
  return { metrics: mockMetrics, latestPost: mockPost, goals: { instagram: null, youtube: null, tiktok: { target: 50000, label: "50K" } } };
}

export default async function TikTokPage() {
  const { metrics, latestPost, goals } = await getData();

  return (
    <>
      <MetricsRow
        items={[
          {
            label: "Followers",
            value: metrics.followers.toLocaleString(),
            change: `+${metrics.monthlyChange} this month`,
          },
          { label: "28D Views", value: metrics.views28d.toLocaleString() },
          { label: "Total Likes", value: metrics.totalLikes.toLocaleString() },
          { label: "Avg Watch Time", value: metrics.avgWatchTime },
        ]}
      />

      {goals?.tiktok && (
        <div className="px-9 py-7">
          <div className="text-[10px] tracking-[2px] uppercase text-[--text-secondary] mb-5">
            Goal
          </div>
          <GoalTracker
            platform="TikTok"
            current={metrics.followers}
            target={goals.tiktok.target}
            label={goals.tiktok.label}
          />
        </div>
      )}

      {latestPost && <LatestPost post={latestPost} platform="tiktok" />}
    </>
  );
}
```

- [ ] **Step 2: Verify in browser**

Navigate to `http://localhost:3000/tiktok`.

Expected: Metrics row, goal tracker, latest video with shares count.

- [ ] **Step 3: Commit**

```bash
git add src/app/tiktok/page.tsx
git commit -m "feat: implement TikTok page with metrics, goal tracker, and latest video"
```

---

### Task 14: Platform API Fetch Logic

**Files:**
- Create: `src/lib/instagram.ts`
- Create: `src/lib/youtube.ts`
- Create: `src/lib/tiktok.ts`
- Create: `tests/lib/instagram.test.ts`
- Create: `tests/lib/youtube.test.ts`
- Create: `tests/lib/tiktok.test.ts`

- [ ] **Step 1: Write failing test for Instagram fetcher**

Create `tests/lib/instagram.test.ts`:
```typescript
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
              {
                name: "reach",
                period: "day",
                values: [{ value: 54210 }],
              },
              {
                name: "accounts_engaged",
                period: "day",
                values: [{ value: 9765 }],
              },
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
```

- [ ] **Step 2: Run test to verify it fails**

Run:
```bash
npm test -- tests/lib/instagram.test.ts
```

Expected: FAIL.

- [ ] **Step 3: Implement Instagram fetcher**

Create `src/lib/instagram.ts`:
```typescript
import type { InstagramMetrics, Post, PlatformSnapshot } from "./types";

const BASE = "https://graph.facebook.com/v19.0";

export async function fetchInstagramData(
  accessToken: string,
  igUserId: string
): Promise<PlatformSnapshot | null> {
  try {
    // Fetch user profile
    const profileRes = await fetch(
      `${BASE}/${igUserId}?fields=followers_count,media_count&access_token=${accessToken}`
    );
    if (!profileRes.ok) return null;
    const profile = await profileRes.json();

    // Fetch insights
    const insightsRes = await fetch(
      `${BASE}/${igUserId}/insights?metric=reach,accounts_engaged&period=day&metric_type=total_value&access_token=${accessToken}`
    );
    const insights = insightsRes.ok ? await insightsRes.json() : { data: [] };

    const reach = insights.data?.find((d: { name: string }) => d.name === "reach")?.values?.[0]?.value || 0;
    const accountsEngaged =
      insights.data?.find((d: { name: string }) => d.name === "accounts_engaged")?.values?.[0]?.value || 0;

    // Fetch recent media
    const mediaRes = await fetch(
      `${BASE}/${igUserId}/media?fields=id,caption,media_type,media_url,thumbnail_url,timestamp,like_count,comments_count&limit=5&access_token=${accessToken}`
    );
    const media = mediaRes.ok ? await mediaRes.json() : { data: [] };

    const latestPosts: Post[] = (media.data || []).map(
      (m: {
        id: string;
        caption?: string;
        media_type: string;
        media_url?: string;
        thumbnail_url?: string;
        timestamp: string;
        like_count?: number;
        comments_count?: number;
      }) => ({
        id: m.id,
        type: m.media_type === "VIDEO" ? "reel" : m.media_type === "CAROUSEL_ALBUM" ? "carousel" : "photo",
        caption: m.caption || "",
        thumbnailUrl: m.thumbnail_url || m.media_url || null,
        publishedAt: m.timestamp,
        likes: m.like_count || 0,
        comments: m.comments_count || 0,
        engagementRate:
          profile.followers_count > 0
            ? Number((((m.like_count || 0) + (m.comments_count || 0)) / profile.followers_count * 100).toFixed(2))
            : 0,
        recentComments: [],
      })
    );

    const metrics: InstagramMetrics = {
      followers: profile.followers_count,
      monthlyChange: 0, // Calculated from history
      reach28d: reach,
      engagement28d: accountsEngaged,
      engagementRate:
        latestPosts.length > 0
          ? Number((latestPosts.reduce((sum: number, p: Post) => sum + p.engagementRate, 0) / latestPosts.length).toFixed(2))
          : 0,
      profileViews28d: 0,
      accountsEngaged28d: accountsEngaged,
      updatedAt: new Date().toISOString(),
      source: "api",
    };

    return { metrics, latestPosts };
  } catch {
    return null;
  }
}
```

- [ ] **Step 4: Run Instagram tests**

Run:
```bash
npm test -- tests/lib/instagram.test.ts
```

Expected: All 2 tests PASS.

- [ ] **Step 5: Write failing test for YouTube fetcher**

Create `tests/lib/youtube.test.ts`:
```typescript
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
```

- [ ] **Step 6: Implement YouTube fetcher**

Create `src/lib/youtube.ts`:
```typescript
import type { YouTubeMetrics, Post, PlatformSnapshot } from "./types";

const BASE = "https://www.googleapis.com/youtube/v3";

export async function fetchYouTubeData(
  apiKey: string,
  channelId: string
): Promise<PlatformSnapshot | null> {
  try {
    // Fetch channel stats
    const channelRes = await fetch(
      `${BASE}/channels?part=statistics&id=${channelId}&key=${apiKey}`
    );
    if (!channelRes.ok) return null;
    const channelData = await channelRes.json();
    const stats = channelData.items?.[0]?.statistics;
    if (!stats) return null;

    const subscribers = parseInt(stats.subscriberCount, 10);
    const totalViews = parseInt(stats.viewCount, 10);

    // Fetch recent videos
    const searchRes = await fetch(
      `${BASE}/search?part=snippet&channelId=${channelId}&order=date&maxResults=5&type=video&key=${apiKey}`
    );
    const searchData = searchRes.ok ? await searchRes.json() : { items: [] };

    const videoIds = (searchData.items || [])
      .map((item: { id: { videoId: string } }) => item.id.videoId)
      .join(",");

    let videoStats: Record<string, { viewCount: string; likeCount: string; commentCount: string }> = {};
    if (videoIds) {
      const statsRes = await fetch(
        `${BASE}/videos?part=statistics&id=${videoIds}&key=${apiKey}`
      );
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        for (const item of statsData.items || []) {
          videoStats[item.id] = item.statistics;
        }
      }
    }

    const latestPosts: Post[] = (searchData.items || []).map(
      (item: {
        id: { videoId: string };
        snippet: {
          title: string;
          thumbnails: { medium: { url: string } };
          publishedAt: string;
        };
      }) => {
        const vs = videoStats[item.id.videoId] || {};
        const views = parseInt(vs.viewCount || "0", 10);
        const likes = parseInt(vs.likeCount || "0", 10);
        const comments = parseInt(vs.commentCount || "0", 10);
        return {
          id: item.id.videoId,
          type: "video" as const,
          caption: item.snippet.title,
          thumbnailUrl: item.snippet.thumbnails?.medium?.url || null,
          publishedAt: item.snippet.publishedAt,
          likes,
          comments,
          views,
          engagementRate: views > 0 ? Number(((likes + comments) / views * 100).toFixed(2)) : 0,
          recentComments: [],
        };
      }
    );

    const metrics: YouTubeMetrics = {
      followers: subscribers,
      subscribers,
      monthlyChange: 0,
      reach28d: totalViews,
      engagement28d: 0,
      engagementRate:
        latestPosts.length > 0
          ? Number((latestPosts.reduce((sum: number, p: Post) => sum + p.engagementRate, 0) / latestPosts.length).toFixed(2))
          : 0,
      views28d: latestPosts.reduce((sum: number, p: Post) => sum + (p.views || 0), 0),
      watchTimeHours: 0, // Not available from basic API
      avgViewDuration: "0:00", // Not available from basic API
      updatedAt: new Date().toISOString(),
      source: "api",
    };

    return { metrics, latestPosts };
  } catch {
    return null;
  }
}
```

- [ ] **Step 7: Run YouTube tests**

Run:
```bash
npm test -- tests/lib/youtube.test.ts
```

Expected: All 2 tests PASS.

- [ ] **Step 8: Write failing test for TikTok fetcher**

Create `tests/lib/tiktok.test.ts`:
```typescript
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
```

- [ ] **Step 9: Implement TikTok fetcher**

Create `src/lib/tiktok.ts`:
```typescript
import type { TikTokMetrics, PlatformSnapshot } from "./types";

const BASE = "https://open.tiktokapis.com/v2";

export async function fetchTikTokData(
  accessToken: string
): Promise<PlatformSnapshot | null> {
  try {
    const res = await fetch(`${BASE}/user/info/?fields=follower_count,likes_count,video_count`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const user = data.data?.user?.stats || data.data?.user || data.data;
    if (!user) return null;

    const followers = user.followerCount || user.follower_count || 0;
    const totalLikes = user.heartCount || user.likes_count || 0;

    const metrics: TikTokMetrics = {
      followers,
      monthlyChange: 0,
      reach28d: 0,
      engagement28d: 0,
      engagementRate: 0,
      views28d: 0,
      totalLikes,
      avgWatchTime: "0:00",
      updatedAt: new Date().toISOString(),
      source: "api",
    };

    return { metrics, latestPosts: [] };
  } catch {
    return null;
  }
}
```

- [ ] **Step 10: Run TikTok tests**

Run:
```bash
npm test -- tests/lib/tiktok.test.ts
```

Expected: All 2 tests PASS.

- [ ] **Step 11: Commit**

```bash
git add src/lib/instagram.ts src/lib/youtube.ts src/lib/tiktok.ts tests/lib/instagram.test.ts tests/lib/youtube.test.ts tests/lib/tiktok.test.ts
git commit -m "feat: add API fetch logic for Instagram, YouTube, and TikTok"
```

---

### Task 15: Cron Fetch API Route

**Files:**
- Create: `src/app/api/cron/fetch/route.ts`
- Create: `tests/api/cron-fetch.test.ts`

- [ ] **Step 1: Write failing test**

Create `tests/api/cron-fetch.test.ts`:
```typescript
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

const mockedGetConfig = vi.mocked(getConfig);
const mockedSetSnapshot = vi.mocked(setSnapshot);
const mockedSetHistory = vi.mocked(setHistory);
const mockedGetSnapshot = vi.mocked(getSnapshot);
const mockedFetchIG = vi.mocked(fetchInstagramData);
const mockedFetchYT = vi.mocked(fetchYouTubeData);
const mockedFetchTT = vi.mocked(fetchTikTokData);

// Import after mocks
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
```

- [ ] **Step 2: Run test to verify it fails**

Run:
```bash
npm test -- tests/api/cron-fetch.test.ts
```

Expected: FAIL.

- [ ] **Step 3: Implement cron route**

Create `src/app/api/cron/fetch/route.ts`:
```typescript
import { NextResponse } from "next/server";
import { setSnapshot, setHistory, getSnapshot } from "@/lib/kv";
import { fetchInstagramData } from "@/lib/instagram";
import { fetchYouTubeData } from "@/lib/youtube";
import { fetchTikTokData } from "@/lib/tiktok";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date().toISOString().slice(0, 10);
  const results: Record<string, string> = {};

  // Instagram
  const igToken = process.env.IG_ACCESS_TOKEN;
  const igUserId = process.env.IG_USER_ID;
  if (igToken && igUserId) {
    const data = await fetchInstagramData(igToken, igUserId);
    if (data) {
      // Calculate monthly change from history
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

  return NextResponse.json({ success: true, results, fetchedAt: new Date().toISOString() });
}
```

- [ ] **Step 4: Run tests**

Run:
```bash
npm test -- tests/api/cron-fetch.test.ts
```

Expected: All 2 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/api/cron/fetch/route.ts tests/api/cron-fetch.test.ts
git commit -m "feat: add cron API route for fetching platform data and storing in KV"
```

---

### Task 16: Admin Page

**Files:**
- Create: `src/app/admin/page.tsx`
- Create: `src/app/api/admin/route.ts`

- [ ] **Step 1: Implement admin API route**

Create `src/app/api/admin/route.ts`:
```typescript
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
```

- [ ] **Step 2: Implement admin page**

Create `src/app/admin/page.tsx`:
```tsx
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

    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "update-metrics", platform, metrics }),
    });
    setStatus(res.ok ? "Saved!" : "Error saving");
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
    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "update-config", config }),
    });
    setStatus(res.ok ? "Goals saved!" : "Error saving");
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
```

- [ ] **Step 3: Verify in browser**

Navigate to `http://localhost:3000/admin`.

Expected: Two form sections — manual metric override (with platform dropdown, followers/reach/engagement inputs) and follower goals.

- [ ] **Step 4: Commit**

```bash
git add src/app/admin/page.tsx src/app/api/admin/route.ts
git commit -m "feat: add admin page with manual metric overrides and goal configuration"
```

---

### Task 17: Environment Variables & Final Wiring

**Files:**
- Create: `.env.example`
- Modify: `.gitignore`

- [ ] **Step 1: Create .env.example**

Create `.env.example`:
```
# Vercel KV (auto-populated when linked to Vercel KV store)
KV_REST_API_URL=
KV_REST_API_TOKEN=
KV_REST_API_READ_ONLY_TOKEN=

# Cron auth (set in Vercel dashboard)
CRON_SECRET=

# Instagram Graph API
IG_ACCESS_TOKEN=
IG_USER_ID=

# YouTube Data API v3
YT_API_KEY=
YT_CHANNEL_ID=

# TikTok API
TT_ACCESS_TOKEN=
```

- [ ] **Step 2: Update .gitignore**

Add to `.gitignore`:
```
.env
.env.local
node_modules/
.next/
```

- [ ] **Step 3: Run full test suite**

Run:
```bash
npm test
```

Expected: All tests PASS.

- [ ] **Step 4: Run build**

Run:
```bash
npm run build
```

Expected: Build succeeds (may show KV warnings in dev without credentials — that's expected).

- [ ] **Step 5: Commit**

```bash
git add .env.example .gitignore
git commit -m "feat: add env example and finalize gitignore"
```

---

### Task 18: Final Verification

- [ ] **Step 1: Start dev server and manually verify all tabs**

Run:
```bash
npm run dev
```

Verify each route:
- `http://localhost:3000` — Overview with mock data, metrics rows, goals
- `http://localhost:3000/instagram` — Timer, checklist, metrics, latest post
- `http://localhost:3000/youtube` — Metrics, goal, latest video
- `http://localhost:3000/tiktok` — Metrics, goal, latest video
- `http://localhost:3000/admin` — Forms render, submit without error

- [ ] **Step 2: Verify timer functionality**

On the Instagram tab:
- Click Start — timer counts down from 20:00
- Click Pause — timer stops
- Click Reset — timer returns to 20:00
- Check a few checklist items — counter updates, items show strikethrough

- [ ] **Step 3: Run full test suite one final time**

Run:
```bash
npm test
```

Expected: All tests PASS.

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "chore: final verification pass — all tabs and tests working"
```
