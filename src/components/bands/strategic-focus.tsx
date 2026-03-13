"use client";

import { motion } from "motion/react";
import { Target, Clock, AlertTriangle, ChevronRight } from "lucide-react";
import { initiatives } from "@/data/mock";
import { cn } from "@/lib/utils";
import { Band, BandTitle } from "@/components/ui/band";

const priorityColors = {
  critical: "bg-status-red/20 text-red-300 border-status-red/30",
  high: "bg-status-amber/20 text-amber-300 border-status-amber/30",
  medium: "bg-brand-teal/20 text-teal-300 border-brand-teal/30",
};

const statusIcons = {
  active: Target,
  planning: Clock,
  blocked: AlertTriangle,
};

export function StrategicFocus() {
  const primary = initiatives[0];
  const rest = initiatives.slice(1);

  return (
    <Band id="strategy" className="bg-bg-surface/40">
      <BandTitle>Strategic Focus</BandTitle>

      {/* Primary Initiative — dominant */}
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="bg-bg-elevated border border-brand-teal/20 rounded-2xl p-8 mb-8"
      >
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border", priorityColors[primary.priority])}>
                {primary.priority}
              </span>
              <span className="text-text-dim text-xs flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {primary.dueDate}
              </span>
            </div>
            <h3 className="text-2xl font-light tracking-tight mb-2">{primary.title}</h3>
            <p className="text-text-muted text-sm max-w-xl">{primary.description}</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-light text-brand-gold">{primary.progress}%</p>
            <p className="text-xs text-text-dim mt-1">complete</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-6 h-1.5 bg-bg-deep rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${primary.progress}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-brand-teal to-brand-gold rounded-full"
          />
        </div>
      </motion.div>

      {/* Secondary Initiatives */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {rest.map((item, i) => {
          const StatusIcon = statusIcons[item.status] || Target;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="group bg-bg-surface border border-white/5 rounded-xl p-5 hover:border-brand-teal/20 transition-colors cursor-default"
            >
              <div className="flex items-center justify-between mb-3">
                <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border", priorityColors[item.priority])}>
                  {item.priority}
                </span>
                <StatusIcon className="w-4 h-4 text-text-dim" />
              </div>
              <h4 className="font-medium text-sm mb-1">{item.title}</h4>
              <p className="text-xs text-text-dim mb-4 line-clamp-2">{item.description}</p>

              <div className="flex items-center justify-between">
                <div className="flex-1 mr-3">
                  <div className="h-1 bg-bg-deep rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-teal/60 rounded-full transition-all"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs text-text-muted font-medium">{item.progress}%</span>
              </div>

              <div className="flex items-center justify-between mt-3">
                <span className="text-[10px] text-text-dim">{item.dueDate}</span>
                <ChevronRight className="w-3 h-3 text-text-dim opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </Band>
  );
}
