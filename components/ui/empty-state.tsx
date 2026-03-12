import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
}

export function EmptyState({ title, description, icon }: EmptyStateProps) {
  return (
    <Card className="p-8 text-center">
      <div className="mx-auto flex max-w-md flex-col items-center gap-3">
        {icon ? (
          <div className="flex size-12 items-center justify-center rounded-2xl bg-brand-sand text-brand-ink dark:bg-white/10 dark:text-white">
            {icon}
          </div>
        ) : null}
        <h3 className="text-2xl">{title}</h3>
        <p>{description}</p>
      </div>
    </Card>
  );
}

