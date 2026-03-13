"use client";

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
import { TrendingUp, Clock } from "lucide-react";
import { followerGrowth, engagementByDay, bestTimes } from "@/data/mock";
import { formatNumber } from "@/lib/utils";
import { Band, BandTitle } from "@/components/ui/band";
import { PlatformIcon } from "@/components/ui/platform-icon";

export function GrowthIntelligence() {
  return (
    <Band id="growth">
      <BandTitle>Growth &amp; Analytics</BandTitle>

      {/* Charts — asymmetric */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
        {/* Follower growth — wide */}
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
                  formatter={(value: number, name: string) => [formatNumber(value), name === "instagram" ? "Instagram" : name === "tiktok" ? "TikTok" : "YouTube"]}
                />
                <Area type="monotone" dataKey="tiktok" stroke="#00F2EA" strokeWidth={2} fill="url(#ttGrad)" />
                <Area type="monotone" dataKey="instagram" stroke="#E1306C" strokeWidth={2} fill="url(#igGrad)" />
                <Area type="monotone" dataKey="youtube" stroke="#FF0000" strokeWidth={2} fill="url(#ytGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div className="flex items-center gap-6 mt-4 justify-center">
            <span className="flex items-center gap-1.5 text-xs text-text-muted"><span className="w-3 h-0.5 bg-[#E1306C] rounded" />Instagram</span>
            <span className="flex items-center gap-1.5 text-xs text-text-muted"><span className="w-3 h-0.5 bg-[#00F2EA] rounded" />TikTok</span>
            <span className="flex items-center gap-1.5 text-xs text-text-muted"><span className="w-3 h-0.5 bg-[#FF0000] rounded" />YouTube</span>
          </div>
        </motion.div>

        {/* Engagement by day — narrow */}
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
                  formatter={(value: number, name: string) => [`${value}%`, name === "instagram" ? "Instagram" : name === "tiktok" ? "TikTok" : "YouTube"]}
                />
                <Bar dataKey="tiktok" fill="#00F2EA" radius={[3, 3, 0, 0]} opacity={0.7} />
                <Bar dataKey="instagram" fill="#E1306C" radius={[3, 3, 0, 0]} opacity={0.7} />
                <Bar dataKey="youtube" fill="#FF0000" radius={[3, 3, 0, 0]} opacity={0.7} />
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
          <div key={key} className="flex items-center gap-3 bg-bg-surface/60 border border-white/5 rounded-xl p-4">
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
