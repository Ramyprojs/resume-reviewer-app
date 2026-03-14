import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import type { AnalyzeResumeResponse } from "@/lib/validators/analysis";

interface JobMatchCardProps {
  response: AnalyzeResumeResponse;
}

export function JobMatchCard({ response }: JobMatchCardProps) {
  const { matchedKeywords, missingKeywords, fitSummary } =
    response.result.jobMatchAnalysis;
  const totalKeywords = matchedKeywords.length + missingKeywords.length;
  const coverage = totalKeywords
    ? Math.round((matchedKeywords.length / totalKeywords) * 100)
    : 0;

  return (
    <Card className="hover-lift p-6 lg:p-7">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-teal">
          Job alignment
        </p>
        <h3 className="text-2xl">Job Match and Keyword Coverage</h3>
        <p>{fitSummary}</p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-border/80 bg-white/60 p-4 dark:bg-white/5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Fit score
          </p>
          <p className="mt-2 text-2xl font-semibold text-brand-ink dark:text-white">
            {response.result.categoryScores.jobMatch}/100
          </p>
        </div>
        <div className="rounded-3xl border border-border/80 bg-white/60 p-4 dark:bg-white/5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Matched keywords
          </p>
          <p className="mt-2 text-2xl font-semibold text-brand-ink dark:text-white">
            {matchedKeywords.length}
          </p>
        </div>
        <div className="rounded-3xl border border-border/80 bg-white/60 p-4 dark:bg-white/5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Coverage rate
          </p>
          <p className="mt-2 text-2xl font-semibold text-brand-ink dark:text-white">
            {coverage}%
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-3xl border border-border/80 bg-white/60 p-4 dark:bg-white/5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="font-semibold text-brand-ink dark:text-white">
            Keyword coverage
          </p>
          <span className="text-sm font-semibold text-brand-ink dark:text-white">
            {coverage}%
          </span>
        </div>
        <ProgressBar value={coverage} showValue={false} />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-teal">
            Matched keywords
          </p>
          <div className="flex flex-wrap gap-2">
            {matchedKeywords.length ? (
              matchedKeywords.map((keyword) => (
                <Badge key={keyword} tone="success">
                  {keyword}
                </Badge>
              ))
            ) : (
              <p className="text-sm">No job description keywords were matched.</p>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-600 dark:text-amber-200">
            Missing keywords
          </p>
          <div className="flex flex-wrap gap-2">
            {missingKeywords.length ? (
              missingKeywords.map((keyword) => (
                <Badge key={keyword} tone="warning">
                  {keyword}
                </Badge>
              ))
            ) : (
              <p className="text-sm">
                No high-priority keyword gaps were identified.
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
