import { HistoryList } from "@/components/dashboard/history-list";
import { SectionHeading } from "@/components/ui/section-heading";

export default function HistoryPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-14 md:px-10 lg:py-16">
      <div className="space-y-8">
        <SectionHeading
          eyebrow="History"
          title="Previous resume scans"
          description="Saved analyses are stored locally in your browser so you can revisit earlier scores, compare improvements, or reopen a report."
        />
        <HistoryList />
      </div>
    </div>
  );
}

