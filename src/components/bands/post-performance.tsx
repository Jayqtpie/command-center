"use client";

import { motion } from "motion/react";
import { Eye, Heart, MessageCircle, Share2, Bookmark, TrendingUp } from "lucide-react";
import { recentPosts } from "@/data/mock";
import { cn, formatNumber } from "@/lib/utils";
import { Band, BandTitle } from "@/components/ui/band";
import { PlatformIcon } from "@/components/ui/platform-icon";

const typeLabels: Record<string, string> = {
  reel: "Reel",
  carousel: "Carousel",
  story: "Story",
  video: "Video",
  short: "Short",
  static: "Static",
};

export function PostPerformance() {
  const topPost = recentPosts[0];
  const rest = recentPosts.slice(1);

  return (
    <Band id="posts" className="bg-bg-surface/40">
      <BandTitle>Recent Posts</BandTitle>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top performer */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-bg-elevated border border-brand-gold/20 rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-brand-gold" />
            <span className="text-xs text-brand-gold font-medium">Top Performer</span>
          </div>
          <div className="flex items-center gap-2 mt-3 mb-3">
            <PlatformIcon platform={topPost.platform} size="sm" />
            <span className="text-[10px] text-text-dim uppercase">{typeLabels[topPost.type]} · {topPost.publishedAt}</span>
          </div>
          <h3 className="text-lg font-light tracking-tight mb-6">{topPost.title}</h3>

          <div className="grid grid-cols-2 gap-4">
            <MiniStat icon={Eye} value={formatNumber(topPost.views)} label="views" />
            <MiniStat icon={Heart} value={formatNumber(topPost.likes)} label="likes" />
            <MiniStat icon={MessageCircle} value={formatNumber(topPost.comments)} label="comments" />
            <MiniStat icon={Share2} value={formatNumber(topPost.shares)} label="shares" />
            <MiniStat icon={Bookmark} value={formatNumber(topPost.saves)} label="saves" />
            <div className="text-center">
              <p className="text-lg font-light text-brand-gold">{topPost.engagementRate}%</p>
              <p className="text-[10px] text-text-dim">engagement</p>
            </div>
          </div>
        </motion.div>

        {/* Post list */}
        <div className="lg:col-span-2 space-y-3">
          {rest.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, x: 12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="flex items-center gap-4 bg-bg-surface border border-white/5 rounded-xl p-4 hover:border-white/10 transition-colors"
            >
              <PlatformIcon platform={post.platform} />

              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium truncate">{post.title}</h4>
                <p className="text-[10px] text-text-dim mt-0.5">
                  {typeLabels[post.type]} · {post.publishedAt}
                </p>
              </div>

              <div className="hidden sm:flex items-center gap-5 text-xs text-text-muted shrink-0">
                <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{formatNumber(post.views)}</span>
                <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{formatNumber(post.likes)}</span>
                <span className="flex items-center gap-1"><Bookmark className="w-3 h-3" />{formatNumber(post.saves)}</span>
              </div>

              <span className={cn(
                "text-xs font-medium tabular-nums shrink-0",
                post.engagementRate >= 8 ? "text-status-green" : post.engagementRate >= 5 ? "text-brand-gold" : "text-text-muted"
              )}>
                {post.engagementRate}%
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </Band>
  );
}

function MiniStat({ icon: Icon, value, label }: { icon: React.ComponentType<{ className?: string }>; value: string; label: string }) {
  return (
    <div className="text-center">
      <Icon className="w-3 h-3 text-text-dim mx-auto mb-1" />
      <p className="text-lg font-light">{value}</p>
      <p className="text-[10px] text-text-dim">{label}</p>
    </div>
  );
}
