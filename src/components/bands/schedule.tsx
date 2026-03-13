"use client";

import { motion } from "motion/react";
import { Calendar, Clock, FileEdit, Send } from "lucide-react";
import { scheduledPosts } from "@/data/mock";
import { cn } from "@/lib/utils";
import { Band, BandTitle } from "@/components/ui/band";
import { PlatformIcon } from "@/components/ui/platform-icon";

const statusConfig = {
  scheduled: { icon: Clock, color: "text-brand-gold", bg: "bg-brand-gold/10 border-brand-gold/20", label: "Scheduled" },
  draft: { icon: FileEdit, color: "text-text-dim", bg: "bg-white/5 border-white/10", label: "Draft" },
  published: { icon: Send, color: "text-status-green", bg: "bg-status-green/10 border-status-green/20", label: "Published" },
};

const typeLabels: Record<string, string> = {
  reel: "Reel", carousel: "Carousel", story: "Story", video: "Video", short: "Short", static: "Static",
};

export function Schedule() {
  const scheduled = scheduledPosts.filter((p) => p.status === "scheduled");
  const drafts = scheduledPosts.filter((p) => p.status === "draft");

  return (
    <Band id="schedule" className="bg-bg-surface/40">
      <BandTitle>Schedule &amp; Drafts</BandTitle>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming queue */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-sm font-medium text-text-muted flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4" />
            Upcoming
          </h3>
          {scheduled.map((post, i) => {
            const config = statusConfig[post.status];
            const StatusIcon = config.icon;
            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="flex items-center gap-4 bg-bg-surface border border-white/5 rounded-xl p-4 hover:border-brand-gold/15 transition-colors"
              >
                <PlatformIcon platform={post.platform} />

                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium truncate">{post.title}</h4>
                  <p className="text-[10px] text-text-dim">{typeLabels[post.type]}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <StatusIcon className={cn("w-3.5 h-3.5", config.color)} />
                  <span className="text-xs text-text-muted">{post.scheduledFor}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Drafts */}
        <div>
          <h3 className="text-sm font-medium text-text-muted flex items-center gap-2 mb-4">
            <FileEdit className="w-4 h-4" />
            Drafts
          </h3>
          {drafts.length > 0 ? (
            <div className="space-y-3">
              {drafts.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  className="flex items-center gap-3 bg-bg-elevated/60 border border-white/5 rounded-xl p-4"
                >
                  <PlatformIcon platform={post.platform} size="sm" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium truncate">{post.title}</h4>
                    <p className="text-[10px] text-text-dim">{typeLabels[post.type]}</p>
                  </div>
                  <span className="text-[10px] text-text-dim bg-white/5 px-2 py-0.5 rounded">Draft</span>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-text-dim/60 italic">No drafts.</p>
          )}

          {/* Quick post idea */}
          <div className="mt-6 bg-bg-elevated border border-white/10 rounded-xl p-4">
            <p className="text-xs text-text-dim mb-2">Quick post idea</p>
            <textarea
              placeholder="Jot down a content idea..."
              className="w-full h-24 bg-transparent text-sm text-text-primary placeholder:text-text-dim/40 resize-none focus:outline-none leading-relaxed"
            />
            <button className="mt-2 w-full py-2 bg-brand-teal/20 text-brand-teal text-xs font-medium rounded-lg hover:bg-brand-teal/30 transition-colors">
              Save as Draft
            </button>
          </div>
        </div>
      </div>
    </Band>
  );
}
