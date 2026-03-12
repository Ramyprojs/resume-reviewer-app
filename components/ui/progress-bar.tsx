import { cn } from "@/lib/utils/cn";

interface ProgressBarProps {
  value: number;
  className?: string;
  showValue?: boolean;
}

export function ProgressBar({
  value,
  className,
  showValue = true
}: ProgressBarProps) {
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-800">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,rgba(34,211,238,1),rgba(14,165,233,0.9),rgba(245,158,11,0.9))] transition-all duration-500"
          style={{ width: `${safeValue}%` }}
        />
      </div>
      {showValue ? (
        <span className="w-10 text-right text-sm font-semibold text-brand-ink dark:text-white">
          {safeValue}
        </span>
      ) : null}
    </div>
  );
}

