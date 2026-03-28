interface MetricItem {
  label: string;
  value: string;
  change?: string;
  subtitle?: string;
}

interface MetricsRowProps {
  items: MetricItem[];
  darkBg?: boolean;
}

export function MetricsRow({ items, darkBg = false }: MetricsRowProps) {
  return (
    <div
      className={`grid gap-0 ${darkBg ? "bg-linen-dark border-y border-[--border]" : ""}`}
      style={{
        gridTemplateColumns: `repeat(${items.length}, 1fr)`,
        padding: darkBg ? "24px 36px" : "28px 36px",
      }}
    >
      {items.map((item, i) => (
        <div
          key={item.label}
          className={`py-4 ${i > 0 ? "border-l border-[--border] pl-6" : ""}`}
        >
          <div className="text-[10px] tracking-[2px] uppercase text-[--text-secondary]">
            {item.label}
          </div>
          <div className="text-[36px] font-normal tracking-[-1.5px] mt-1">
            {item.value}
          </div>
          {item.change && (
            <div className="text-xs font-semibold text-terracotta mt-1">
              {item.change}
            </div>
          )}
          {item.subtitle && (
            <div className="text-[11px] text-[--text-muted]">
              {item.subtitle}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
