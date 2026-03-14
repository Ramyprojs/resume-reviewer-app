import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border/80 bg-white/40 py-10 backdrop-blur dark:bg-slate-950/20">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 text-sm text-muted-foreground md:flex-row md:items-end md:justify-between md:px-10">
        <div className="space-y-2">
          <p className="font-semibold text-brand-ink dark:text-white">
            AI Resume Reviewer
          </p>
          <p>Portfolio-quality resume analysis with structured AI feedback.</p>
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="data-pill px-3 py-1.5 text-xs">Structured scoring</span>
            <span className="data-pill px-3 py-1.5 text-xs">Resume parsing</span>
            <span className="data-pill px-3 py-1.5 text-xs">PDF export</span>
          </div>
          <div className="pt-2">
            <p className="text-sm text-brand-ink dark:text-white">
              Made by Ramy Abdelmalak
            </p>
            <div className="mt-2 flex flex-wrap gap-4">
              <a
                href="https://www.linkedin.com/in/ramy-abdelmalak-aa2507177/"
                target="_blank"
                rel="noreferrer"
                data-click-reactive="true"
                className="click-reactive rounded-full px-3 py-1.5 font-medium transition hover:bg-brand-sand/80 hover:text-brand-teal dark:hover:bg-white/6"
              >
                LinkedIn
              </a>
              <a
                href="https://github.com/Ramyprojs/resume-reviewer-app"
                target="_blank"
                rel="noreferrer"
                data-click-reactive="true"
                className="click-reactive rounded-full px-3 py-1.5 font-medium transition hover:bg-brand-sand/80 hover:text-brand-teal dark:hover:bg-white/6"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/"
            data-click-reactive="true"
            className="click-reactive rounded-full px-3 py-1.5 transition hover:bg-brand-sand/80 hover:text-brand-teal dark:hover:bg-white/6"
          >
            Home
          </Link>
          <Link
            href="/analyze"
            data-click-reactive="true"
            className="click-reactive rounded-full px-3 py-1.5 transition hover:bg-brand-sand/80 hover:text-brand-teal dark:hover:bg-white/6"
          >
            Analyze
          </Link>
          <Link
            href="/history"
            data-click-reactive="true"
            className="click-reactive rounded-full px-3 py-1.5 transition hover:bg-brand-sand/80 hover:text-brand-teal dark:hover:bg-white/6"
          >
            History
          </Link>
        </div>
      </div>
    </footer>
  );
}
