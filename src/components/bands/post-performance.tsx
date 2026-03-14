"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Eye, Heart, MessageCircle, Share2, Bookmark, TrendingUp, ArrowUpDown, Filter } from "lucide-react";
import { type Platform, type Post } from "@/data/mock";
import { useData } from "@/lib/data-context";
import { cn, formatNumber } from "@/lib/utils";
import { Band, BandTitle } from "@/components/ui/band";
import { PlatformIcon } from "@/components/ui/platform-icon";
import { EditableText, EditableNumber } from "@/components/ui/editable";

const typeLabels: Record<string, string> = {
  reel: "Reel", carousel: "Carousel", story: "Story", video: "Video", short: "Short", static: "Static",
};

type SortKey = "views" | "likes" | "engagementRate" | "saves" | "shares";

const sortOptions: { key: SortKey; label: string }[] = [
  { key: "views", label: "Views" },
  { key: "likes", label: "Likes" },
  { key: "engagementRate", label: "Engagement" },
  { key: "saves", label: "Saves" },
  { key: "shares", label: "Shares" },
];

export function PostPerformance() {
  const { recentPosts, updateRecentPost } = useData();
  const [platformFilter, setPlatformFilter] = useState<Platform | "all">("all");
  const [sortBy, setSortBy] = useState<SortKey>("views");
  const [expandedPost, setExpandedPost] = useState<number | null>(null);

  const filtered = recentPosts
    .filter((p) => platformFilter === "all" || p.platform === platformFilter)
    .sort((a, b) => b[sortBy] - a[sortBy]);

  const topPost = filtered[0];
  const rest = filtered.slice(1);

  return (
    <Band id="posts" className="bg-bg-surface/40">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <BandTitle className="mb-0">Recent Posts</BandTitle>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-bg-elevated rounded-lg p-1">
            <FilterButton active={platformFilter === "all"} onClick={() => setPlatformFilter("all")}>All</FilterButton>
            {(["instagram", "tiktok", "youtube"] as const).map((p) => (
              <FilterButton key={p} active={platformFilter === p} onClick={() => setPlatformFilter(p)}>
                <PlatformIcon platform={p} size="sm" />
              </FilterButton>
            ))}
          </div>

          <div className="relative group">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-bg-elevated rounded-lg text-xs text-text-muted hover:text-text-primary transition-colors">
              <ArrowUpDown className="w-3 h-3" />
              {sortOptions.find((s) => s.key === sortBy)?.label}
            </button>
            <div className="absolute right-0 top-full mt-1 bg-bg-elevated border border-white/10 rounded-lg p-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 min-w-[120px]">
              {sortOptions.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setSortBy(opt.key)}
                  className={cn(
                    "w-full text-left px-3 py-1.5 rounded text-xs transition-colors",
                    sortBy === opt.key ? "bg-brand-teal/20 text-brand-teal" : "text-text-muted hover:text-text-primary hover:bg-white/5"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-text-dim">
          <Filter className="w-8 h-8 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No posts match this filter.</p>
          <button onClick={() => setPlatformFilter("all")} className="text-xs text-brand-teal mt-2 hover:underline">Clear filter</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {topPost && (
            <motion.div
              key={topPost.id}
              layout
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
              <EditableText
                value={topPost.title}
                onSave={(v) => updateRecentPost(topPost.id, "title", v)}
                className="text-lg font-light tracking-tight mb-6 block"
              />

              <div className="grid grid-cols-2 gap-4">
                <MiniStatEditable icon={Eye} label="views" value={topPost.views} onSave={(v) => updateRecentPost(topPost.id, "views", v)} />
                <MiniStatEditable icon={Heart} label="likes" value={topPost.likes} onSave={(v) => updateRecentPost(topPost.id, "likes", v)} />
                <MiniStatEditable icon={MessageCircle} label="comments" value={topPost.comments} onSave={(v) => updateRecentPost(topPost.id, "comments", v)} />
                <MiniStatEditable icon={Share2} label="shares" value={topPost.shares} onSave={(v) => updateRecentPost(topPost.id, "shares", v)} />
                <MiniStatEditable icon={Bookmark} label="saves" value={topPost.saves} onSave={(v) => updateRecentPost(topPost.id, "saves", v)} />
                <div className="text-center">
                  <EditableNumber
                    value={topPost.engagementRate}
                    onSave={(v) => updateRecentPost(topPost.id, "engagementRate", v)}
                    suffix="%"
                    className="text-lg font-light text-brand-gold"
                  />
                  <p className="text-[10px] text-text-dim">engagement</p>
                </div>
              </div>
            </motion.div>
          )}

          <div className="lg:col-span-2 space-y-3">
            <AnimatePresence mode="popLayout">
              {rest.map((post) => (
                <PostRow
                  key={post.id}
                  post={post}
                  expanded={expandedPost === post.id}
                  onToggle={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                  onUpdate={updateRecentPost}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </Band>
  );
}

function PostRow({ post, expanded, onToggle, onUpdate }: {
  post: Post;
  expanded: boolean;
  onToggle: () => void;
  onUpdate: (id: number, field: string, value: number | string) => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "bg-bg-surface border rounded-xl transition-all",
        expanded ? "border-white/15 ring-1 ring-white/5" : "border-white/5 hover:border-white/10"
      )}
    >
      <div className="flex items-center gap-4 p-4 cursor-pointer" onClick={onToggle}>
        <PlatformIcon platform={post.platform} />

        <div className="flex-1 min-w-0">
          <EditableText
            value={post.title}
            onSave={(v) => onUpdate(post.id, "title", v)}
            className="text-sm font-medium truncate"
          />
          <p className="text-[10px] text-text-dim mt-0.5">{typeLabels[post.type]} · {post.publishedAt}</p>
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
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 border-t border-white/5">
              <div className="grid grid-cols-5 gap-3 mt-3">
                <EditableStatCell icon={Eye} label="Views" value={post.views} onSave={(v) => onUpdate(post.id, "views", v)} />
                <EditableStatCell icon={Heart} label="Likes" value={post.likes} onSave={(v) => onUpdate(post.id, "likes", v)} />
                <EditableStatCell icon={MessageCircle} label="Comments" value={post.comments} onSave={(v) => onUpdate(post.id, "comments", v)} />
                <EditableStatCell icon={Share2} label="Shares" value={post.shares} onSave={(v) => onUpdate(post.id, "shares", v)} />
                <EditableStatCell icon={Bookmark} label="Saves" value={post.saves} onSave={(v) => onUpdate(post.id, "saves", v)} />
              </div>
              <div className="flex items-center gap-3 mt-4">
                <div className="flex-1 bg-bg-elevated/50 rounded-lg py-2 text-center">
                  <p className="text-[10px] text-text-dim">Engagement Rate</p>
                  <EditableNumber
                    value={post.engagementRate}
                    onSave={(v) => onUpdate(post.id, "engagementRate", v)}
                    suffix="%"
                    className="text-sm font-medium text-brand-gold"
                  />
                </div>
                <button className="flex-1 py-2.5 bg-brand-teal/15 hover:bg-brand-teal/25 text-brand-teal text-xs font-medium rounded-lg transition-colors">
                  View Analytics
                </button>
                <button className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-text-muted text-xs font-medium rounded-lg transition-colors">
                  Boost Post
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function FilterButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-2.5 py-1 rounded-md text-xs font-medium transition-colors",
        active ? "bg-brand-teal/20 text-brand-teal" : "text-text-dim hover:text-text-muted"
      )}
    >
      {children}
    </button>
  );
}

function MiniStatEditable({ icon: Icon, label, value, onSave }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  onSave: (v: number) => void;
}) {
  return (
    <div className="text-center">
      <Icon className="w-3 h-3 text-text-dim mx-auto mb-1" />
      <EditableNumber value={value} onSave={onSave} format={formatNumber} className="text-lg font-light" />
      <p className="text-[10px] text-text-dim">{label}</p>
    </div>
  );
}

function EditableStatCell({ icon: Icon, label, value, onSave }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  onSave: (v: number) => void;
}) {
  return (
    <div className="text-center bg-bg-elevated/50 rounded-lg py-2.5">
      <Icon className="w-3 h-3 text-text-dim mx-auto mb-1" />
      <EditableNumber value={value} onSave={onSave} format={formatNumber} className="text-sm font-medium" />
      <p className="text-[10px] text-text-dim">{label}</p>
    </div>
  );
}
