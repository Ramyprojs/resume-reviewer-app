import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";

interface FeedbackListCardProps {
  title: string;
  description: string;
  items: string[];
  icon: ReactNode;
  tone?: "teal" | "amber" | "rose";
}

const toneMap = {
  teal: "bg-cyan-500",
  amber: "bg-amber-500",
  rose: "bg-rose-500"
} as const;

export function FeedbackListCard({
  title,
  description,
  items,
  icon,
  tone = "teal"
}: FeedbackListCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-brand-sand text-brand-ink dark:bg-white/10 dark:text-white">
          {icon}
        </div>
        <div className="space-y-1">
          <h3 className="text-xl">{title}</h3>
          <p>{description}</p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {items.length ? (
          items.map((item) => (
            <div key={item} className="flex gap-3">
              <span
                className={`mt-2 size-2 shrink-0 rounded-full ${toneMap[tone]}`}
              />
              <p className="text-sm leading-6">{item}</p>
            </div>
          ))
        ) : (
          <p className="text-sm">No issues flagged in this category.</p>
        )}
      </div>
    </Card>
  );
}

