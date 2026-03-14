import { FileText, LayoutDashboard, ScanSearch, Sparkles, Target } from "lucide-react";

import { Card } from "@/components/ui/card";

interface ResultsJumpNavProps {
  hasJobDescription: boolean;
  hasResumeText: boolean;
}

const baseSections = [
  {
    id: "overview",
    label: "Overview",
    icon: LayoutDashboard
  },
  {
    id: "priorities",
    label: "Priorities",
    icon: Target
  },
  {
    id: "scores",
    label: "Scores",
    icon: ScanSearch
  },
  {
    id: "rewrites",
    label: "Rewrites",
    icon: Sparkles
  }
] as const;

export function ResultsJumpNav({
  hasJobDescription,
  hasResumeText
}: ResultsJumpNavProps) {
  const sections = [
    ...baseSections,
    ...(hasJobDescription
      ? [
          {
            id: "job-match",
            label: "Job match",
            icon: ScanSearch
          }
        ]
      : []),
    ...(hasResumeText
      ? [
          {
            id: "source-text",
            label: "Source text",
            icon: FileText
          }
        ]
      : [])
  ];

  return (
    <Card className="sticky top-24 z-20 p-3">
      <div className="flex flex-wrap gap-2">
        {sections.map(({ id, label, icon: Icon }) => (
          <a
            key={id}
            href={`#${id}`}
            data-click-reactive="true"
            className="click-reactive data-pill hover-lift px-3 py-2 text-xs uppercase tracking-[0.18em] text-muted-foreground dark:text-slate-100"
          >
            <Icon className="size-3.5" />
            {label}
          </a>
        ))}
      </div>
    </Card>
  );
}
