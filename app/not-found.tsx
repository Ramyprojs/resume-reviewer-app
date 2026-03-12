import Link from "next/link";
import { Compass } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-6 py-16">
      <Card className="w-full p-10 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-brand-sand text-brand-ink dark:bg-white/10 dark:text-white">
          <Compass className="size-6" />
        </div>
        <h1 className="mt-6 text-3xl">Page not found</h1>
        <p className="mt-3">
          The page you were looking for is not here, but the analyzer is ready when
          you are.
        </p>
        <div className="mt-8 flex justify-center">
          <Link href="/analyze">
            <Button>Open Analyzer</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
