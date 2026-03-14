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

import { HeroPhraseSwitcher } from "@/components/effects/hero-phrase-switcher";
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

const heroPhrases = [
  "ATS-safe resumes",
  "sharper bullet points",
  "job-matched applications",
  "stronger first impressions"
];

export default function HomePage() {
  return (
    <div className="page-shell pb-16">
      <section className="mx-auto grid w-full max-w-7xl gap-12 px-6 py-16 md:px-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start lg:py-24 xl:grid-cols-[minmax(0,1fr)_440px]">
        <div className="space-y-8 reveal-up">
          <div className="flex flex-wrap gap-3">
            <Badge tone="info">Next.js + TypeScript</Badge>
            <Badge tone="success">Gemini JSON output</Badge>
            <Badge tone="default">PDF and DOCX parsing</Badge>
          </div>

          <div className="space-y-5">
            <h1 className="max-w-[12ch] text-balance text-5xl sm:text-6xl lg:text-[4.35rem] lg:leading-[1.02]">
              <span className="block">AI Resume Reviewer for</span>
              <span className="mt-3 block">
                <HeroPhraseSwitcher phrases={heroPhrases} className="max-w-full" />
              </span>
            </h1>
            <p className="max-w-xl text-balance text-lg">
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

          <Card className="max-w-3xl p-3 sm:p-4">
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { value: "100", label: "Point scoring system" },
                { value: "JSON", label: "Strict structured output" },
                { value: "PDF", label: "Exportable report" }
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-[1.4rem] border border-white/50 bg-white/48 px-4 py-4 dark:border-white/8 dark:bg-white/5"
                >
                  <p className="text-3xl font-bold text-brand-ink dark:text-white">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm leading-6">{stat.label}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="hero-panel reveal-up-delay-1 relative overflow-hidden p-6 lg:ml-auto lg:w-full lg:max-w-[420px] lg:p-7 xl:max-w-[440px]">
          <div className="absolute inset-0 grid-overlay opacity-[0.16]" />
          <div className="relative space-y-5">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-teal">
                Dashboard preview
              </p>
              <h2 className="max-w-sm text-balance text-[2rem] leading-tight">
                Analysis snapshot
              </h2>
              <p className="max-w-sm text-sm leading-6">
                A compact view of score, recruiter takeaway, and the most important
                improvement signals.
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-white/55 bg-white/44 p-5 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/5">
              <div className="grid gap-5 sm:grid-cols-[116px_1fr] sm:items-center">
                <div className="flex justify-center sm:justify-start">
                  <ScoreRing score={84} size={116} label="Overall" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-2xl bg-brand-sand text-brand-ink dark:bg-white/10 dark:text-white">
                      <FileText className="size-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-teal">
                        Recruiter takeaway
                      </p>
                      <p className="mt-2 text-sm leading-6 text-brand-ink dark:text-white">
                        Strong technical base and clear structure, with the biggest
                        lift coming from sharper metrics and tighter role targeting.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full border border-emerald-200/70 bg-emerald-50/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-200">
                      Clear structure
                    </span>
                    <span className="rounded-full border border-amber-200/70 bg-amber-50/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-700 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-200">
                      Needs stronger metrics
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 border-t border-white/45 pt-4 dark:border-white/10">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Core score breakdown
                  </p>
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    weighted
                  </span>
                </div>

                <div className="space-y-3">
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
                          {value}
                        </span>
                      </div>
                      <ProgressBar value={Number(value)} showValue={false} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-10 md:px-10">
        <SectionHeading
          eyebrow="Why it stands out"
          title="Built like a real product"
          description="The app keeps the experience simple on the surface while handling parsing, scoring, validation, and structured AI feedback behind the scenes."
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
          description="Upload a resume, optionally add a target role, and get back a review that feels focused rather than noisy."
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
          description="Every review stays grounded in the resume itself and focuses on the signals recruiters and ATS systems actually care about."
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
