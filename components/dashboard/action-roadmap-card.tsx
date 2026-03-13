import { ArrowUpRight, CheckCircle2, Sparkles, Target } from "lucide-react";

import { Card } from "@/components/ui/card";
import type { AnalyzeResumeResponse } from "@/lib/validators/analysis";

interface ActionRoadmapCardProps {
  response: AnalyzeResumeResponse;
}

function dedupe(items: string[]) {
  return Array.from(new Set(items.map((item) => item.trim()).filter(Boolean)));
}

export function ActionRoadmapCard({ response }: ActionRoadmapCardProps) {
  const immediate = dedupe([
    ...response.result.finalRecommendations.slice(0, 2),
    ...response.result.weaknesses.slice(0, 2)
  ]).slice(0, 4);

  const strengthen = dedupe([
    ...response.result.missingSections.slice(0, 2),
    ...response.result.keywordSuggestions.slice(0, 2),
    ...response.result.sectionFeedback.flatMap((section) => section.suggestions).slice(0, 2)
  ]).slice(0, 4);

  const polish = dedupe([
    ...response.result.formattingSuggestions.slice(0, 2),
    ...response.result.grammarSuggestions.slice(0, 2)
  ]).slice(0, 4);

  const phases = [
    {
      title: "Fix before sending",
      description: "Highest-impact changes that should happen before the resume goes out.",
      items: immediate,
      icon: Target,
      tone: "text-rose-500"
    },
    {
      title: "Strengthen your pitch",
      description: "Add missing signals that improve fit, substance, and recruiter confidence.",
      items: strengthen,
      icon: ArrowUpRight,
      tone: "text-brand-teal"
    },
    {
      title: "Polish the finish",
      description: "Small language and presentation refinements that elevate quality.",
      items: polish,
      icon: Sparkles,
      tone: "text-amber-500"
    }
  ] as const;

  return (
    <Card className="hover-lift p-6 lg:p-7">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-teal">
          Improvement roadmap
        </p>
        <h3 className="text-2xl">What to do next, in order</h3>
        <p className="max-w-3xl">
          Instead of a flat list of tips, this roadmap groups the feedback into a
          practical order so the resume gets better faster.
        </p>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        {phases.map(({ title, description, items, icon: Icon, tone }) => (
          <div
            key={title}
            className="rounded-[1.75rem] border border-border/80 bg-white/60 p-5 dark:bg-white/5"
          >
            <div className="flex items-start gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-brand-sand text-brand-ink dark:bg-white/10 dark:text-white">
                <Icon className={`size-5 ${tone}`} />
              </div>
              <div>
                <h4 className="text-xl">{title}</h4>
                <p className="mt-2 text-sm">{description}</p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {items.length ? (
                items.map((item) => (
                  <div key={item} className="flex gap-3">
                    <CheckCircle2 className={`mt-1 size-4 shrink-0 ${tone}`} />
                    <p className="text-sm leading-6">{item}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm">
                  No additional actions were prioritized in this stage.
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
