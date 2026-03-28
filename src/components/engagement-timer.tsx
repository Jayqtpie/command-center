"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const TIMER_DURATION = 20 * 60; // 20 minutes in seconds
const SESSIONS_TARGET = 3;

interface StoredTimerState {
  sessionsToday: number;
  totalTimeToday: number;
  streakDays: number;
  lastSessionDate: string;
}

function getStoredState(): StoredTimerState {
  if (typeof window === "undefined") {
    return { sessionsToday: 0, totalTimeToday: 0, streakDays: 0, lastSessionDate: "" };
  }
  try {
    const stored = localStorage.getItem("engagement-timer");
    if (stored) {
      const parsed = JSON.parse(stored) as StoredTimerState;
      const today = new Date().toISOString().slice(0, 10);
      if (parsed.lastSessionDate !== today) {
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        const streak = parsed.lastSessionDate === yesterday ? parsed.streakDays : 0;
        return { sessionsToday: 0, totalTimeToday: 0, streakDays: streak, lastSessionDate: today };
      }
      return parsed;
    }
  } catch {}
  return { sessionsToday: 0, totalTimeToday: 0, streakDays: 0, lastSessionDate: "" };
}

function saveState(state: StoredTimerState) {
  localStorage.setItem("engagement-timer", JSON.stringify(state));
}

export function EngagementTimer() {
  const [timeRemaining, setTimeRemaining] = useState(TIMER_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [storedState, setStoredState] = useState<StoredTimerState>(getStoredState);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearTimer();
            setIsRunning(false);
            const today = new Date().toISOString().slice(0, 10);
            setStoredState((s) => {
              const updated = {
                sessionsToday: s.sessionsToday + 1,
                totalTimeToday: s.totalTimeToday + TIMER_DURATION,
                streakDays: s.lastSessionDate === today ? s.streakDays : s.streakDays + 1,
                lastSessionDate: today,
              };
              saveState(updated);
              return updated;
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return clearTimer;
  }, [isRunning, timeRemaining, clearTimer]);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const display = `${minutes}:${seconds.toString().padStart(2, "0")}`;
  const progress = timeRemaining / TIMER_DURATION;
  const circumference = 2 * Math.PI * 46;
  const dashOffset = circumference * (1 - progress);

  return (
    <div className="p-7 border-r border-[--border]">
      <div className="text-[10px] tracking-[2px] uppercase text-[--text-secondary] mb-5">
        Engagement Timer
      </div>
      <div className="flex items-center gap-7">
        <div className="relative w-[110px] h-[110px] flex-shrink-0">
          <svg width="110" height="110" viewBox="0 0 110 110" className="-rotate-90">
            <circle cx="55" cy="55" r="46" fill="none" stroke="var(--border)" strokeWidth="5" />
            <circle
              cx="55"
              cy="55"
              r="46"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              style={{ filter: "drop-shadow(0 0 4px rgba(198,122,60,0.4))" }}
            />
          </svg>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="text-[28px] font-normal tracking-tight leading-none">
              {display}
            </div>
            <div className="text-[9px] tracking-[1px] uppercase text-[--text-secondary] mt-[3px]">
              remaining
            </div>
          </div>
        </div>
        <div>
          <div className="text-[11px] text-[--text-muted] mb-1">
            Sessions: <strong className="text-[--text-primary]">{storedState.sessionsToday} of {SESSIONS_TARGET}</strong>
          </div>
          <div className="text-[11px] text-[--text-muted] mb-1">
            Time today: <strong className="text-[--text-primary]">{Math.floor(storedState.totalTimeToday / 60)} min</strong>
          </div>
          <div className="text-[11px] text-[--text-muted] mb-3">
            Streak: <strong className="text-terracotta">{storedState.streakDays} days</strong>
          </div>
          <div className="flex gap-2">
            {isRunning ? (
              <button
                onClick={() => setIsRunning(false)}
                className="px-4 py-[6px] bg-terracotta text-white rounded-md text-xs font-semibold tracking-wide cursor-pointer"
              >
                Pause
              </button>
            ) : (
              <button
                onClick={() => setIsRunning(true)}
                className="px-4 py-[6px] bg-terracotta text-white rounded-md text-xs font-semibold tracking-wide cursor-pointer"
              >
                Start
              </button>
            )}
            <button
              onClick={() => {
                setIsRunning(false);
                setTimeRemaining(TIMER_DURATION);
              }}
              className="px-[14px] py-[6px] bg-transparent border border-[#ccc4b8] text-[--text-muted] rounded-md text-xs cursor-pointer"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
