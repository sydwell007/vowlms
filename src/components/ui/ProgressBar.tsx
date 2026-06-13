type ProgressBarProps = {
  value: number;
  label?: string;
};

export function ProgressBar({ value, label }: ProgressBarProps) {
  const normalized = Math.min(100, Math.max(0, value));

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-600">
        <span>{label ?? "Progress"}</span>
        <span>{normalized}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#1166c8] via-electric to-gold"
          style={{ width: `${normalized}%` }}
        />
      </div>
    </div>
  );
}
