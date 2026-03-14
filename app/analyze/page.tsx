import { AnalyzerForm } from "@/components/forms/analyzer-form";
import { SectionHeading } from "@/components/ui/section-heading";

export default function AnalyzePage() {
  return (
    <div className="page-shell mx-auto w-full max-w-7xl px-6 py-14 md:px-10 lg:py-16">
      <div className="space-y-10">
        <SectionHeading
          eyebrow="Analyzer"
          title="Upload, compare, and improve"
          description="A portfolio-quality review flow with resume parsing, structured AI analysis, and recruiter-style feedback that you can export or revisit later."
          actions={
            <div className="hidden flex-wrap gap-3 lg:flex">
              <div className="data-pill">Grounded source text preview</div>
              <div className="data-pill">Tailored job-match mode</div>
            </div>
          }
        />
        <AnalyzerForm />
      </div>
    </div>
  );
}
