import type { Metadata } from "next";
import { Toaster } from "sonner";

import { ClickFeedback } from "@/components/effects/click-feedback";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { ThemeProvider } from "@/components/providers/theme-provider";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "AI Resume Reviewer",
  description:
    "Upload a PDF or DOCX resume, score it with AI, and get recruiter-style feedback, ATS insights, and tailored improvement suggestions.",
  keywords: [
    "resume reviewer",
    "resume analyzer",
    "ATS resume checker",
    "portfolio next.js project",
    "Gemini resume feedback"
  ]
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ClickFeedback />
          <div className="relative z-10 flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              classNames: {
                toast:
                  "surface-panel border border-border bg-card text-brand-ink shadow-soft dark:text-white"
              }
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
