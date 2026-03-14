"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Pencil } from "lucide-react";

interface EditableTextProps {
  value: string;
  onSave: (value: string) => void;
  className?: string;
  inputClassName?: string;
}

export function EditableText({ value, onSave, className, inputClassName }: EditableTextProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const commit = () => {
    setEditing(false);
    if (draft.trim() && draft !== value) onSave(draft.trim());
    else setDraft(value);
  };

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
          if (e.key === "Escape") { setDraft(value); setEditing(false); }
        }}
        className={cn(
          "bg-brand-teal/10 border border-brand-teal/30 rounded px-2 py-0.5 outline-none text-text-primary",
          inputClassName ?? className
        )}
      />
    );
  }

  return (
    <span
      onClick={() => setEditing(true)}
      className={cn("cursor-pointer group/edit inline-flex items-center gap-1 hover:text-brand-gold transition-colors", className)}
      title="Click to edit"
    >
      <span>{value}</span>
      <Pencil className="w-2.5 h-2.5 opacity-0 group-hover/edit:opacity-50 transition-opacity shrink-0" />
    </span>
  );
}

interface EditableNumberProps {
  value: number;
  onSave: (value: number) => void;
  format?: (n: number) => string;
  className?: string;
  inputClassName?: string;
  suffix?: string;
}

export function EditableNumber({ value, onSave, format, className, inputClassName, suffix }: EditableNumberProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  useEffect(() => {
    setDraft(String(value));
  }, [value]);

  const commit = () => {
    setEditing(false);
    const parsed = parseFloat(draft.replace(/[^0-9.\-]/g, ""));
    if (!isNaN(parsed) && parsed !== value) onSave(parsed);
    else setDraft(String(value));
  };

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
          if (e.key === "Escape") { setDraft(String(value)); setEditing(false); }
        }}
        className={cn(
          "bg-brand-teal/10 border border-brand-teal/30 rounded px-2 py-0.5 outline-none text-text-primary w-24 tabular-nums",
          inputClassName ?? className
        )}
      />
    );
  }

  const display = format ? format(value) : String(value);

  return (
    <span
      onClick={() => { setDraft(String(value)); setEditing(true); }}
      className={cn("cursor-pointer group/edit inline-flex items-center gap-1 hover:text-brand-gold transition-colors tabular-nums", className)}
      title="Click to edit"
    >
      <span>{display}{suffix}</span>
      <Pencil className="w-2.5 h-2.5 opacity-0 group-hover/edit:opacity-50 transition-opacity shrink-0" />
    </span>
  );
}
