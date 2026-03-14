"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import {
  platforms as initialPlatforms,
  heroStats as initialHeroStats,
  recentPosts as initialRecentPosts,
  scheduledPosts as initialScheduledPosts,
  followerGrowth as initialFollowerGrowth,
  engagementByDay as initialEngagementByDay,
  bestTimes as initialBestTimes,
  type Platform,
  type Post,
} from "@/data/mock";

type PlatformData = typeof initialPlatforms;
type HeroStats = typeof initialHeroStats;
type GrowthRow = (typeof initialFollowerGrowth)[number];
type EngRow = (typeof initialEngagementByDay)[number];
type BestTimes = typeof initialBestTimes;

interface DataContextType {
  platforms: PlatformData;
  heroStats: HeroStats;
  recentPosts: Post[];
  scheduledPosts: Post[];
  followerGrowth: GrowthRow[];
  engagementByDay: EngRow[];
  bestTimes: BestTimes;
  updatePlatform: (key: Platform, field: string, value: number | string) => void;
  updateHeroStat: (field: keyof HeroStats, value: number) => void;
  updateRecentPost: (id: number, field: string, value: number | string) => void;
  setScheduledPosts: React.Dispatch<React.SetStateAction<Post[]>>;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [platforms, setPlatforms] = useState<PlatformData>({ ...initialPlatforms });
  const [heroStats, setHeroStats] = useState<HeroStats>({ ...initialHeroStats });
  const [recentPosts, setRecentPosts] = useState<Post[]>([...initialRecentPosts]);
  const [scheduled, setScheduled] = useState<Post[]>([...initialScheduledPosts]);
  const [growth] = useState<GrowthRow[]>([...initialFollowerGrowth]);
  const [engagement] = useState<EngRow[]>([...initialEngagementByDay]);
  const [best] = useState<BestTimes>({ ...initialBestTimes });

  const updatePlatform = useCallback((key: Platform, field: string, value: number | string) => {
    setPlatforms((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }));
    // Sync hero totals
    setPlatforms((prev) => {
      const totalFollowers = prev.instagram.followers + prev.tiktok.followers + prev.youtube.followers;
      const totalReach = prev.instagram.reachLast30d + prev.tiktok.reachLast30d + prev.youtube.reachLast30d;
      const avgEng = +((prev.instagram.avgEngagement + prev.tiktok.avgEngagement + prev.youtube.avgEngagement) / 3).toFixed(1);
      setHeroStats((h) => ({ ...h, totalFollowers, totalReach30d: totalReach, avgEngagement: avgEng }));
      return prev;
    });
  }, []);

  const updateHeroStat = useCallback((field: keyof HeroStats, value: number) => {
    setHeroStats((prev) => ({ ...prev, [field]: value }));
  }, []);

  const updateRecentPost = useCallback((id: number, field: string, value: number | string) => {
    setRecentPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  }, []);

  return (
    <DataContext.Provider
      value={{
        platforms,
        heroStats,
        recentPosts,
        scheduledPosts: scheduled,
        followerGrowth: growth,
        engagementByDay: engagement,
        bestTimes: best,
        updatePlatform,
        updateHeroStat,
        updateRecentPost,
        setScheduledPosts: setScheduled,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be inside DataProvider");
  return ctx;
}
