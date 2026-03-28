interface GoalTrackerProps {
  platform: string;
  current: number;
  target: number;
  label: string;
}

export function GoalTracker({
  platform,
  current,
  target,
  label,
}: GoalTrackerProps) {
  const percentage = Math.min(Math.round((current / target) * 100), 100);

  return (
    <div>
      <div className="flex items-baseline justify-between mb-[10px]">
        <span className="text-[15px] font-medium">
          {platform}{" "}
          <span className="font-light text-[--text-secondary]">&rarr;</span>{" "}
          <span className="font-serif italic">{label}</span>
        </span>
        <span className="text-xl font-normal text-terracotta">
          {percentage}%
        </span>
      </div>
      <div className="h-2 bg-[--border] rounded overflow-hidden">
        <div
          data-testid="progress-fill"
          className="h-full rounded bg-gradient-to-r from-terracotta-dark via-terracotta to-terracotta-light shadow-[0_0_8px_rgba(198,122,60,0.3)]"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
