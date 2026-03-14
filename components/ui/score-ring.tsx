import { cn } from "@/lib/utils/cn";

interface ScoreRingProps {
  score: number;
  size?: number;
  className?: string;
  label?: string;
}

export function ScoreRing({
  score,
  size = 152,
  className,
  label = "Overall score"
}: ScoreRingProps) {
  const safeScore = Math.max(0, Math.min(100, score));

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center rounded-full border border-white/40 bg-white/60 shadow-lg dark:border-white/10 dark:bg-white/5",
        className
      )}
      style={{
        width: size,
        height: size,
        backgroundImage: `conic-gradient(rgba(34,211,238,1) ${safeScore * 3.6}deg, rgba(226,232,240,0.9) 0deg)`
      }}
    >
      <div
        className="flex flex-col items-center justify-center rounded-full bg-card/95 text-center dark:bg-slate-950/95"
        style={{
          width: size - 22,
          height: size - 22
        }}
      >
        <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          {label}
        </span>
        <span className="mt-2 text-4xl font-bold text-brand-ink dark:text-white">
          {safeScore}
        </span>
        <span className="mt-1 text-sm text-muted-foreground">out of 100</span>
      </div>
    </div>
  );
}

