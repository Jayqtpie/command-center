"use client";

import { motion } from "motion/react";
import { CheckCircle2, AlertTriangle, XCircle, Bell, Info, AlertCircle } from "lucide-react";
import { systems, recentAlerts } from "@/data/mock";
import { cn } from "@/lib/utils";
import { Band, BandTitle } from "@/components/ui/band";

const statusConfig = {
  operational: { icon: CheckCircle2, color: "text-status-green", dot: "bg-status-green", label: "Operational" },
  degraded: { icon: AlertTriangle, color: "text-status-amber", dot: "bg-status-amber", label: "Degraded" },
  down: { icon: XCircle, color: "text-status-red", dot: "bg-status-red", label: "Down" },
};

const severityConfig = {
  warning: { icon: AlertCircle, color: "text-status-amber", bg: "bg-status-amber/10 border-status-amber/20" },
  info: { icon: Info, color: "text-brand-teal", bg: "bg-brand-teal/10 border-brand-teal/20" },
  critical: { icon: AlertTriangle, color: "text-status-red", bg: "bg-status-red/10 border-status-red/20" },
};

export function OperationsVisibility() {
  const allOperational = systems.every((s) => s.status === "operational");

  return (
    <Band id="operations">
      <BandTitle>Operations Visibility</BandTitle>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Systems grid */}
        <div className="lg:col-span-3">
          {/* Overall status */}
          <div className={cn("flex items-center gap-3 mb-6 p-4 rounded-xl border", allOperational ? "bg-status-green/5 border-status-green/20" : "bg-status-amber/5 border-status-amber/20")}>
            <div className={cn("w-2 h-2 rounded-full animate-pulse", allOperational ? "bg-status-green" : "bg-status-amber")} />
            <span className="text-sm font-medium">
              {allOperational ? "All systems operational" : "Some systems need attention"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {systems.map((system, i) => {
              const config = statusConfig[system.status];
              const StatusIcon = config.icon;
              return (
                <motion.div
                  key={system.name}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.3 }}
                  className="flex items-center justify-between bg-bg-surface border border-white/5 rounded-xl p-4"
                >
                  <div className="flex items-center gap-3">
                    <StatusIcon className={cn("w-4 h-4", config.color)} />
                    <div>
                      <p className="text-sm font-medium">{system.name}</p>
                      <p className="text-[10px] text-text-dim">
                        {system.lastIncident ? `Last incident: ${system.lastIncident}` : "No recent incidents"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn("text-sm font-medium tabular-nums", system.uptime >= 99.9 ? "text-status-green" : "text-status-amber")}>
                      {system.uptime}%
                    </p>
                    <p className="text-[10px] text-text-dim">uptime</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Alerts */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-4 h-4 text-text-dim" />
            <h3 className="text-sm font-medium text-text-muted">Recent Alerts</h3>
          </div>
          <div className="space-y-3">
            {recentAlerts.map((alert, i) => {
              const config = severityConfig[alert.severity];
              const SeverityIcon = config.icon;
              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  className={cn("border rounded-xl p-4", config.bg)}
                >
                  <div className="flex items-start gap-3">
                    <SeverityIcon className={cn("w-4 h-4 mt-0.5 shrink-0", config.color)} />
                    <div>
                      <p className="text-sm leading-relaxed">{alert.message}</p>
                      <p className="text-[10px] text-text-dim mt-1">{alert.time}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </Band>
  );
}
