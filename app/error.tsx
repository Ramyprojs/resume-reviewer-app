"use client";

import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6">
          <Card className="w-full p-10 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-400/10 dark:text-amber-200">
              <AlertTriangle className="size-6" />
            </div>
            <h1 className="mt-6 text-3xl">Something interrupted the experience</h1>
            <p className="mt-3">
              {error.message ||
                "An unexpected application error occurred. Try again, or refresh the page."}
            </p>
            <div className="mt-8 flex justify-center">
              <Button onClick={() => reset()}>Try again</Button>
            </div>
          </Card>
        </div>
      </body>
    </html>
  );
}

