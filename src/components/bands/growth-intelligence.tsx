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
import { TrendingUp, Users, DollarSign, Eye } from "lucide-react";
import { growthData } from "@/data/mock";
import { cn, formatNumber, formatCurrency } from "@/lib/utils";
import { Band, BandTitle } from "@/components/ui/band";

const kpis = [
  { label: "Follower Growth", value: "+38.2K", subtext: "last 12 months", icon: Users, color: "text-brand-teal" },
  { label: "Donation Growth", value: "+55%", subtext: "$31K → $48.2K", icon: DollarSign, color: "text-brand-gold" },
  { label: "Reach Growth", value: "+95%", subtext: "1.2M → 2.3M", icon: Eye, color: "text-status-green" },
];

export function GrowthIntelligence() {
  return (
    <Band id="growth">
      <BandTitle>Growth Intelligence</BandTitle>

      {/* KPI strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className="flex items-center gap-4 bg-bg-surface/60 border border-white/5 rounded-xl p-5"
          >
            <div className={cn("p-2.5 rounded-lg bg-bg-elevated", kpi.color)}>
              <kpi.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-light tracking-tight">{kpi.value}</p>
              <p className="text-xs text-text-dim">{kpi.label}</p>
              <p className="text-[10px] text-text-dim/60">{kpi.subtext}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts — asymmetric layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Audience growth — wide */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-3 bg-bg-surface border border-white/5 rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-4 h-4 text-brand-teal" />
            <h3 className="text-sm font-medium text-text-muted">Audience Growth</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="followerGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1A535C" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#1A535C" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1A535C22" />
                <XAxis dataKey="month" tick={{ fill: "#5A7A74", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#5A7A74", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => formatNumber(v)} />
                <Tooltip
                  contentStyle={{ background: "#111F22", border: "1px solid #1A535C33", borderRadius: 12, color: "#FAF0E6" }}
                  formatter={(value: number) => [formatNumber(value), "Followers"]}
                />
                <Area type="monotone" dataKey="followers" stroke="#1A535C" strokeWidth={2} fill="url(#followerGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Donations — narrow bar chart */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-2 bg-bg-surface border border-white/5 rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <DollarSign className="w-4 h-4 text-brand-gold" />
            <h3 className="text-sm font-medium text-text-muted">Monthly Donations</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1A535C22" />
                <XAxis dataKey="month" tick={{ fill: "#5A7A74", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#5A7A74", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
                <Tooltip
                  contentStyle={{ background: "#111F22", border: "1px solid #C9A84C33", borderRadius: 12, color: "#FAF0E6" }}
                  formatter={(value: number) => [formatCurrency(value), "Donations"]}
                />
                <Bar dataKey="donations" fill="#C9A84C" radius={[4, 4, 0, 0]} opacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </Band>
  );
}
