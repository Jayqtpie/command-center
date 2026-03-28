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
