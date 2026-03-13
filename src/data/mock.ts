// ─── Platform Overview ──────────────────────────────────────
export type Platform = "instagram" | "tiktok" | "youtube";

export const platforms = {
  instagram: {
    name: "Instagram",
    handle: "@guidedbarakah",
    followers: 84_200,
    followersChange: 3.2,
    posts: 342,
    avgEngagement: 5.1,
    reachLast30d: 920_000,
    color: "#E1306C",
  },
  tiktok: {
    name: "TikTok",
    handle: "@guidedbarakah",
    followers: 215_600,
    followersChange: 11.4,
    posts: 189,
    avgEngagement: 8.7,
    reachLast30d: 3_400_000,
    color: "#00F2EA",
  },
  youtube: {
    name: "YouTube",
    handle: "@GuidedBarakah",
    followers: 41_800,
    followersChange: 5.8,
    posts: 96,
    avgEngagement: 4.2,
    reachLast30d: 680_000,
    color: "#FF0000",
  },
};

// ─── Cross-Platform Hero Stats ──────────────────────────────
export const heroStats = {
  totalFollowers: 341_600,
  totalReach30d: 5_000_000,
  avgEngagement: 6.0,
  postsThisWeek: 12,
};

// ─── Follower Growth (12 weeks) ─────────────────────────────
export const followerGrowth = [
  { week: "W1", instagram: 78_400, tiktok: 178_000, youtube: 36_200 },
  { week: "W2", instagram: 79_100, tiktok: 182_500, youtube: 36_900 },
  { week: "W3", instagram: 79_800, tiktok: 186_200, youtube: 37_400 },
  { week: "W4", instagram: 80_200, tiktok: 189_800, youtube: 37_800 },
  { week: "W5", instagram: 80_900, tiktok: 193_400, youtube: 38_200 },
  { week: "W6", instagram: 81_300, tiktok: 196_000, youtube: 38_700 },
  { week: "W7", instagram: 81_800, tiktok: 199_200, youtube: 39_100 },
  { week: "W8", instagram: 82_400, tiktok: 203_000, youtube: 39_600 },
  { week: "W9", instagram: 82_900, tiktok: 206_400, youtube: 40_100 },
  { week: "W10", instagram: 83_300, tiktok: 209_800, youtube: 40_800 },
  { week: "W11", instagram: 83_800, tiktok: 212_500, youtube: 41_300 },
  { week: "W12", instagram: 84_200, tiktok: 215_600, youtube: 41_800 },
];

// ─── Engagement by Day (last 7 days) ───────────────────────
export const engagementByDay = [
  { day: "Mon", instagram: 4.8, tiktok: 7.9, youtube: 3.8 },
  { day: "Tue", instagram: 5.2, tiktok: 9.1, youtube: 4.0 },
  { day: "Wed", instagram: 4.6, tiktok: 8.3, youtube: 4.5 },
  { day: "Thu", instagram: 5.8, tiktok: 10.2, youtube: 4.1 },
  { day: "Fri", instagram: 6.1, tiktok: 9.8, youtube: 3.9 },
  { day: "Sat", instagram: 5.4, tiktok: 8.5, youtube: 4.8 },
  { day: "Sun", instagram: 4.9, tiktok: 7.6, youtube: 4.3 },
];

// ─── Recent Posts ───────────────────────────────────────────
export type PostStatus = "published" | "scheduled" | "draft";

export interface Post {
  id: number;
  title: string;
  platform: Platform;
  status: PostStatus;
  type: "reel" | "carousel" | "story" | "video" | "short" | "static";
  publishedAt: string | null;
  scheduledFor: string | null;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  engagementRate: number;
}

export const recentPosts: Post[] = [
  {
    id: 1,
    title: "The Power of Dhikr — 60s Reminder",
    platform: "tiktok",
    status: "published",
    type: "video",
    publishedAt: "2h ago",
    scheduledFor: null,
    views: 142_000,
    likes: 18_400,
    comments: 1_230,
    shares: 4_500,
    saves: 8_200,
    engagementRate: 12.8,
  },
  {
    id: 2,
    title: "5 Sunnah Morning Habits",
    platform: "instagram",
    status: "published",
    type: "carousel",
    publishedAt: "5h ago",
    scheduledFor: null,
    views: 34_200,
    likes: 4_800,
    comments: 312,
    shares: 1_200,
    saves: 3_400,
    engagementRate: 7.2,
  },
  {
    id: 3,
    title: "Ramadan Prep Vlog — Full Day",
    platform: "youtube",
    status: "published",
    type: "video",
    publishedAt: "1d ago",
    scheduledFor: null,
    views: 28_600,
    likes: 3_100,
    comments: 445,
    shares: 890,
    saves: 1_200,
    engagementRate: 5.4,
  },
  {
    id: 4,
    title: "Quick Dua for Anxiety",
    platform: "tiktok",
    status: "published",
    type: "video",
    publishedAt: "1d ago",
    scheduledFor: null,
    views: 289_000,
    likes: 41_200,
    comments: 3_800,
    shares: 12_400,
    saves: 22_000,
    engagementRate: 15.1,
  },
  {
    id: 5,
    title: "Islamic Finance Basics — Part 3",
    platform: "youtube",
    status: "published",
    type: "video",
    publishedAt: "3d ago",
    scheduledFor: null,
    views: 15_200,
    likes: 1_800,
    comments: 210,
    shares: 340,
    saves: 620,
    engagementRate: 4.1,
  },
  {
    id: 6,
    title: "Fasting Benefits — Infographic",
    platform: "instagram",
    status: "published",
    type: "static",
    publishedAt: "3d ago",
    scheduledFor: null,
    views: 21_000,
    likes: 3_200,
    comments: 178,
    shares: 940,
    saves: 2_800,
    engagementRate: 6.8,
  },
];

export const scheduledPosts: Post[] = [
  {
    id: 101,
    title: "Taraweeh Night Routine",
    platform: "tiktok",
    status: "scheduled",
    type: "video",
    publishedAt: null,
    scheduledFor: "Today, 7:00 PM",
    views: 0, likes: 0, comments: 0, shares: 0, saves: 0, engagementRate: 0,
  },
  {
    id: 102,
    title: "Best Quran Apps 2026",
    platform: "instagram",
    status: "scheduled",
    type: "carousel",
    publishedAt: null,
    scheduledFor: "Tomorrow, 12:00 PM",
    views: 0, likes: 0, comments: 0, shares: 0, saves: 0, engagementRate: 0,
  },
  {
    id: 103,
    title: "Community Q&A — Live",
    platform: "youtube",
    status: "scheduled",
    type: "video",
    publishedAt: null,
    scheduledFor: "Mar 15, 3:00 PM",
    views: 0, likes: 0, comments: 0, shares: 0, saves: 0, engagementRate: 0,
  },
  {
    id: 104,
    title: "Hadith of the Day Series",
    platform: "tiktok",
    status: "draft",
    type: "video",
    publishedAt: null,
    scheduledFor: null,
    views: 0, likes: 0, comments: 0, shares: 0, saves: 0, engagementRate: 0,
  },
];

// ─── Best Posting Times ─────────────────────────────────────
export const bestTimes = {
  instagram: { best: "12 PM — 2 PM", day: "Thursday" },
  tiktok: { best: "6 PM — 9 PM", day: "Thursday" },
  youtube: { best: "2 PM — 5 PM", day: "Saturday" },
};
