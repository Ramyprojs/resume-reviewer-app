"use client";

import {
  AlertTriangle,
  CheckCircle2,
  LoaderCircle,
  Sparkles,
  Wand2
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { startTransition, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { ResultsDashboard } from "@/components/dashboard/results-dashboard";
import { FileDropzone } from "@/components/forms/dropzone";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { analyzeResumeResponseSchema, type AnalyzeResumeResponse } from "@/lib/validators/analysis";
import {
  getStoredHistoryEntry,
  saveStoredHistoryEntry
} from "@/lib/history/storage";
import {
  DEMO_JOB_DESCRIPTION,
  DEMO_RESUME_TEXT
} from "@/lib/utils/demo-content";

const loadingMessages = [
  "Extracting readable resume content",
  "Reviewing sections like a recruiter",
  "Checking ATS compatibility and keywords",
  "Drafting targeted improvement suggestions"
];

export function AnalyzerForm() {
  const searchParams = useSearchParams();
  const resultsRef = useRef<HTMLDivElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [tailorMode, setTailorMode] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progressIndex, setProgressIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [loadedFromHistory, setLoadedFromHistory] = useState<string | null>(null);
  const [response, setResponse] = useState<AnalyzeResumeResponse | null>(null);

  useEffect(() => {
    const historyId = searchParams.get("historyId");

    if (!historyId) {
      return;
    }

    const saved = getStoredHistoryEntry(historyId);

    if (!saved) {
      return;
    }

    const restoredResponse = analyzeResumeResponseSchema.parse({
      id: saved.id,
      source: {
        type: saved.sourceType,
        fileName: saved.fileName
      },
      parsing: {
        extractedCharacters: 0,
        detectedMimeType: undefined,
        usedFallbackText: Boolean(saved.warning)
      },
      warning: saved.warning,
      weights: saved.weights,
      result: saved.result
    });

    setLoadedFromHistory(saved.label);
    setWarning(saved.warning ?? null);
    setResponse(restoredResponse);
  }, [searchParams]);

  useEffect(() => {
    if (!response) {
      return;
    }

    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [response]);

  useEffect(() => {
    if (!isLoading) {
      setProgressIndex(0);
      return;
    }

    const timer = window.setInterval(() => {
      setProgressIndex((current) => (current + 1) % loadingMessages.length);
    }, 1300);

    return () => window.clearInterval(timer);
  }, [isLoading]);

  const handleAnalyze = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedFile && !resumeText.trim()) {
      setError("Upload a resume file or paste your resume text before analyzing.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setWarning(null);
    setLoadedFromHistory(null);

    try {
      const formData = new FormData();

      if (selectedFile) {
        formData.append("resumeFile", selectedFile);
      } else {
        formData.append("resumeText", resumeText);
      }

      formData.append("jobDescription", jobDescription);
      formData.append("tailorMode", String(tailorMode));
      formData.append("demoMode", String(demoMode));

      const request = await fetch("/api/analyze-resume", {
        method: "POST",
        body: formData
      });

      const body = await request.json().catch(() => null);

      if (!request.ok) {
        throw new Error(body?.error || "Resume analysis failed.");
      }

      const parsedResponse = analyzeResumeResponseSchema.parse(body);

      startTransition(() => {
        setResponse(parsedResponse);
      });

      setWarning(parsedResponse.warning ?? null);

      saveStoredHistoryEntry({
        id: parsedResponse.id,
        createdAt: new Date().toISOString(),
        label:
          selectedFile?.name.replace(/\.[^.]+$/, "") ||
          (demoMode ? "Demo resume analysis" : "Manual resume scan"),
        fileName: parsedResponse.source.fileName ?? "Pasted resume",
        sourceType: parsedResponse.source.type,
        hasJobDescription: Boolean(jobDescription.trim()),
        result: parsedResponse.result,
        weights: parsedResponse.weights,
        warning: parsedResponse.warning
      });

      toast.success("Resume analysis complete.");
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Resume analysis failed.";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const loadDemo = () => {
    setSelectedFile(null);
    setResumeText(DEMO_RESUME_TEXT);
    setJobDescription(DEMO_JOB_DESCRIPTION);
    setTailorMode(true);
    setDemoMode(true);
    setError(null);
    setWarning(null);
    setLoadedFromHistory(null);
    toast.success("Demo resume loaded. Run the analyzer when you’re ready.");
  };

  const resetForm = () => {
    setSelectedFile(null);
    setResumeText("");
    setJobDescription("");
    setTailorMode(false);
    setDemoMode(false);
    setError(null);
    setWarning(null);
    setLoadedFromHistory(null);
    setResponse(null);
  };

  return (
    <div className="space-y-8">
      <Card className="grid gap-6 p-6 lg:grid-cols-[1.2fr_0.8fr] lg:p-8">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Badge tone="info">PDF + DOCX uploads</Badge>
            <Badge tone="default">Manual text fallback</Badge>
            <Badge tone="success">Local history included</Badge>
          </div>
          <h1 className="text-4xl sm:text-5xl">Analyze your resume like a modern hiring stack</h1>
          <p className="max-w-2xl text-balance">
            Upload a resume, optionally paste a target job description, and get a
            structured AI review with ATS feedback, category scores, rewrite
            suggestions, and a downloadable report.
          </p>
        </div>

        <Card className="grid-overlay p-6">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-teal">
              Built-in workflow
            </p>
            <div className="space-y-4">
              {[
                "Upload a PDF or DOCX resume",
                "Add a job description for tailored feedback",
                "Get weighted scoring, strengths, issues, and rewritten bullets"
              ].map((step) => (
                <div key={step} className="flex gap-3">
                  <CheckCircle2 className="mt-1 size-5 shrink-0 text-brand-teal" />
                  <p>{step}</p>
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="secondary"
              icon={<Sparkles className="size-4" />}
              onClick={loadDemo}
              className="mt-4 w-full"
            >
              Try demo mode
            </Button>
          </div>
        </Card>
      </Card>

      {loadedFromHistory ? (
        <Card className="border-brand-teal/30 p-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="size-5 text-brand-teal" />
            <p className="text-sm font-medium text-brand-ink dark:text-white">
              Loaded saved analysis: {loadedFromHistory}
            </p>
          </div>
        </Card>
      ) : null}

      {error ? (
        <Card className="border-rose-200 bg-rose-50/80 p-4 dark:border-rose-400/20 dark:bg-rose-400/10">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-rose-600 dark:text-rose-200" />
            <p className="text-sm font-medium text-rose-700 dark:text-rose-100">
              {error}
            </p>
          </div>
        </Card>
      ) : null}

      {warning ? (
        <Card className="border-amber-200 bg-amber-50/80 p-4 dark:border-amber-400/20 dark:bg-amber-400/10">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-200" />
            <p className="text-sm font-medium text-amber-700 dark:text-amber-100">
              {warning}
            </p>
          </div>
        </Card>
      ) : null}

      <form className="space-y-6" onSubmit={handleAnalyze}>
        <FileDropzone
          file={selectedFile}
          disabled={isLoading}
          onFileSelect={(file) => {
            setSelectedFile(file);
            if (
              file &&
              (demoMode ||
                resumeText.trim() === DEMO_RESUME_TEXT.trim() ||
                jobDescription.trim() === DEMO_JOB_DESCRIPTION.trim())
            ) {
              setResumeText("");
              setJobDescription("");
            }
            setResponse(null);
            setLoadedFromHistory(null);
            setWarning(null);
            setError(null);
            setDemoMode(false);
          }}
          onError={(message) => setError(message)}
        />

        <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
          <Card className="p-6">
            <div className="space-y-2">
              <h2 className="text-2xl">Manual resume text fallback</h2>
              <p>
                Paste your resume here if upload parsing fails, or use it instead of a
                file when testing quickly. If an uploaded PDF or DOCX parses
                successfully, that extracted file text is what the analyzer will use.
                Remove the file if you want to analyze the pasted text instead.
              </p>
            </div>
            <textarea
              value={resumeText}
              onChange={(event) => {
                setResumeText(event.target.value);
                setDemoMode(false);
              }}
              placeholder="Paste your resume text here..."
              className="mt-5 min-h-[280px] w-full rounded-3xl border border-border bg-white/80 p-5 text-sm text-brand-ink placeholder:text-muted-foreground dark:bg-white/5 dark:text-white"
            />
          </Card>

          <div className="space-y-6">
            <Card className="p-6">
              <div className="space-y-2">
                <h2 className="text-2xl">Target job description</h2>
                <p>
                  Optional, but highly recommended if you want fit scoring and keyword
                  gap analysis.
                </p>
              </div>
              <textarea
                value={jobDescription}
                onChange={(event) => {
                  setJobDescription(event.target.value);
                  setDemoMode(false);
                }}
                placeholder="Paste the target job description here..."
                className="mt-5 min-h-[220px] w-full rounded-3xl border border-border bg-white/80 p-5 text-sm text-brand-ink placeholder:text-muted-foreground dark:bg-white/5 dark:text-white"
              />

              <label className="mt-5 flex items-start gap-3 rounded-3xl border border-border bg-white/60 p-4 dark:bg-white/5">
                <input
                  type="checkbox"
                  checked={tailorMode}
                  onChange={(event) => setTailorMode(event.target.checked)}
                  className="mt-1 size-4 rounded border-border text-brand-teal focus:ring-brand-teal"
                />
                <div>
                  <p className="font-semibold text-brand-ink dark:text-white">
                    Tailor my resume to this job
                  </p>
                  <p className="text-sm">
                    The AI will bias suggestions toward the target role and show how to
                    tune your summary, skills, and experience bullets.
                  </p>
                </div>
              </label>
            </Card>

            <Card className="p-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-brand-sand text-brand-ink dark:bg-white/10 dark:text-white">
                    <Wand2 className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-xl">Ready to run</h3>
                    <p>
                      Your resume stays in memory for analysis only. History is stored
                      locally in your browser.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    type="submit"
                    size="lg"
                    className="flex-1"
                    icon={
                      isLoading ? (
                        <LoaderCircle className="size-4 animate-spin" />
                      ) : (
                        <Sparkles className="size-4" />
                      )
                    }
                    disabled={isLoading}
                  >
                    {isLoading ? "Analyzing resume..." : "Analyze resume"}
                  </Button>
                  <Button
                    type="button"
                    size="lg"
                    variant="outline"
                    onClick={resetForm}
                    disabled={isLoading}
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </form>

      {isLoading ? (
        <Card className="p-8">
          <div className="flex flex-col items-center text-center">
            <div className="flex size-16 items-center justify-center rounded-3xl bg-brand-ink text-white dark:bg-brand-teal dark:text-slate-950">
              <LoaderCircle className="size-7 animate-spin" />
            </div>
            <h2 className="mt-5 text-3xl">Review in progress</h2>
            <p className="mt-3 max-w-xl">
              {loadingMessages[progressIndex]}. This usually takes a few moments,
              depending on file size and model response time.
            </p>
            <div className="mt-6 h-2 w-full max-w-xl overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
              <div
                className="h-full w-2/3 animate-pulse rounded-full bg-[linear-gradient(90deg,rgba(34,211,238,1),rgba(245,158,11,0.95))]"
                style={{ transform: `translateX(${progressIndex * 18}px)` }}
              />
            </div>
          </div>
        </Card>
      ) : null}

      <div ref={resultsRef}>
        {response ? <ResultsDashboard response={response} /> : null}
      </div>
    </div>
  );
}
