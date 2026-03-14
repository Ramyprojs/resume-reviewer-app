"use client";

import { BrainCircuit, FileSearch2, History, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils/cn";

const links = [
  { href: "/", label: "Home", icon: Sparkles },
  { href: "/analyze", label: "Analyze", icon: FileSearch2 },
  { href: "/history", label: "History", icon: History }
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/78 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 py-4 md:px-10">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-brand-ink text-white dark:bg-white dark:text-slate-950">
              <BrainCircuit className="size-5" />
            </div>
            <div>
              <p className="font-display text-lg font-semibold leading-none text-brand-ink dark:text-white">
                AI Resume Reviewer
              </p>
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                ATS + recruiter insights
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 rounded-full border border-border/80 bg-white/82 p-1 shadow-soft dark:bg-white/5 md:flex">
            {links.map(({ href, label, icon: Icon }) => {
              const isActive =
                href === "/" ? pathname === href : pathname.startsWith(href);

              return (
                <Link
                  key={href}
                  href={href}
                  data-click-reactive="true"
                  className={cn(
                    "click-reactive inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition",
                    isActive
                      ? "bg-brand-ink text-white dark:bg-white dark:text-slate-950"
                      : "text-muted-foreground hover:bg-brand-sand/70 hover:text-brand-ink dark:hover:bg-white/6 dark:hover:text-white"
                  )}
                >
                  <Icon className="size-4" />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/analyze" className="hidden sm:block">
              <Button size="sm">Launch Analyzer</Button>
            </Link>
          </div>
        </div>

        <nav className="flex items-center gap-2 overflow-x-auto rounded-full border border-border/80 bg-white/82 p-1 shadow-soft dark:bg-white/5 md:hidden">
          {links.map(({ href, label, icon: Icon }) => {
            const isActive =
              href === "/" ? pathname === href : pathname.startsWith(href);

            return (
              <Link
                key={href}
                href={href}
                data-click-reactive="true"
                className={cn(
                  "click-reactive inline-flex min-w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition",
                  isActive
                    ? "bg-brand-ink text-white dark:bg-white dark:text-slate-950"
                    : "text-muted-foreground hover:bg-brand-sand/70 hover:text-brand-ink dark:hover:bg-white/6 dark:hover:text-white"
                )}
              >
                <Icon className="size-4" />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
