import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

type BadgeTone = "default" | "success" | "warning" | "info";

const toneClasses: Record<BadgeTone, string> = {
  default:
    "border-border/80 bg-white/82 text-brand-ink dark:bg-white/5 dark:text-white",
  success:
    "border-emerald-200/80 bg-emerald-50/80 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-200",
  warning:
    "border-amber-200/80 bg-amber-50/80 text-amber-700 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-200",
  info:
    "border-cyan-200/80 bg-cyan-50/80 text-sky-700 dark:border-cyan-400/20 dark:bg-cyan-500/10 dark:text-cyan-100"
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

export function Badge({
  className,
  tone = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]",
        toneClasses[tone],
        className
      )}
      {...props}
    />
  );
}
