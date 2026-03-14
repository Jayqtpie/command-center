"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Users, Eye, Zap, Send, ChevronDown, ExternalLink } from "lucide-react";
import { type Platform } from "@/data/mock";
import { useData } from "@/lib/data-context";
import { cn, getGreeting, formatNumber, formatPercent } from "@/lib/utils";
import { Band } from "@/components/ui/band";
import { PlatformIcon } from "@/components/ui/platform-icon";
import { EditableNumber, EditableText } from "@/components/ui/editable";

export function ExecutiveOverview() {
  const greeting = getGreeting();
  const { platforms, heroStats, updatePlatform, updateHeroStat } = useData();
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

        {/* Hero stats — editable */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <HeroStat icon={Users} label="Total Followers">
            <EditableNumber
              value={heroStats.totalFollowers}
              onSave={(v) => updateHeroStat("totalFollowers", v)}
              format={formatNumber}
              className="text-2xl font-light tracking-tight"
            />
          </HeroStat>
          <HeroStat icon={Eye} label="Reach (30d)">
            <EditableNumber
              value={heroStats.totalReach30d}
              onSave={(v) => updateHeroStat("totalReach30d", v)}
              format={formatNumber}
              className="text-2xl font-light tracking-tight"
            />
          </HeroStat>
          <HeroStat icon={Zap} label="Avg Engagement">
            <EditableNumber
              value={heroStats.avgEngagement}
              onSave={(v) => updateHeroStat("avgEngagement", v)}
              suffix="%"
              className="text-2xl font-light tracking-tight"
            />
          </HeroStat>
          <HeroStat icon={Send} label="Posts This Week">
            <EditableNumber
              value={heroStats.postsThisWeek}
              onSave={(v) => updateHeroStat("postsThisWeek", v)}
              className="text-2xl font-light tracking-tight"
            />
          </HeroStat>
        </motion.div>

        {/* Platform cards — editable */}
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
                  "bg-bg-surface border rounded-xl transition-all",
                  isExpanded ? "border-white/20 ring-1 ring-white/10" : "border-white/5 hover:border-white/10"
                )}
              >
                <div className="p-5">
                  <div
                    className="flex items-center justify-between mb-4 cursor-pointer select-none"
                    onClick={() => setExpandedPlatform(isExpanded ? null : key)}
                  >
                    <div className="flex items-center gap-3">
                      <PlatformIcon platform={key} size="lg" />
                      <div>
                        <p className="text-sm font-medium">{p.name}</p>
                        <EditableText
                          value={p.handle}
                          onSave={(v) => updatePlatform(key, "handle", v)}
                          className="text-xs text-text-dim"
                        />
                      </div>
                    </div>
                    <ChevronDown className={cn("w-4 h-4 text-text-dim transition-transform", isExpanded && "rotate-180")} />
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <EditableNumber
                        value={p.followers}
                        onSave={(v) => updatePlatform(key, "followers", v)}
                        format={formatNumber}
                        className="text-xl font-light"
                      />
                      <p className="text-[10px] text-text-dim">followers</p>
                      <EditableNumber
                        value={p.followersChange}
                        onSave={(v) => updatePlatform(key, "followersChange", v)}
                        format={formatPercent}
                        className={cn("text-[10px] font-medium", p.followersChange >= 0 ? "text-status-green" : "text-status-red")}
                      />
                    </div>
                    <div>
                      <EditableNumber
                        value={p.avgEngagement}
                        onSave={(v) => updatePlatform(key, "avgEngagement", v)}
                        suffix="%"
                        className="text-xl font-light"
                      />
                      <p className="text-[10px] text-text-dim">engagement</p>
                    </div>
                    <div>
                      <EditableNumber
                        value={p.reachLast30d}
                        onSave={(v) => updatePlatform(key, "reachLast30d", v)}
                        format={formatNumber}
                        className="text-xl font-light"
                      />
                      <p className="text-[10px] text-text-dim">reach</p>
                    </div>
                  </div>
                </div>

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
                          <DetailRow label="Total Posts">
                            <EditableNumber
                              value={p.posts}
                              onSave={(v) => updatePlatform(key, "posts", v)}
                              className="text-sm font-medium"
                            />
                          </DetailRow>
                          <DetailRow label="Avg Eng. Rate">
                            <EditableNumber
                              value={p.avgEngagement}
                              onSave={(v) => updatePlatform(key, "avgEngagement", v)}
                              suffix="%"
                              className="text-sm font-medium"
                            />
                          </DetailRow>
                          <DetailRow label="30d Reach">
                            <EditableNumber
                              value={p.reachLast30d}
                              onSave={(v) => updatePlatform(key, "reachLast30d", v)}
                              format={formatNumber}
                              className="text-sm font-medium"
                            />
                          </DetailRow>
                          <DetailRow label="Growth">
                            <EditableNumber
                              value={p.followersChange}
                              onSave={(v) => updatePlatform(key, "followersChange", v)}
                              format={formatPercent}
                              className={cn("text-sm font-medium", p.followersChange >= 0 ? "text-status-green" : "text-status-red")}
                            />
                          </DetailRow>
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

function HeroStat({ icon: Icon, label, children }: { icon: React.ComponentType<{ className?: string }>; label: string; children: React.ReactNode }) {
  return (
    <div className="bg-bg-surface/60 border border-white/5 rounded-xl p-4">
      <Icon className="w-4 h-4 text-text-dim mb-2" />
      {children}
      <p className="text-[10px] text-text-dim mt-1">{label}</p>
    </div>
  );
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="bg-bg-elevated/50 rounded-lg px-3 py-2">
      <p className="text-[10px] text-text-dim">{label}</p>
      {children}
    </div>
  );
}
