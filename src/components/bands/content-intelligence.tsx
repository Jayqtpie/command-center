"use client";

import { motion } from "motion/react";
import { Play, FileText, Image, Headphones, TrendingUp, TrendingDown, Minus, Share2, Eye, Heart } from "lucide-react";
import { topContent } from "@/data/mock";
import { cn, formatNumber } from "@/lib/utils";
import { Band, BandTitle } from "@/components/ui/band";

const typeIcons = {
  video: Play,
  article: FileText,
  carousel: Image,
  podcast: Headphones,
};

const typeColors = {
  video: "bg-red-500/10 text-red-400",
  article: "bg-blue-400/10 text-blue-400",
  carousel: "bg-purple-400/10 text-purple-400",
  podcast: "bg-green-400/10 text-green-400",
};

const trendIcons = {
  up: TrendingUp,
  down: TrendingDown,
  stable: Minus,
};

const trendColors = {
  up: "text-status-green",
  down: "text-status-red",
  stable: "text-text-dim",
};

export function ContentIntelligence() {
  const featured = topContent[0];
  const rest = topContent.slice(1);

  return (
    <Band id="content" className="bg-bg-surface/40">
      <BandTitle>Content Intelligence</BandTitle>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Featured content — large */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-1 bg-bg-elevated border border-brand-teal/20 rounded-2xl p-6 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ContentTypeBadge type={featured.type} />
              <span className="text-[10px] text-text-dim">{featured.publishedDaysAgo}d ago</span>
            </div>
            <h3 className="text-xl font-light tracking-tight mb-3">{featured.title}</h3>
            <p className="text-xs text-text-dim mb-1">Top performer this week</p>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <Stat icon={Eye} value={formatNumber(featured.views)} label="views" />
            <Stat icon={Heart} value={`${featured.engagement}%`} label="engage" />
            <Stat icon={Share2} value={formatNumber(featured.shares)} label="shares" />
          </div>
        </motion.div>

        {/* Content list */}
        <div className="lg:col-span-2 space-y-3">
          {rest.map((item, i) => {
            const TypeIcon = typeIcons[item.type];
            const TrendIcon = trendIcons[item.trend];
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="flex items-center gap-4 bg-bg-surface border border-white/5 rounded-xl p-4 hover:border-brand-teal/15 transition-colors"
              >
                <div className={cn("p-2 rounded-lg shrink-0", typeColors[item.type])}>
                  <TypeIcon className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium truncate">{item.title}</h4>
                  <p className="text-[10px] text-text-dim mt-0.5">{item.publishedDaysAgo}d ago</p>
                </div>

                <div className="hidden sm:flex items-center gap-6 text-xs text-text-muted shrink-0">
                  <span>{formatNumber(item.views)} views</span>
                  <span>{item.engagement}% eng</span>
                  <span>{formatNumber(item.shares)} shares</span>
                </div>

                <TrendIcon className={cn("w-4 h-4 shrink-0", trendColors[item.trend])} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </Band>
  );
}

function ContentTypeBadge({ type }: { type: keyof typeof typeIcons }) {
  const Icon = typeIcons[type];
  return (
    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium", typeColors[type])}>
      <Icon className="w-3 h-3" />
      {type}
    </span>
  );
}

function Stat({ icon: Icon, value, label }: { icon: React.ComponentType<{ className?: string }>; value: string; label: string }) {
  return (
    <div className="text-center">
      <Icon className="w-3 h-3 text-text-dim mx-auto mb-1" />
      <p className="text-lg font-light">{value}</p>
      <p className="text-[10px] text-text-dim">{label}</p>
    </div>
  );
}
