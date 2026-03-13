// ─── Hero Metrics ───────────────────────────────────────────
export const heroMetrics = {
  totalFollowers: { value: 127_400, change: 12.3, label: "Total Followers" },
  monthlyDonations: { value: 48_200, change: 8.7, label: "Monthly Donations" },
  contentReach: { value: 2_340_000, change: 23.1, label: "Content Reach" },
  engagementRate: { value: 4.8, change: -0.3, label: "Engagement Rate", suffix: "%" },
};

// ─── Strategic Initiatives ──────────────────────────────────
export const initiatives = [
  {
    id: 1,
    title: "Ramadan Campaign 2026",
    status: "active" as const,
    progress: 72,
    priority: "critical" as const,
    description: "30-day content series + fundraising push targeting $500K",
    dueDate: "Apr 2, 2026",
  },
  {
    id: 2,
    title: "Mobile App Launch",
    status: "active" as const,
    progress: 45,
    priority: "high" as const,
    description: "iOS & Android app for daily Islamic content delivery",
    dueDate: "May 15, 2026",
  },
  {
    id: 3,
    title: "Podcast Network Expansion",
    status: "planning" as const,
    progress: 15,
    priority: "medium" as const,
    description: "Launch 3 new podcast verticals: youth, finance, wellness",
    dueDate: "Jun 30, 2026",
  },
  {
    id: 4,
    title: "Community Platform Migration",
    status: "active" as const,
    progress: 60,
    priority: "high" as const,
    description: "Move from Discord to custom community platform",
    dueDate: "Apr 20, 2026",
  },
];

// ─── Growth Data (12 months) ────────────────────────────────
export const growthData = [
  { month: "Apr", followers: 89_200, donations: 31_000, reach: 1_200_000 },
  { month: "May", followers: 92_100, donations: 33_500, reach: 1_350_000 },
  { month: "Jun", followers: 95_800, donations: 32_800, reach: 1_280_000 },
  { month: "Jul", followers: 98_400, donations: 35_200, reach: 1_420_000 },
  { month: "Aug", followers: 101_000, donations: 36_800, reach: 1_510_000 },
  { month: "Sep", followers: 104_300, donations: 38_100, reach: 1_680_000 },
  { month: "Oct", followers: 108_200, donations: 40_500, reach: 1_850_000 },
  { month: "Nov", followers: 112_500, donations: 42_200, reach: 1_960_000 },
  { month: "Dec", followers: 116_800, donations: 44_800, reach: 2_100_000 },
  { month: "Jan", followers: 119_600, donations: 43_500, reach: 2_050_000 },
  { month: "Feb", followers: 123_400, donations: 45_900, reach: 2_200_000 },
  { month: "Mar", followers: 127_400, donations: 48_200, reach: 2_340_000 },
];

// ─── Content Performance ────────────────────────────────────
export const topContent = [
  {
    id: 1,
    title: "The Power of Dhikr in Daily Life",
    type: "video" as const,
    views: 342_000,
    engagement: 6.2,
    shares: 12_400,
    trend: "up" as const,
    publishedDaysAgo: 3,
  },
  {
    id: 2,
    title: "Islamic Finance: A Beginner's Guide",
    type: "article" as const,
    views: 198_000,
    engagement: 5.8,
    shares: 8_200,
    trend: "up" as const,
    publishedDaysAgo: 7,
  },
  {
    id: 3,
    title: "Ramadan Prep: 30 Days of Barakah",
    type: "carousel" as const,
    views: 156_000,
    engagement: 7.1,
    shares: 15_800,
    trend: "up" as const,
    publishedDaysAgo: 5,
  },
  {
    id: 4,
    title: "Weekly Khutbah: Patience in Adversity",
    type: "podcast" as const,
    views: 87_000,
    engagement: 4.5,
    shares: 3_200,
    trend: "stable" as const,
    publishedDaysAgo: 2,
  },
  {
    id: 5,
    title: "Community Spotlight: Youth Programs",
    type: "video" as const,
    views: 64_000,
    engagement: 5.1,
    shares: 2_800,
    trend: "down" as const,
    publishedDaysAgo: 10,
  },
];

// ─── Operations / Systems Health ────────────────────────────
export const systems = [
  { name: "Website", status: "operational" as const, uptime: 99.98, lastIncident: null },
  { name: "Email Service", status: "operational" as const, uptime: 99.95, lastIncident: "Feb 28" },
  { name: "Payment Gateway", status: "operational" as const, uptime: 99.99, lastIncident: null },
  { name: "CDN / Media", status: "degraded" as const, uptime: 98.70, lastIncident: "Mar 12" },
  { name: "Analytics Pipeline", status: "operational" as const, uptime: 99.90, lastIncident: "Mar 1" },
  { name: "Community Platform", status: "operational" as const, uptime: 99.80, lastIncident: "Mar 5" },
];

export const recentAlerts = [
  { id: 1, message: "CDN latency spike detected — media delivery 2.3s above baseline", severity: "warning" as const, time: "2h ago" },
  { id: 2, message: "Email bounce rate elevated (3.2%) on Ramadan campaign blast", severity: "info" as const, time: "6h ago" },
  { id: 3, message: "Scheduled maintenance: Analytics pipeline migration tonight 2-4 AM EST", severity: "info" as const, time: "1d ago" },
];
