export function Header() {
  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="flex items-baseline justify-between">
      <h1 className="text-[28px] font-light tracking-tight">
        Command{" "}
        <span className="font-serif italic font-normal">Center</span>
      </h1>
      <div className="flex items-center gap-3 text-[11px] text-[--text-secondary] tracking-wide">
        <span className="inline-flex items-center gap-[5px]">
          <span className="inline-block h-[6px] w-[6px] rounded-full bg-[--success] shadow-[0_0_6px_rgba(74,222,128,0.4)]" />
          LIVE
        </span>
        <span>{today}</span>
      </div>
    </div>
  );
}
