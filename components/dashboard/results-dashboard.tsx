"use client";

import {
  AlertCircle,
  Download,
  Flag,
  LayoutPanelTop,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { BulletImprovementCard } from "@/components/dashboard/bullet-improvement-card";
import { CategoryGrid } from "@/components/dashboard/category-grid";
import { CoachSummaryCard } from "@/components/dashboard/coach-summary-card";
import { FeedbackListCard } from "@/components/dashboard/feedback-list-card";
import { JobMatchCard } from "@/components/dashboard/job-match-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScoreRing } from "@/components/ui/score-ring";
import type { AnalyzeResumeResponse } from "@/lib/validators/analysis";

interface ResultsDashboardProps {
  response: AnalyzeResumeResponse;
}

function formatScoreLabel(score: number) {
  if (score >= 85) {
    return "Strong";
  }

  if (score >= 70) {
    return "Promising";
  }

  return "Needs work";
}

export function ResultsDashboard({ response }: ResultsDashboardProps) {
  const [isExporting, setIsExporting] = useState(false);
  const hasJobDescription =
    response.result.jobMatchAnalysis.matchedKeywords.length > 0 ||
    response.result.jobMatchAnalysis.missingKeywords.length > 0 ||
    response.result.jobMatchAnalysis.fitSummary !==
      "No job description provided; role-fit was not evaluated.";

  const copyResumeText = async () => {
    if (!response.resumeTextUsed) {
      return;
    }

    await navigator.clipboard.writeText(response.resumeTextUsed);
    toast.success("Extracted resume text copied.");
  };

  const exportPdf = async () => {
    try {
      setIsExporting(true);
      const exportResponse = await fetch("/api/export-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fileName: response.source.fileName ?? "resume-review",
          createdAt: new Date().toISOString(),
          analysis: response.result
        })
      });

      if (!exportResponse.ok) {
        const body = await exportResponse.json().catch(() => null);
        throw new Error(body?.error || "Unable to export the PDF report.");
      }

      const blob = await exportResponse.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${(response.source.fileName ?? "resume-review").replace(/\.[^.]+$/, "")}-analysis.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      toast.success("PDF report downloaded.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to export the PDF report."
      );
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-5 xl:grid-cols-[1.2fr_1fr]">
        <Card className="overflow-hidden p-6 lg:p-8">
          <div className="grid gap-8 lg:grid-cols-[200px_1fr] lg:items-center">
            <div className="flex justify-center">
              <ScoreRing score={response.result.overallScore} />
            </div>

            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <Badge tone="info">{formatScoreLabel(response.result.overallScore)}</Badge>
                <Badge tone="default">
                  {response.source.type === "file"
                    ? response.source.fileName ?? "Uploaded file"
                    : "Pasted resume text"}
                </Badge>
                {response.warning ? <Badge tone="warning">Fallback used</Badge> : null}
              </div>
              <div>
                <h2 className="text-3xl sm:text-4xl">Analysis complete</h2>
                <p className="mt-3 text-balance">{response.result.summary}</p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  type="button"
                  variant="outline"
                  icon={<Download className="size-4" />}
                  onClick={exportPdf}
                  disabled={isExporting}
                >
                  {isExporting ? "Preparing PDF..." : "Download PDF"}
                </Button>
                <div className="rounded-full border border-border bg-white/70 px-4 py-2 text-sm font-semibold text-brand-ink dark:bg-white/5 dark:text-white">
                  Transparent scoring weights applied server-side
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-brand-sand text-brand-ink dark:bg-white/10 dark:text-white">
              <Target className="size-5" />
            </div>
            <div>
              <h3 className="text-2xl">Final recommendations</h3>
              <p>Start here for the highest-impact edits.</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {response.result.finalRecommendations.map((item) => (
              <div key={item} className="flex gap-3">
                <span className="mt-2 size-2 shrink-0 rounded-full bg-brand-teal" />
                <p className="text-sm leading-6">{item}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <CategoryGrid response={response} />

      <div className="grid gap-5 xl:grid-cols-2">
        <CoachSummaryCard
          title="What this resume is good at"
          description="A quick recruiter-style summary of the strongest parts of the resume right now."
          icon={<Trophy className="size-5" />}
          tone="teal"
          highlights={response.result.strengths.slice(0, 4)}
        />
        <CoachSummaryCard
          title="What to improve to make it better"
          description="The highest-impact improvements to make before sending this resume out."
          icon={<Target className="size-5" />}
          tone="amber"
          highlights={response.result.weaknesses.slice(0, 3)}
          suggestions={response.result.finalRecommendations.slice(0, 4)}
        />
      </div>

      {response.resumeTextUsed ? (
        <Card className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <h3 className="text-2xl">Resume text used for analysis</h3>
              <p>
                This is the exact text the parser extracted from your uploaded file,
                or the manual fallback text if parsing failed.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={copyResumeText}
            >
              Copy text
            </Button>
          </div>

          <div className="mt-6 overflow-hidden rounded-3xl border border-border/80 bg-slate-950/95 p-5">
            <pre className="max-h-[420px] overflow-auto whitespace-pre-wrap font-mono text-sm leading-7 text-slate-100">
              {response.resumeTextUsed}
            </pre>
          </div>
        </Card>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-2">
        <FeedbackListCard
          title="What is already working"
          description="These are the strongest signals a recruiter or hiring manager is likely to notice."
          items={response.result.strengths}
          icon={<Trophy className="size-5" />}
          tone="teal"
        />
        <FeedbackListCard
          title="What needs attention"
          description="These weaknesses are holding the resume back the most right now."
          items={response.result.weaknesses}
          icon={<AlertCircle className="size-5" />}
          tone="rose"
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <FeedbackListCard
          title="Missing sections"
          description="Important sections or signals the resume could add or strengthen."
          items={response.result.missingSections}
          icon={<Flag className="size-5" />}
          tone="amber"
        />
        <FeedbackListCard
          title="ATS issues"
          description="Potential issues that can affect machine parsing or keyword matching."
          items={response.result.atsIssues}
          icon={<ShieldCheck className="size-5" />}
          tone="amber"
        />
        <FeedbackListCard
          title="Keyword opportunities"
          description="High-signal terms to weave into the summary, skills, or experience bullets."
          items={response.result.keywordSuggestions}
          icon={<Sparkles className="size-5" />}
          tone="teal"
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <FeedbackListCard
          title="Formatting suggestions"
          description="Improvements that make the document easier to scan quickly."
          items={response.result.formattingSuggestions}
          icon={<LayoutPanelTop className="size-5" />}
          tone="teal"
        />
        <FeedbackListCard
          title="Grammar and style"
          description="Language-level improvements to make the resume sharper and more professional."
          items={response.result.grammarSuggestions}
          icon={<MessageSquareText className="size-5" />}
          tone="teal"
        />
      </div>

      {hasJobDescription ? <JobMatchCard response={response} /> : null}

      <Card className="p-6">
        <h3 className="text-2xl">Section-by-section feedback</h3>
        <p className="mt-2">
          Every major section gets an individual score and targeted suggestions.
        </p>

        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          {response.result.sectionFeedback.map((section) => (
            <div
              key={section.section}
              className="rounded-3xl border border-border/80 bg-white/60 p-5 dark:bg-white/5"
            >
              <div className="flex items-center justify-between gap-3">
                <h4 className="text-xl">{section.section}</h4>
                <Badge tone="info">{section.score}/100</Badge>
              </div>
              <p className="mt-4">{section.feedback}</p>
              <div className="mt-4 space-y-3">
                {section.suggestions.map((suggestion) => (
                  <div key={suggestion} className="flex gap-3">
                    <span className="mt-2 size-2 shrink-0 rounded-full bg-brand-gold" />
                    <p className="text-sm leading-6">{suggestion}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <BulletImprovementCard response={response} />
    </div>
  );
}
