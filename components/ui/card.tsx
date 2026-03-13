import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "surface-panel surface-gradient mesh-overlay transition-[transform,box-shadow,border-color,background-color] duration-300",
        className
      )}
      {...props}
    />
  );
}
