"use client";

import { motion } from "motion/react";
import { TrendingUp, TrendingDown, Users, DollarSign, Eye, Sparkles } from "lucide-react";
import { heroMetrics } from "@/data/mock";
import { cn, getGreeting, formatNumber, formatCurrency, formatPercent } from "@/lib/utils";
import { Band } from "@/components/ui/band";

const iconMap = {
  "Total Followers": Users,
  "Monthly Donations": DollarSign,
  "Content Reach": Eye,
  "Engagement Rate": Sparkles,
};

export function ExecutiveOverview() {
  const greeting = getGreeting();
  const metrics = Object.values(heroMetrics);
  const primary = metrics[0];
  const secondary = metrics.slice(1);

  return (
    <Band className="min-h-[70vh] flex items-center pt-24 pb-16" id="overview">
      <div className="w-full">
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <p className="text-text-dim text-lg mb-2">{greeting},</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-2">
            <span className="text-text-primary">Guided</span>
            <span className="text-brand-gold">Barakah</span>
          </h1>
          <p className="text-text-muted text-lg mt-4 max-w-xl">
            Here&apos;s your command surface. Everything that matters, nothing that doesn&apos;t.
          </p>
        </motion.div>

        {/* Hero Metrics */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Primary metric — larger */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="lg:col-span-2 bg-bg-surface border border-brand-teal/20 rounded-2xl p-8"
          >
            <MetricCard metric={primary} large />
          </motion.div>

          {/* Secondary metrics */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3 gap-4">
            {secondary.map((metric, i) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
                className="bg-bg-surface/60 border border-white/5 rounded-xl p-5"
              >
                <MetricCard metric={metric} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Band>
  );
}

function MetricCard({
  metric,
  large,
}: {
  metric: { value: number; change: number; label: string; suffix?: string };
  large?: boolean;
}) {
  const Icon = iconMap[metric.label as keyof typeof iconMap] || Sparkles;
  const isPositive = metric.change >= 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  const displayValue =
    metric.label === "Monthly Donations"
      ? formatCurrency(metric.value)
      : metric.suffix
        ? `${metric.value}${metric.suffix}`
        : formatNumber(metric.value);

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Icon className={cn("text-text-dim", large ? "w-5 h-5" : "w-4 h-4")} />
        <span className={cn("text-text-dim", large ? "text-sm" : "text-xs")}>{metric.label}</span>
      </div>
      <p className={cn("font-light tracking-tight", large ? "text-5xl" : "text-2xl")}>
        {displayValue}
      </p>
      <div className={cn("flex items-center gap-1 mt-2", isPositive ? "text-status-green" : "text-status-red")}>
        <TrendIcon className="w-3 h-3" />
        <span className="text-xs font-medium">{formatPercent(metric.change)}</span>
        <span className="text-xs text-text-dim ml-1">vs last month</span>
      </div>
    </div>
  );
}
