"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface BandProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function Band({ children, className, id }: BandProps) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn("px-6 py-16 md:px-12 lg:px-20", className)}
    >
      <div className="mx-auto max-w-7xl">{children}</div>
    </motion.section>
  );
}

export function BandTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={cn("mb-8 text-sm font-medium uppercase tracking-[0.2em] text-text-dim", className)}>
      {children}
    </h2>
  );
}
