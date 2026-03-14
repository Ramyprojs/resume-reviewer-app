import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  FileText,
  FileSearch2,
  ScanSearch,
  Sparkles,
  Wand2
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { ScoreRing } from "@/components/ui/score-ring";
import { SectionHeading } from "@/components/ui/section-heading";

const featureCards = [
  {
    title: "Structured AI review",
    description:
      "Strict JSON output with strengths, weaknesses, missing sections, and actionable rewrite suggestions.",
    icon: Sparkles
  },
  {
    title: "ATS and recruiter lens",
    description:
      "Scores machine readability, formatting clarity, keyword coverage, and role relevance in one pass.",
    icon: ScanSearch
  },
  {
    title: "Portfolio-quality UI",
    description:
      "Built as a polished SaaS-style experience with loading states, local history, dark mode, and PDF export.",
    icon: BarChart3
  }
];

const steps = [
  "Upload a PDF or DOCX resume, or paste the text manually.",
  "Add a target job description to unlock fit scoring and missing keyword detection.",
  "Review a weighted score dashboard, AI explanations, and targeted bullet rewrites."
];

const evaluationAreas = [
  "Contact completeness and professionalism",
  "Experience impact and measurable outcomes",
  "ATS readability and machine parsing safety",
  "Keyword alignment to the target role",
  "Grammar, clarity, and formatting polish",
  "Section-by-section rewrite suggestions"
];

export default function HomePage() {
  return (
    <div className="page-shell pb-16">
      <section className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-16 md:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24">
        <div className="space-y-8 reveal-up">
          <div className="flex flex-wrap gap-3">
            <Badge tone="info">Next.js + TypeScript</Badge>
            <Badge tone="success">Gemini JSON output</Badge>
            <Badge tone="default">PDF and DOCX parsing</Badge>
          </div>

          <div className="space-y-5">
            <h1 className="max-w-4xl text-balance text-5xl sm:text-6xl lg:text-7xl">
              AI Resume Reviewer for polished, recruiter-ready resumes
            </h1>
            <p className="max-w-2xl text-balance text-lg">
              A production-style web app that uploads resumes, extracts text from PDF
              or DOCX files, scores resume quality, checks ATS friendliness, and
              delivers structured improvement feedback in a clean dashboard.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/analyze">
              <Button size="lg" icon={<ArrowRight className="size-4" />}>
                Start analyzing
              </Button>
            </Link>
            <Link href="/history">
              <Button size="lg" variant="outline">
                View saved analyses
              </Button>
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { value: "100", label: "Point scoring system" },
              { value: "JSON", label: "Strict structured AI output" },
              { value: "PDF", label: "Exportable feedback report" }
            ].map((stat) => (
              <Card key={stat.label} className="hover-lift p-5">
                <p className="text-3xl font-bold text-brand-ink dark:text-white">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm">{stat.label}</p>
              </Card>
            ))}
          </div>
        </div>

        <Card className="hero-panel reveal-up-delay-1 relative overflow-hidden p-6 lg:p-8">
          <div className="absolute inset-0 grid-overlay opacity-35" />
          <div className="relative space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-md space-y-3">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-teal">
                  Dashboard preview
                </p>
                <h2 className="max-w-sm text-balance text-2xl sm:text-3xl">
                  A cleaner review snapshot recruiters can scan quickly
                </h2>
                <p className="max-w-md text-sm leading-6">
                  The analyzer turns a resume into a concise summary, clear score
                  breakdown, and focused next steps without overwhelming the user.
                </p>
              </div>
              <Badge tone="success" className="shrink-0">
                Preview
              </Badge>
            </div>

            <div className="grid gap-4 lg:grid-cols-[140px_1fr] lg:items-start">
              <div className="flex justify-center lg:justify-start">
                <ScoreRing score={84} size={128} label="Overall" />
              </div>

              <div className="space-y-4">
                <div className="rounded-[1.75rem] border border-white/60 bg-white/55 p-5 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/5">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-2xl bg-brand-sand text-brand-ink dark:bg-white/10 dark:text-white">
                      <FileText className="size-5" />
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-teal">
                          Recruiter takeaway
                        </p>
                        <p className="mt-2 max-w-lg text-base leading-7 text-brand-ink dark:text-white">
                          Strong profile with visible technical depth and clear
                          experience, but the final score still depends on sharper
                          metrics, stronger ATS phrasing, and tighter role alignment.
                        </p>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl border border-white/55 bg-white/55 px-4 py-3 dark:border-white/10 dark:bg-slate-950/40">
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600 dark:text-emerald-300">
                            What is working
                          </p>
                          <p className="mt-2 text-sm leading-6">
                            Clear structure, visible impact, and strong core skills
                            coverage for screening.
                          </p>
                        </div>
                        <div className="rounded-2xl border border-white/55 bg-white/55 px-4 py-3 dark:border-white/10 dark:bg-slate-950/40">
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-600 dark:text-amber-300">
                            What to improve
                          </p>
                          <p className="mt-2 text-sm leading-6">
                            Add quantified results, tailor keywords to the role, and
                            tighten a few weaker bullets.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Card className="p-5">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-teal">
                        Score breakdown
                      </p>
                      <p className="mt-1 text-sm">
                        Weighted categories shown in one place for a faster read.
                      </p>
                    </div>
                    <span className="rounded-full border border-white/60 bg-white/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-brand-ink dark:border-white/10 dark:bg-white/5 dark:text-white">
                      Live scoring
                    </span>
                  </div>

                  <div className="space-y-4">
                    {[
                      ["Content", 86],
                      ["Experience", 85],
                      ["ATS", 82],
                      ["Job match", 81]
                    ].map(([label, value]) => (
                      <div key={label} className="space-y-2">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-brand-ink dark:text-white">
                            {label}
                          </p>
                          <span className="text-sm font-semibold text-brand-ink dark:text-white">
                            {value}/100
                          </span>
                        </div>
                        <ProgressBar value={Number(value)} showValue={false} />
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-10 md:px-10">
        <SectionHeading
          eyebrow="Why it stands out"
          title="Built like a real product, not a toy demo"
          description="Everything is designed to feel portfolio-ready: clean architecture, secure file handling, strict validation, and a polished interface that makes the AI feedback easy to trust and act on."
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {featureCards.map(({ title, description, icon: Icon }) => (
            <Card key={title} className="hover-lift p-6">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-brand-sand text-brand-ink dark:bg-white/10 dark:text-white">
                <Icon className="size-5" />
              </div>
              <h3 className="mt-5 text-2xl">{title}</h3>
              <p className="mt-3">{description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-10 md:px-10">
        <SectionHeading
          eyebrow="Workflow"
          title="Simple flow, high-signal output"
          description="The app is beginner-friendly to use, but the internals follow production patterns: backend parsing, prompt engineering, deterministic score weights, and strict schema validation."
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {steps.map((step, index) => (
            <Card key={step} className="hover-lift p-6">
              <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-brand-ink text-lg font-bold text-white dark:bg-brand-teal dark:text-slate-950">
                {index + 1}
              </div>
              <p className="mt-5 text-lg text-brand-ink dark:text-white">{step}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-10 md:px-10">
        <Card className="hero-panel hover-lift overflow-hidden p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div className="space-y-4">
              <Badge tone="success">Job match mode included</Badge>
              <h2 className="text-4xl">Tailor a resume to a target role in one pass</h2>
              <p className="max-w-2xl">
                Paste a job description to compare your current resume against the
                role, surface missing keywords, estimate fit, and get suggestions for
                how to tune your summary, skills, and experience bullets.
              </p>
              <Link href="/analyze">
                <Button size="lg" variant="secondary" icon={<Wand2 className="size-4" />}>
                  Open the analyzer
                </Button>
              </Link>
            </div>

            <div className="grid gap-4">
              {[
                {
                  title: "Matched keywords",
                  items: ["React", "Next.js", "TypeScript", "REST APIs"]
                },
                {
                  title: "Missing keywords",
                  items: ["Accessibility", "Experimentation", "Data visualization"]
                }
              ].map((group) => (
                <Card key={group.title} className="hover-lift p-5">
                  <div className="flex items-center gap-3">
                    {group.title === "Matched keywords" ? (
                      <CheckCircle2 className="size-5 text-emerald-500" />
                    ) : (
                      <FileSearch2 className="size-5 text-amber-500" />
                    )}
                    <h3 className="text-xl">{group.title}</h3>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <Badge
                        key={item}
                        tone={group.title === "Matched keywords" ? "success" : "warning"}
                      >
                        {item}
                      </Badge>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </Card>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-10 md:px-10">
        <SectionHeading
          eyebrow="Evaluation scope"
          title="What the reviewer actually checks"
          description="The analysis is structured to feel useful in the real world: not vague praise, but grounded checks across the signals recruiters and ATS systems actually care about."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {evaluationAreas.map((item) => (
            <Card key={item} className="hover-lift p-5">
              <div className="flex items-start gap-3">
                <div className="mt-1 size-2 rounded-full bg-brand-teal" />
                <p className="text-base text-brand-ink dark:text-white">{item}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
