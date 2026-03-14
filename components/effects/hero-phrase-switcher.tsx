"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils/cn";

interface HeroPhraseSwitcherProps {
  phrases: string[];
  className?: string;
  intervalMs?: number;
}

export function HeroPhraseSwitcher({
  phrases,
  className,
  intervalMs = 2600
}: HeroPhraseSwitcherProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (phrases.length <= 1) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let isMounted = true;
    let swapTimer = 0;

    const cycleTimer = window.setInterval(() => {
      setIsVisible(false);

      swapTimer = window.setTimeout(() => {
        if (!isMounted) {
          return;
        }

        setActiveIndex((current) => (current + 1) % phrases.length);
        setIsVisible(true);
      }, 230);
    }, intervalMs);

    return () => {
      isMounted = false;
      window.clearInterval(cycleTimer);
      window.clearTimeout(swapTimer);
    };
  }, [phrases, intervalMs]);

  return (
    <span
      className={cn(
        "relative grid min-h-[2.15em] w-full max-w-[10.5ch] leading-[0.94] sm:min-h-[2.05em] sm:max-w-[11ch]",
        className
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none col-start-1 row-start-1 text-brand-teal/20 blur-2xl transition-all duration-300 ease-out dark:text-cyan-300/18",
          isVisible ? "opacity-100" : "opacity-0"
        )}
        style={{ textShadow: "0 0 36px rgba(34, 211, 238, 0.28)" }}
      >
        {phrases[activeIndex]}
      </span>
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none col-start-1 row-start-1 text-cyan-300/35 blur-md transition-all duration-300 ease-out dark:text-cyan-200/25",
          isVisible ? "opacity-100" : "opacity-0"
        )}
      >
        {phrases[activeIndex]}
      </span>
      <span
        className={cn(
          "relative col-start-1 row-start-1 text-brand-ink transition-all duration-300 ease-out dark:text-white",
          isVisible ? "translate-y-0 blur-0 opacity-100" : "translate-y-2 blur-sm opacity-0"
        )}
      >
        {phrases[activeIndex]}
      </span>
    </span>
  );
}
