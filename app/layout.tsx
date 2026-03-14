import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";

import { ClickFeedback } from "@/components/effects/click-feedback";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { ThemeProvider } from "@/components/providers/theme-provider";
import "@/app/globals.css";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "AI Resume Reviewer",
  description:
    "Upload a PDF or DOCX resume, score it with AI, and get recruiter-style feedback, ATS insights, and tailored improvement suggestions.",
  metadataBase: new URL(appUrl),
  keywords: [
    "resume reviewer",
    "resume analyzer",
    "ATS resume checker",
    "portfolio next.js project",
    "Gemini resume feedback"
  ],
  authors: [{ name: "Ramy Abdelmalak" }],
  creator: "Ramy Abdelmalak",
  openGraph: {
    title: "AI Resume Reviewer",
    description:
      "Upload a PDF or DOCX resume, score it with AI, and get recruiter-style feedback, ATS insights, and tailored improvement suggestions.",
    url: appUrl,
    siteName: "AI Resume Reviewer",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Resume Reviewer",
    description:
      "Production-style AI resume analysis with ATS scoring, recruiter feedback, and job-match guidance."
  }
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" }
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
