"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Users, Eye, Zap, Send, ChevronDown, ExternalLink } from "lucide-react";
import { heroStats, platforms, type Platform } from "@/data/mock";
import { cn, getGreeting, formatNumber, formatPercent } from "@/lib/utils";
import { Band } from "@/components/ui/band";
import { PlatformIcon } from "@/components/ui/platform-icon";

export function ExecutiveOverview() {
  const greeting = getGreeting();
  const [expandedPlatform, setExpandedPlatform] = useState<Platform | null>(null);

  return (
    <Band className="min-h-[60vh] flex items-center pt-20 pb-12" id="overview">
      <div className="w-full">
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

        {/* Interactive platform cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {(["instagram", "tiktok", "youtube"] as const).map((key, i) => {
            const p = platforms[key];
            const isExpanded = expandedPlatform === key;
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 + i * 0.1, duration: 0.4 }}
                className={cn(
                  "bg-bg-surface border rounded-xl transition-all cursor-pointer select-none",
                  isExpanded ? "border-white/20 ring-1 ring-white/10" : "border-white/5 hover:border-white/10"
                )}
                onClick={() => setExpandedPlatform(isExpanded ? null : key)}
              >
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <PlatformIcon platform={key} size="lg" />
                      <div>
                        <p className="text-sm font-medium">{p.name}</p>
                        <p className="text-xs text-text-dim">{p.handle}</p>
                      </div>
                    </div>
                    <ChevronDown className={cn("w-4 h-4 text-text-dim transition-transform", isExpanded && "rotate-180")} />
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
                </div>

                {/* Expanded detail panel */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-2 border-t border-white/5 space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <DetailRow label="Total Posts" value={String(p.posts)} />
                          <DetailRow label="Avg Eng. Rate" value={`${p.avgEngagement}%`} />
                          <DetailRow label="30d Reach" value={formatNumber(p.reachLast30d)} />
                          <DetailRow label="Growth" value={formatPercent(p.followersChange)} positive={p.followersChange >= 0} />
                        </div>
                        <button className="w-full flex items-center justify-center gap-2 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs text-text-muted transition-colors">
                          <ExternalLink className="w-3 h-3" />
                          Open {p.name}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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

function DetailRow({ label, value, positive }: { label: string; value: string; positive?: boolean }) {
  return (
    <div className="bg-bg-elevated/50 rounded-lg px-3 py-2">
      <p className="text-[10px] text-text-dim">{label}</p>
      <p className={cn("text-sm font-medium", positive === true && "text-status-green", positive === false && "text-status-red")}>
        {value}
      </p>
    </div>
  );
}
