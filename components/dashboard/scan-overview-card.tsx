import {
  AlertTriangle,
  BadgeCheck,
  BriefcaseBusiness,
  FileType2,
  Gauge,
  Sparkles
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { AnalyzeResumeResponse, CategoryScores } from "@/lib/validators/analysis";

interface ScanOverviewCardProps {
  response: AnalyzeResumeResponse;
}

const categoryLabels: Record<keyof CategoryScores, string> = {
  content: "Content quality",
  formatting: "Formatting",
  ats: "ATS compatibility",
  experience: "Experience impact",
  skills: "Skills relevance",
  grammar: "Grammar and style",
  jobMatch: "Job match"
};

function getScoredCategories(
  scores: CategoryScores,
  includeJobMatch: boolean
) {
  const entries = Object.entries(scores) as Array<[keyof CategoryScores, number]>;
  return entries.filter(([key]) => includeJobMatch || key !== "jobMatch");
}

export function ScanOverviewCard({ response }: ScanOverviewCardProps) {
  const hasJobDescription = response.weights.jobMatch > 0;
  const scoredCategories = getScoredCategories(
    response.result.categoryScores,
    hasJobDescription
  );
  const strongestCategory = scoredCategories.reduce((best, current) =>
    current[1] > best[1] ? current : best
  );
  const weakestCategory = scoredCategories.reduce((worst, current) =>
    current[1] < worst[1] ? current : worst
  );

  const overviewItems = [
    {
      label: "Analysis mode",
      value: response.warning ? "Grounded fallback" : "Gemini structured review",
      icon: response.warning ? AlertTriangle : Sparkles
    },
    {
      label: "Resume source",
      value:
        response.source.type === "file"
          ? response.source.fileName ?? "Uploaded file"
          : "Manual resume text",
      icon: FileType2
    },
    {
      label: "Target role",
      value: hasJobDescription ? "Job description included" : "General review only",
      icon: BriefcaseBusiness
    },
    {
      label: "Extracted text",
      value: `${response.parsing.extractedCharacters.toLocaleString()} characters`,
      icon: Gauge
    }
  ];

  return (
    <Card className="hover-lift p-6 lg:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-teal">
            Scan overview
          </p>
          <h3 className="text-2xl">Professional readout</h3>
          <p className="max-w-2xl">
            This panel summarizes how the review was generated, what the resume is
            signaling most strongly, and where the next upgrade should focus.
          </p>
        </div>
        <Badge tone={response.warning ? "warning" : "success"}>
          {response.warning ? "Fallback-backed" : "AI-backed"}
        </Badge>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {overviewItems.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-3xl border border-border/80 bg-white/60 p-4 dark:bg-white/5"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-brand-sand text-brand-ink dark:bg-white/10 dark:text-white">
                <Icon className="size-4" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {label}
                </p>
                <p className="mt-1 text-sm font-semibold text-brand-ink dark:text-white">
                  {value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-5">
          <div className="flex items-center gap-3">
            <BadgeCheck className="size-5 text-emerald-500" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-300">
                Strongest signal
              </p>
              <h4 className="mt-1 text-xl">
                {categoryLabels[strongestCategory[0]]} at {strongestCategory[1]}/100
              </h4>
            </div>
          </div>
          <p className="mt-3 text-sm">
            This is the area currently creating the best recruiter impression, so it
            is worth preserving while you revise weaker sections.
          </p>
        </div>

        <div className="rounded-3xl border border-amber-500/20 bg-amber-500/5 p-5">
          <div className="flex items-center gap-3">
            <AlertTriangle className="size-5 text-amber-500" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-600 dark:text-amber-300">
                Priority upgrade
              </p>
              <h4 className="mt-1 text-xl">
                {categoryLabels[weakestCategory[0]]} at {weakestCategory[1]}/100
              </h4>
            </div>
          </div>
          <p className="mt-3 text-sm">
            Improving this category first should produce the clearest jump in resume
            quality and overall score.
          </p>
        </div>
      </div>
    </Card>
  );
}
