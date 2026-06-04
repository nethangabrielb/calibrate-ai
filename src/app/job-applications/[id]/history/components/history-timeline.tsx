"use client";

import { HistoryVersion } from "@/lib/history";

import { HistoryVersionCard } from "./history-version-card";

type HistoryTimelineProps = {
  versions: HistoryVersion[];
  onCompareFromHere: (versionId: number) => void;
};

export const HistoryTimeline = ({
  versions,
  onCompareFromHere,
}: HistoryTimelineProps) => {
  return (
    <section className="flex flex-col gap-3 rounded-xl border border-border/70 bg-background p-4">
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-medium tracking-tight">Version timeline</h3>
        <p className="text-sm text-muted-foreground">
          A descending history of every resume analysis.
        </p>
      </div>

      {versions.length > 0 ? (
        <div className="flex flex-col gap-3">
          {versions.map((version) => (
            <HistoryVersionCard
              key={version.id}
              version={version}
              onCompareFromHere={onCompareFromHere}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-border/70 px-4 py-6 text-sm text-muted-foreground">
          No resume analyses yet.
        </div>
      )}
    </section>
  );
};
