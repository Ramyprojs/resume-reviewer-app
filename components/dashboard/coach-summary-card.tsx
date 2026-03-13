import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";

interface CoachSummaryCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  tone?: "teal" | "amber";
  highlights: string[];
  suggestions?: string[];
}

const toneClasses = {
  teal: {
    dot: "bg-cyan-500",
    label: "text-brand-teal"
  },
  amber: {
    dot: "bg-amber-500",
    label: "text-amber-500 dark:text-amber-200"
  }
} as const;

export function CoachSummaryCard({
  title,
  description,
  icon,
  tone = "teal",
  highlights,
  suggestions = []
}: CoachSummaryCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-brand-sand text-brand-ink dark:bg-white/10 dark:text-white">
          {icon}
        </div>
        <div className="space-y-1">
          <h3 className="text-2xl">{title}</h3>
          <p>{description}</p>
        </div>
      </div>

      <div className="mt-6">
        <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${toneClasses[tone].label}`}>
          Summary
        </p>
        <div className="mt-4 space-y-4">
          {highlights.map((item) => (
            <div key={item} className="flex gap-3">
              <span className={`mt-2 size-2 shrink-0 rounded-full ${toneClasses[tone].dot}`} />
              <p className="text-sm leading-6">{item}</p>
            </div>
          ))}
        </div>
      </div>

      {suggestions.length ? (
        <div className="mt-8">
          <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${toneClasses[tone].label}`}>
            Suggestions
          </p>
          <div className="mt-4 space-y-4">
            {suggestions.map((item) => (
              <div key={item} className="flex gap-3">
                <span className={`mt-2 size-2 shrink-0 rounded-full ${toneClasses[tone].dot}`} />
                <p className="text-sm leading-6">{item}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </Card>
  );
}
