"use client";

import { motion } from "motion/react";
import { Users, Eye, Zap, Send } from "lucide-react";
import { heroStats, platforms } from "@/data/mock";
import { cn, getGreeting, formatNumber, formatPercent } from "@/lib/utils";
import { Band } from "@/components/ui/band";
import { PlatformIcon } from "@/components/ui/platform-icon";

export function ExecutiveOverview() {
  const greeting = getGreeting();

  return (
    <Band className="min-h-[60vh] flex items-center pt-20 pb-12" id="overview">
      <div className="w-full">
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <p className="text-text-dim text-lg mb-2">{greeting},</p>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-1">
            <span className="text-text-primary">Guided</span>
            <span className="text-brand-gold">Barakah</span>
          </h1>
          <p className="text-text-muted text-base mt-3">Your social media command surface.</p>
        </motion.div>

        {/* Cross-platform totals */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <HeroStat icon={Users} label="Total Followers" value={formatNumber(heroStats.totalFollowers)} />
          <HeroStat icon={Eye} label="Reach (30d)" value={formatNumber(heroStats.totalReach30d)} />
          <HeroStat icon={Zap} label="Avg Engagement" value={`${heroStats.avgEngagement}%`} />
          <HeroStat icon={Send} label="Posts This Week" value={String(heroStats.postsThisWeek)} />
        </motion.div>

        {/* Platform cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {(["instagram", "tiktok", "youtube"] as const).map((key, i) => {
            const p = platforms[key];
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 + i * 0.1, duration: 0.4 }}
                className="bg-bg-surface border border-white/5 rounded-xl p-5 hover:border-white/10 transition-colors"
              >
                <div className="flex items-center gap-3 mb-4">
                  <PlatformIcon platform={key} size="lg" />
                  <div>
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-text-dim">{p.handle}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-xl font-light">{formatNumber(p.followers)}</p>
                    <p className="text-[10px] text-text-dim">followers</p>
                    <p className={cn("text-[10px] font-medium", p.followersChange >= 0 ? "text-status-green" : "text-status-red")}>
                      {formatPercent(p.followersChange)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xl font-light">{p.avgEngagement}%</p>
                    <p className="text-[10px] text-text-dim">engagement</p>
                  </div>
                  <div>
                    <p className="text-xl font-light">{formatNumber(p.reachLast30d)}</p>
                    <p className="text-[10px] text-text-dim">reach</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Band>
  );
}

function HeroStat({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="bg-bg-surface/60 border border-white/5 rounded-xl p-4">
      <Icon className="w-4 h-4 text-text-dim mb-2" />
      <p className="text-2xl font-light tracking-tight">{value}</p>
      <p className="text-[10px] text-text-dim mt-1">{label}</p>
    </div>
  );
}
