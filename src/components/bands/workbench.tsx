"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  PenLine,
  Send,
  Plus,
  Megaphone,
  FileText,
  Calendar,
  MessageSquare,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Band, BandTitle } from "@/components/ui/band";

const quickActions = [
  { label: "New Campaign", icon: Megaphone, color: "bg-brand-gold/10 text-brand-gold hover:bg-brand-gold/20" },
  { label: "Draft Content", icon: FileText, color: "bg-brand-teal/10 text-brand-teal hover:bg-brand-teal/20" },
  { label: "Schedule Post", icon: Calendar, color: "bg-purple-500/10 text-purple-400 hover:bg-purple-500/20" },
  { label: "Send Update", icon: MessageSquare, color: "bg-blue-500/10 text-blue-400 hover:bg-blue-500/20" },
];

export function Workbench() {
  const [note, setNote] = useState("");
  const [tasks, setTasks] = useState<string[]>([]);
  const [taskInput, setTaskInput] = useState("");

  const addTask = () => {
    if (taskInput.trim()) {
      setTasks((prev) => [...prev, taskInput.trim()]);
      setTaskInput("");
    }
  };

  return (
    <Band id="workbench" className="bg-bg-surface/40 pb-24">
      <BandTitle>Your Workbench</BandTitle>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left — Quick actions + tasks */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div>
            <h3 className="text-sm font-medium text-text-muted mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action, i) => (
                <motion.button
                  key={action.label}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.3 }}
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-xl border border-white/5 transition-colors cursor-pointer",
                    action.color
                  )}
                >
                  <action.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{action.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Quick Tasks */}
          <div>
            <h3 className="text-sm font-medium text-text-muted mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Quick Tasks
            </h3>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTask()}
                placeholder="Add a task..."
                className="flex-1 bg-bg-elevated border border-white/10 rounded-lg px-4 py-2.5 text-sm text-text-primary placeholder:text-text-dim focus:outline-none focus:border-brand-teal/40 transition-colors"
              />
              <button
                onClick={addTask}
                className="px-4 py-2.5 bg-brand-teal/20 text-brand-teal rounded-lg hover:bg-brand-teal/30 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {tasks.length > 0 && (
              <div className="space-y-2">
                {tasks.map((task, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="flex items-center gap-3 bg-bg-elevated/60 border border-white/5 rounded-lg px-4 py-2.5"
                  >
                    <div className="w-4 h-4 rounded border border-text-dim/40 shrink-0" />
                    <span className="text-sm">{task}</span>
                  </motion.div>
                ))}
              </div>
            )}
            {tasks.length === 0 && (
              <p className="text-xs text-text-dim/60 italic">No tasks yet. Start adding to your list.</p>
            )}
          </div>
        </div>

        {/* Right — Notes */}
        <div>
          <h3 className="text-sm font-medium text-text-muted mb-4 flex items-center gap-2">
            <PenLine className="w-4 h-4" />
            Quick Notes
          </h3>
          <div className="bg-bg-elevated border border-white/10 rounded-2xl p-1">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Jot down ideas, reminders, or anything on your mind..."
              className="w-full h-64 bg-transparent rounded-xl px-5 py-4 text-sm text-text-primary placeholder:text-text-dim/60 resize-none focus:outline-none leading-relaxed"
            />
            <div className="flex items-center justify-between px-4 py-3 border-t border-white/5">
              <span className="text-[10px] text-text-dim">
                {note.length > 0 ? `${note.length} characters` : "Start typing..."}
              </span>
              <button
                className={cn(
                  "flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-medium transition-colors",
                  note.length > 0
                    ? "bg-brand-gold/20 text-brand-gold hover:bg-brand-gold/30"
                    : "bg-white/5 text-text-dim cursor-not-allowed"
                )}
                disabled={note.length === 0}
              >
                <Send className="w-3 h-3" />
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </Band>
  );
}
