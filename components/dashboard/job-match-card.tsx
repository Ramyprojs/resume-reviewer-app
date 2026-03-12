import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { AnalyzeResumeResponse } from "@/lib/validators/analysis";

interface JobMatchCardProps {
  response: AnalyzeResumeResponse;
}

export function JobMatchCard({ response }: JobMatchCardProps) {
  const { matchedKeywords, missingKeywords, fitSummary } =
    response.result.jobMatchAnalysis;

  return (
    <Card className="p-6">
      <div className="space-y-2">
        <h3 className="text-2xl">Job Match and Keyword Coverage</h3>
        <p>{fitSummary}</p>
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

