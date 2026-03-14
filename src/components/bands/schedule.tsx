"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calendar, Clock, FileEdit, Send, Plus, X, Trash2, GripVertical } from "lucide-react";
import { type Platform, type Post, type PostStatus } from "@/data/mock";
import { useData } from "@/lib/data-context";
import { cn } from "@/lib/utils";
import { Band, BandTitle } from "@/components/ui/band";
import { PlatformIcon } from "@/components/ui/platform-icon";
import { EditableText } from "@/components/ui/editable";

const typeLabels: Record<string, string> = {
  reel: "Reel", carousel: "Carousel", story: "Story", video: "Video", short: "Short", static: "Static",
};

const statusConfig = {
  scheduled: { icon: Clock, color: "text-brand-gold", label: "Scheduled" },
  draft: { icon: FileEdit, color: "text-text-dim", label: "Draft" },
  published: { icon: Send, color: "text-status-green", label: "Published" },
};

export function Schedule() {
  const { scheduledPosts: posts, setScheduledPosts: setPosts } = useData();
  const [showComposer, setShowComposer] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newPlatform, setNewPlatform] = useState<Platform>("instagram");
  const [newType, setNewType] = useState("video");
  const [ideas, setIdeas] = useState<string[]>([]);
  const [ideaInput, setIdeaInput] = useState("");

  const scheduled = posts.filter((p) => p.status === "scheduled");
  const drafts = posts.filter((p) => p.status === "draft");

  const addPost = () => {
    if (!newTitle.trim()) return;
    const newPost: Post = {
      id: Date.now(),
      title: newTitle.trim(),
      platform: newPlatform,
      status: "draft",
      type: newType as Post["type"],
      publishedAt: null,
      scheduledFor: null,
      views: 0, likes: 0, comments: 0, shares: 0, saves: 0, engagementRate: 0,
    };
    setPosts((prev) => [...prev, newPost]);
    setNewTitle("");
    setShowComposer(false);
  };

  const deletePost = (id: number) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const promoteToScheduled = (id: number) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: "scheduled" as PostStatus, scheduledFor: "Not set" } : p
      )
    );
  };

  const addIdea = () => {
    if (ideaInput.trim()) {
      setIdeas((prev) => [...prev, ideaInput.trim()]);
      setIdeaInput("");
    }
  };

  const removeIdea = (index: number) => {
    setIdeas((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Band id="schedule" className="bg-bg-surface/40 pb-24">
      <div className="flex items-center justify-between mb-8">
        <BandTitle className="mb-0">Schedule &amp; Drafts</BandTitle>
        <button
          onClick={() => setShowComposer(!showComposer)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all",
            showComposer
              ? "bg-status-red/15 text-status-red hover:bg-status-red/25"
              : "bg-brand-teal/20 text-brand-teal hover:bg-brand-teal/30"
          )}
        >
          {showComposer ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          {showComposer ? "Cancel" : "New Post"}
        </button>
      </div>

      {/* Post composer */}
      <AnimatePresence>
        {showComposer && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginBottom: 0 }}
            animate={{ height: "auto", opacity: 1, marginBottom: 24 }}
            exit={{ height: 0, opacity: 0, marginBottom: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="bg-bg-elevated border border-brand-teal/20 rounded-2xl p-6">
              <h3 className="text-sm font-medium mb-4">Create New Post</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addPost()}
                  placeholder="Post title or description..."
                  className="w-full bg-bg-deep border border-white/10 rounded-lg px-4 py-3 text-sm text-text-primary placeholder:text-text-dim focus:outline-none focus:border-brand-teal/40 transition-colors"
                  autoFocus
                />
                <div className="flex flex-wrap gap-3">
                  {/* Platform selector */}
                  <div className="flex items-center gap-1 bg-bg-deep rounded-lg p-1">
                    {(["instagram", "tiktok", "youtube"] as const).map((p) => (
                      <button
                        key={p}
                        onClick={() => setNewPlatform(p)}
                        className={cn(
                          "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                          newPlatform === p ? "bg-brand-teal/20 text-brand-teal" : "text-text-dim hover:text-text-muted"
                        )}
                      >
                        <PlatformIcon platform={p} size="sm" />
                        <span className="hidden sm:inline">{p === "instagram" ? "Instagram" : p === "tiktok" ? "TikTok" : "YouTube"}</span>
                      </button>
                    ))}
                  </div>

                  {/* Type selector */}
                  <div className="flex items-center gap-1 bg-bg-deep rounded-lg p-1">
                    {["video", "carousel", "reel", "short", "static"].map((t) => (
                      <button
                        key={t}
                        onClick={() => setNewType(t)}
                        className={cn(
                          "px-3 py-1.5 rounded-md text-xs font-medium transition-colors capitalize",
                          newType === t ? "bg-brand-gold/20 text-brand-gold" : "text-text-dim hover:text-text-muted"
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={addPost}
                    disabled={!newTitle.trim()}
                    className={cn(
                      "px-6 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      newTitle.trim()
                        ? "bg-brand-teal text-white hover:bg-brand-teal/80"
                        : "bg-white/5 text-text-dim cursor-not-allowed"
                    )}
                  >
                    Save as Draft
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming queue */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-sm font-medium text-text-muted flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4" />
            Upcoming ({scheduled.length})
          </h3>
          <AnimatePresence mode="popLayout">
            {scheduled.map((post) => {
              const config = statusConfig[post.status];
              const StatusIcon = config.icon;
              return (
                <motion.div
                  key={post.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-center gap-4 bg-bg-surface border border-white/5 rounded-xl p-4 group hover:border-brand-gold/15 transition-colors"
                >
                  <GripVertical className="w-4 h-4 text-text-dim/30 shrink-0" />
                  <PlatformIcon platform={post.platform} />
                  <div className="flex-1 min-w-0">
                    <EditableText
                      value={post.title}
                      onSave={(v) => setPosts((prev) => prev.map((p) => p.id === post.id ? { ...p, title: v } : p))}
                      className="text-sm font-medium truncate"
                    />
                    <p className="text-[10px] text-text-dim">{typeLabels[post.type]}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <StatusIcon className={cn("w-3.5 h-3.5", config.color)} />
                    <span className="text-xs text-text-muted">{post.scheduledFor}</span>
                  </div>
                  <button
                    onClick={() => deletePost(post.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-status-red/15 rounded-lg transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-status-red" />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
          {scheduled.length === 0 && (
            <div className="text-center py-8 text-text-dim/40">
              <Calendar className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-xs">No scheduled posts. Create one above.</p>
            </div>
          )}
        </div>

        {/* Drafts + Ideas */}
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-text-muted flex items-center gap-2 mb-4">
              <FileEdit className="w-4 h-4" />
              Drafts ({drafts.length})
            </h3>
            <AnimatePresence mode="popLayout">
              {drafts.map((post) => (
                <motion.div
                  key={post.id}
                  layout
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-center gap-3 bg-bg-elevated/60 border border-white/5 rounded-xl p-4 mb-3 group"
                >
                  <PlatformIcon platform={post.platform} size="sm" />
                  <div className="flex-1 min-w-0">
                    <EditableText
                      value={post.title}
                      onSave={(v) => setPosts((prev) => prev.map((p) => p.id === post.id ? { ...p, title: v } : p))}
                      className="text-sm font-medium truncate"
                    />
                    <p className="text-[10px] text-text-dim">{typeLabels[post.type]}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => promoteToScheduled(post.id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-brand-gold/15 rounded-lg transition-all"
                      title="Move to scheduled"
                    >
                      <Clock className="w-3.5 h-3.5 text-brand-gold" />
                    </button>
                    <button
                      onClick={() => deletePost(post.id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-status-red/15 rounded-lg transition-all"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-status-red" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {drafts.length === 0 && (
              <p className="text-xs text-text-dim/40 italic">No drafts yet.</p>
            )}
          </div>

          {/* Quick ideas */}
          <div>
            <h3 className="text-sm font-medium text-text-muted mb-3">Content Ideas</h3>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={ideaInput}
                onChange={(e) => setIdeaInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addIdea()}
                placeholder="Quick content idea..."
                className="flex-1 bg-bg-elevated border border-white/10 rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-dim focus:outline-none focus:border-brand-teal/40 transition-colors"
              />
              <button
                onClick={addIdea}
                className="px-3 py-2 bg-brand-teal/20 text-brand-teal rounded-lg hover:bg-brand-teal/30 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <AnimatePresence mode="popLayout">
              {ideas.map((idea, i) => (
                <motion.div
                  key={`${idea}-${i}`}
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 bg-bg-elevated/40 border border-white/5 rounded-lg px-3 py-2 mb-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-gold/40 shrink-0" />
                  <span className="text-sm flex-1">{idea}</span>
                  <button
                    onClick={() => removeIdea(i)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-status-red/15 rounded transition-all"
                  >
                    <X className="w-3 h-3 text-status-red" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
            {ideas.length === 0 && (
              <p className="text-xs text-text-dim/40 italic">Jot down ideas for future content.</p>
            )}
          </div>
        </div>
      </div>
    </Band>
  );
}
