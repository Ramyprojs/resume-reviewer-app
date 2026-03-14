import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-ink text-white shadow-[0_16px_40px_-24px_rgba(15,23,42,0.55)] transition hover:-translate-y-0.5 hover:bg-slate-900 active:translate-y-px dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100",
  secondary:
    "border border-brand-teal/20 bg-brand-teal/12 text-brand-ink shadow-[0_14px_34px_-24px_rgba(14,165,233,0.35)] transition hover:-translate-y-0.5 hover:border-brand-teal/30 hover:bg-brand-teal/16 active:translate-y-px dark:bg-brand-teal/16 dark:text-white dark:hover:bg-brand-teal/22",
  ghost:
    "bg-transparent text-brand-ink transition hover:bg-brand-sand/80 active:translate-y-px dark:text-white dark:hover:bg-white/6",
  outline:
    "border border-border bg-card/70 text-brand-ink transition hover:border-brand-teal/35 hover:bg-brand-sand/60 active:translate-y-px dark:text-white dark:hover:bg-white/6"
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-[15px]"
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  icon,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "click-reactive relative inline-flex items-center justify-center gap-2 rounded-full font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal disabled:cursor-not-allowed disabled:opacity-60",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      data-click-reactive="true"
      {...props}
    >
      {icon ? <span className="shrink-0">{icon}</span> : null}
      {children}
    </button>
  );
}
