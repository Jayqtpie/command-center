"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { TrendingUp, Clock, Eye, EyeOff } from "lucide-react";
import { type Platform } from "@/data/mock";
import { useData } from "@/lib/data-context";
import { cn, formatNumber } from "@/lib/utils";
import { Band, BandTitle } from "@/components/ui/band";
import { PlatformIcon } from "@/components/ui/platform-icon";

const platformMeta = {
  instagram: { color: "#E1306C", label: "Instagram" },
  tiktok: { color: "#00F2EA", label: "TikTok" },
  youtube: { color: "#FF0000", label: "YouTube" },
};

export function GrowthIntelligence() {
  const { followerGrowth, engagementByDay, bestTimes } = useData();
  const [visiblePlatforms, setVisiblePlatforms] = useState<Set<Platform>>(
    new Set(["instagram", "tiktok", "youtube"])
  );

  const togglePlatform = (p: Platform) => {
    setVisiblePlatforms((prev) => {
      const next = new Set(prev);
      if (next.has(p)) {
        if (next.size > 1) next.delete(p); // keep at least one
      } else {
        next.add(p);
      }
      return next;
    });
  };

  return (
    <Band id="growth">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <BandTitle className="mb-0">Growth &amp; Analytics</BandTitle>

        {/* Interactive platform toggles */}
        <div className="flex items-center gap-2">
          {(["instagram", "tiktok", "youtube"] as const).map((p) => {
            const active = visiblePlatforms.has(p);
            return (
              <button
                key={p}
                onClick={() => togglePlatform(p)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border",
                  active
                    ? "bg-bg-elevated border-white/10 text-text-primary"
                    : "bg-transparent border-white/5 text-text-dim opacity-50 hover:opacity-75"
                )}
              >
                <PlatformIcon platform={p} size="sm" />
                <span className="hidden sm:inline">{platformMeta[p].label}</span>
                {active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-3 bg-bg-surface border border-white/5 rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-4 h-4 text-brand-teal" />
            <h3 className="text-sm font-medium text-text-muted">Follower Growth (12 weeks)</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={followerGrowth}>
                <defs>
                  <linearGradient id="igGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E1306C" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#E1306C" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="ttGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00F2EA" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00F2EA" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="ytGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF0000" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#FF0000" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1A535C22" />
                <XAxis dataKey="week" tick={{ fill: "#5A7A74", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#5A7A74", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => formatNumber(v)} />
                <Tooltip
                  contentStyle={{ background: "#111F22", border: "1px solid #1A535C33", borderRadius: 12, color: "#FAF0E6" }}
                  formatter={(value: number, name: string) => [formatNumber(value), platformMeta[name as Platform]?.label ?? name]}
                />
                {visiblePlatforms.has("tiktok") && (
                  <Area type="monotone" dataKey="tiktok" stroke="#00F2EA" strokeWidth={2} fill="url(#ttGrad)" animationDuration={500} />
                )}
                {visiblePlatforms.has("instagram") && (
                  <Area type="monotone" dataKey="instagram" stroke="#E1306C" strokeWidth={2} fill="url(#igGrad)" animationDuration={500} />
                )}
                {visiblePlatforms.has("youtube") && (
                  <Area type="monotone" dataKey="youtube" stroke="#FF0000" strokeWidth={2} fill="url(#ytGrad)" animationDuration={500} />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
          {/* Interactive legend */}
          <div className="flex items-center gap-6 mt-4 justify-center">
            {(["instagram", "tiktok", "youtube"] as const).map((p) => (
              <button
                key={p}
                onClick={() => togglePlatform(p)}
                className={cn(
                  "flex items-center gap-1.5 text-xs transition-opacity",
                  visiblePlatforms.has(p) ? "text-text-muted opacity-100" : "text-text-dim opacity-40"
                )}
              >
                <span className="w-3 h-0.5 rounded" style={{ backgroundColor: platformMeta[p].color }} />
                {platformMeta[p].label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Engagement by day */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-2 bg-bg-surface border border-white/5 rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-4 h-4 text-brand-gold" />
            <h3 className="text-sm font-medium text-text-muted">Engagement by Day</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={engagementByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1A535C22" />
                <XAxis dataKey="day" tick={{ fill: "#5A7A74", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#5A7A74", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip
                  contentStyle={{ background: "#111F22", border: "1px solid #C9A84C33", borderRadius: 12, color: "#FAF0E6" }}
                  formatter={(value: number, name: string) => [`${value}%`, platformMeta[name as Platform]?.label ?? name]}
                />
                {visiblePlatforms.has("tiktok") && <Bar dataKey="tiktok" fill="#00F2EA" radius={[3, 3, 0, 0]} opacity={0.7} animationDuration={500} />}
                {visiblePlatforms.has("instagram") && <Bar dataKey="instagram" fill="#E1306C" radius={[3, 3, 0, 0]} opacity={0.7} animationDuration={500} />}
                {visiblePlatforms.has("youtube") && <Bar dataKey="youtube" fill="#FF0000" radius={[3, 3, 0, 0]} opacity={0.7} animationDuration={500} />}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Best posting times */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        {(["instagram", "tiktok", "youtube"] as const).map((key) => (
          <div key={key} className={cn(
            "flex items-center gap-3 bg-bg-surface/60 border rounded-xl p-4 transition-opacity",
            visiblePlatforms.has(key) ? "border-white/5 opacity-100" : "border-white/5 opacity-30"
          )}>
            <PlatformIcon platform={key} />
            <div>
              <p className="text-xs text-text-dim">Best time to post</p>
              <p className="text-sm font-medium">{bestTimes[key].best}</p>
              <p className="text-[10px] text-text-dim">{bestTimes[key].day}s perform best</p>
            </div>
          </div>
        ))}
      </motion.div>
    </Band>
  );
}
