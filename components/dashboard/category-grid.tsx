import { BarChart3, Briefcase, FileText, PenLine, ScanSearch, Wrench } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import type { AnalyzeResumeResponse } from "@/lib/validators/analysis";

const categoryConfig = [
  {
    key: "content",
    label: "Content quality",
    icon: FileText
  },
  {
    key: "experience",
    label: "Experience impact",
    icon: Briefcase
  },
  {
    key: "ats",
    label: "ATS compatibility",
    icon: ScanSearch
  },
  {
    key: "skills",
    label: "Skills relevance",
    icon: Wrench
  },
  {
    key: "formatting",
    label: "Formatting",
    icon: BarChart3
  },
  {
    key: "grammar",
    label: "Grammar and style",
    icon: PenLine
  },
  {
    key: "jobMatch",
    label: "Job match",
    icon: ScanSearch
  }
] as const;

interface CategoryGridProps {
  response: AnalyzeResumeResponse;
}

export function CategoryGrid({ response }: CategoryGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {categoryConfig.map(({ key, label, icon: Icon }) => (
        <Card key={key} className="p-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-brand-sand text-brand-ink dark:bg-white/10 dark:text-white">
                <Icon className="size-5" />
              </div>
              <div>
                <p className="font-semibold text-brand-ink dark:text-white">
                  {label}
                </p>
                <p className="text-sm">
                  Weighted at {Math.round(response.weights[key] * 100)}%
                </p>
              </div>
            </div>
            <Badge tone="info">
              {response.result.categoryScores[key]}
            </Badge>
          </div>
          <div className="mt-5">
            <ProgressBar value={response.result.categoryScores[key]} />
          </div>
        </Card>
      ))}
    </div>
  );
}
