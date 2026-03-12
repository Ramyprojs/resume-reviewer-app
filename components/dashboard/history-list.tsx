"use client";

import { Clock3, FileText, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useDeferredValue, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import {
  clearStoredHistory,
  readStoredHistory
} from "@/lib/history/storage";
import type { StoredAnalysis } from "@/types/history";

export function HistoryList() {
  const [history, setHistory] = useState<StoredAnalysis[]>([]);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    setHistory(readStoredHistory());
  }, []);

  const filteredHistory = history.filter((item) => {
    const haystack = `${item.label} ${item.fileName} ${item.result.summary}`.toLowerCase();
    return haystack.includes(deferredQuery.trim().toLowerCase());
  });

  const clearAll = () => {
    clearStoredHistory();
    setHistory([]);
  };

  if (!history.length) {
    return (
      <EmptyState
        title="No saved analyses yet"
        description="Your previous scans are stored locally in this browser so you can revisit scores and recommendations later."
        icon={<FileText className="size-6" />}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <label className="relative block w-full max-w-xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by resume name or summary"
              className="h-12 w-full rounded-full border border-border bg-white/80 pl-11 pr-4 text-sm text-brand-ink placeholder:text-muted-foreground dark:bg-white/5 dark:text-white"
            />
          </label>
          <Button
            type="button"
            variant="outline"
            icon={<Trash2 className="size-4" />}
            onClick={clearAll}
          >
            Clear history
          </Button>
        </div>
      </Card>

      <div className="grid gap-4">
        {filteredHistory.map((item) => (
          <Card key={item.id} className="p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge tone="info">{item.result.overallScore}/100</Badge>
                  <Badge tone="default">{item.hasJobDescription ? "Job match used" : "General review"}</Badge>
                  <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock3 className="size-4" />
                    {new Date(item.createdAt).toLocaleString()}
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl">{item.label}</h3>
                  <p className="mt-2 max-w-3xl">{item.result.summary}</p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <Link href={`/analyze?historyId=${item.id}`}>
                  <Button>Open analysis</Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
