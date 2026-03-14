"use client";

import { ClipboardCopy, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { AnalyzeResumeResponse } from "@/lib/validators/analysis";

interface BulletImprovementCardProps {
  response: AnalyzeResumeResponse;
}

export function BulletImprovementCard({
  response
}: BulletImprovementCardProps) {
  const rewrites = response.result.bulletPointImprovements;

  const copyAll = async () => {
    const text = rewrites
      .map(
        (item) =>
          `Original: ${item.original}\nImproved: ${item.improved}\nReason: ${item.reason}`
      )
      .join("\n\n");

    await navigator.clipboard.writeText(text);
    toast.success("Improved bullet points copied.");
  };

  const copyOne = async (value: string) => {
    await navigator.clipboard.writeText(value);
    toast.success("Rewritten bullet copied.");
  };

  return (
    <Card className="hover-lift p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <h3 className="text-2xl">Suggested Bullet Point Rewrites</h3>
          <p>
            These examples keep the original meaning but raise clarity, impact, and
            recruiter signal.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          icon={<ClipboardCopy className="size-4" />}
          onClick={copyAll}
        >
          Copy all rewrites
        </Button>
      </div>

      <div className="mt-6 space-y-4">
        {rewrites.length ? (
          rewrites.map((item, index) => (
            <details
              key={`${item.original}-${index}`}
              className="rounded-3xl border border-border/80 bg-white/60 p-5 transition-[transform,border-color,background-color] duration-300 hover:-translate-y-0.5 hover:border-brand-teal/30 dark:bg-white/5"
              open={index === 0}
            >
              <summary
                data-click-reactive="true"
                className="click-reactive cursor-pointer list-none rounded-2xl"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-2xl bg-brand-sand text-brand-ink dark:bg-white/10 dark:text-white">
                      <Sparkles className="size-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-teal">
                        Rewrite {index + 1}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Click to expand the original and improved version
                      </p>
                    </div>
                  </div>
                </div>
              </summary>

              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Original
                  </p>
                  <p className="mt-2 rounded-2xl bg-slate-100/80 p-4 text-sm text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                    {item.original}
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-teal">
                      Improved
                    </p>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      icon={<ClipboardCopy className="size-4" />}
                      onClick={() => copyOne(item.improved)}
                    >
                      Copy
                    </Button>
                  </div>
                  <p className="mt-2 rounded-2xl bg-cyan-50/80 p-4 text-sm text-slate-700 dark:bg-cyan-400/10 dark:text-slate-100">
                    {item.improved}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Why this works
                  </p>
                  <p className="mt-2 text-sm">{item.reason}</p>
                </div>
              </div>
            </details>
          ))
        ) : (
          <p className="text-sm">No bullet rewrites were generated.</p>
        )}
      </div>
    </Card>
  );
}
