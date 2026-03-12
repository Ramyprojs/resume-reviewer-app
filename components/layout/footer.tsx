import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border/80 bg-white/40 py-10 backdrop-blur dark:bg-slate-950/20">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between md:px-10">
        <div>
          <p className="font-semibold text-brand-ink dark:text-white">
            AI Resume Reviewer
          </p>
          <p>Portfolio-quality resume analysis with structured AI feedback.</p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="transition hover:text-brand-teal">
            Home
          </Link>
          <Link href="/analyze" className="transition hover:text-brand-teal">
            Analyze
          </Link>
          <Link href="/history" className="transition hover:text-brand-teal">
            History
          </Link>
        </div>
      </div>
    </footer>
  );
}

