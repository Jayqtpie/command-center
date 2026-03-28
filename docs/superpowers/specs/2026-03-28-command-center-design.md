# Social Media Command Center — Design Spec

## Purpose

A personal social media analytics dashboard that tracks Instagram, YouTube, and TikTok from a single interface. Deployed on Vercel, it pulls data via platform APIs where possible with manual fallback for metrics that aren't available programmatically. Includes an engagement timer with checklist on the Instagram tab to encourage consistent community interaction.

## Stack

- **Framework:** Next.js 14 (App Router)
- **Storage:** Vercel KV (Redis)
- **Scheduling:** Vercel Cron Jobs
- **Deployment:** Vercel
- **Auth:** None (personal use only)

## Visual Design

### Aesthetic Direction

Warm editorial with clean sans-serif typography. No cards — metrics flow in flat sections divided by thin borders and subtle background color shifts.

### Design Tokens

- **Background:** `#f5f0eb` (warm linen)
- **Secondary background:** `#ece5dc` (darker linen, used for alternating sections)
- **Text primary:** `#1a1a1a`
- **Text secondary:** `#999`
- **Text muted:** `#888`
- **Accent:** `#c67a3c` (terracotta)
- **Accent gradient:** `linear-gradient(90deg, #b5693a, #c67a3c, #d4956a)`
- **Border:** `#e0d8cf`
- **Success indicator:** `#4ade80` (green, used for LIVE dot)
- **Body font:** System sans-serif (`system-ui, -apple-system, sans-serif`)
- **Display accent:** Palatino/Georgia serif italic (used sparingly — title "Center", goal targets like "25K")
- **Grain texture:** SVG noise overlay at 3% opacity for tactile warmth

### Layout Principles

- Top accent strip (3px terracotta gradient) across the full width
- Header with title "Command Center" (serif italic on "Center") and LIVE indicator with date
- Tab navigation with terracotta underline on active tab
- Metrics in grid rows separated by thin vertical borders (`1px solid #e0d8cf`)
- Large numbers: `font-size: 36-40px`, `font-weight: 400`, `letter-spacing: -1.5px`
- Labels: `font-size: 10px`, `letter-spacing: 2px`, uppercase, color `#999`
- Growth indicators in terracotta with `font-weight: 600`

## Navigation

Four tabs:

1. **Overview** — combined cross-platform metrics
2. **Instagram** — IG metrics, engagement timer + checklist, latest posts
3. **YouTube** — YT metrics, latest videos
4. **TikTok** — TT metrics, latest videos

## Pages

### Overview Tab

**Hero metrics row** (4 columns, vertical border dividers):
- Instagram followers + monthly change
- YouTube subscribers + monthly change
- TikTok followers + monthly change
- Combined total + monthly change

**Secondary metrics row** (3 columns, darker linen background):
- 28D Reach (all platforms combined)
- 28D Engagement (likes, comments, saves, shares)
- Avg Engagement Rate (across all posts)

**Goals section** (2-column grid):
- Per-platform progress bars toward follower milestones
- Terracotta gradient fill with subtle glow (`box-shadow`)
- Percentage display and current pace
- Goal targets displayed in serif italic

### Instagram Tab

**Engagement timer + checklist** (2-column layout within a bordered section on darker linen background):

Left side — Timer:
- Circular SVG countdown ring (terracotta stroke with drop-shadow glow)
- Large countdown display (MM:SS) centered inside the ring
- Session stats: sessions completed (e.g. "2 of 3"), total time today, streak counter
- Pause and Reset buttons

Right side — Checklist:
- Progress counter (e.g. "4 / 7") in top right
- Checkable items with terracotta filled checkboxes when complete
- Completed items shown with strikethrough in muted color
- Uncompleted items in primary text color with empty bordered checkboxes
- "Customize checklist" link at bottom
- Checklist resets each day (not per timer session — you work through the same list across multiple timer sessions in a day)

Default checklist items:
1. Comment on 5 Reels in your niche
2. Reply to 3 Stories from peers
3. Like 10 posts from hashtag feed
4. Reply to all DMs
5. Share a post to your Story
6. Reply to all comments on latest post
7. Send 3 DMs to engaged followers

**Metrics row** (4 columns):
- Followers + monthly change
- 28D Reach
- Accounts Engaged
- Engagement Rate

**Latest Post section:**
- Thumbnail (120x120), post type badge (Reel/Carousel/Photo), date
- Caption preview (2-line clamp)
- Likes, comments, engagement rate
- Recent comments preview

### YouTube Tab

**Metrics row** (4 columns):
- Subscribers + monthly change
- 28D Views
- Watch Time (hours)
- Avg View Duration

**Goal tracker:**
- Road to X subscribers (same style as Overview goals)

**Latest Videos:**
- Thumbnail, title, views, likes, comments, CTR
- Same layout pattern as Instagram latest post

### TikTok Tab

**Metrics row** (4 columns):
- Followers + monthly change
- 28D Views
- Total Likes
- Avg Watch Time

**Goal tracker:**
- Road to X followers (same style as Overview goals)

**Latest Videos:**
- Thumbnail, caption preview, views, likes, comments, shares
- Same layout pattern as Instagram latest post

### Admin Page (`/admin`)

- Forms to manually enter/override any metric per platform
- Set/update follower goals per platform
- Customize engagement checklist items (add, remove, reorder)
- API key configuration (Instagram Graph API, YouTube Data API v3, TikTok API)

## Data Architecture

### Vercel KV Schema

**Current snapshots** (overwritten each fetch):
- `ig:current` — latest Instagram metrics JSON
- `yt:current` — latest YouTube metrics JSON
- `tt:current` — latest TikTok metrics JSON

**Recent history** (one key per day, for monthly change calculations):
- `ig:history:YYYY-MM-DD` — daily Instagram snapshot
- `yt:history:YYYY-MM-DD` — daily YouTube snapshot
- `tt:history:YYYY-MM-DD` — daily TikTok snapshot

**Configuration:**
- `goals` — follower goal targets per platform
- `checklist` — custom engagement checklist items
- `api-keys` — encrypted API credentials

**TTL:** History keys expire after 90 days to stay within KV storage limits.

### Data Flow

1. **Vercel Cron Job** fires on schedule (daily on free tier, every 6h on Pro)
2. **API route** (`/api/cron/fetch`) pulls fresh data from:
   - Instagram Graph API (followers, reach, engagement, latest posts)
   - YouTube Data API v3 (subscribers, views, watch time, latest videos)
   - TikTok API (followers, views, likes, latest videos)
3. Data written to KV as current snapshot + daily history entry
4. **Frontend** reads from KV via server components (no client-side API calls)
5. **Manual overrides** via admin page write directly to current snapshot keys

### Client-Side State (localStorage)

- Engagement timer state (running/paused, time remaining)
- Checklist progress for current session
- Timer session history (sessions completed today, streak)

## API Integration Notes

### Instagram Graph API
- Requires Facebook Developer account and Instagram Business/Creator account
- Provides: followers_count, media insights (reach, impressions, engagement), recent media
- Rate limit: 200 calls/user/hour

### YouTube Data API v3
- Requires Google Cloud project with API enabled
- Provides: subscriber count, view count, video statistics, channel analytics
- Quota: 10,000 units/day (free)

### TikTok API
- Requires TikTok Developer account
- Provides: follower count, video views, likes
- Some metrics may require manual entry as API access is more limited

### Manual Fallback
- Any metric that can't be fetched via API can be entered manually through the admin page
- Manual entries override API data in the current snapshot
- Manual entries are flagged with a `source: "manual"` field
