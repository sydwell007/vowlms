type ProgressBarProps = {
  value: number;
  label?: string;
};

export function ProgressBar({ value, label }: ProgressBarProps) {
  const normalized = Math.min(100, Math.max(0, value));

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
        <span>{label ?? "Progress"}</span>
        <span>{normalized}%</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-200/90">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#1166c8] via-electric to-gold shadow-[0_0_24px_rgba(32,199,255,0.22)]"
          style={{ width: `${normalized}%` }}
        />
      </div>
    </div>
  );
}
