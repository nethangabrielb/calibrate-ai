"use client";

import { Sparkles } from "lucide-react";

import { HistoryVersion } from "@/lib/history";

import { ResumeAnalysisLineGraph } from "./linear-graph";

type HistoryTrendCardProps = {
  versions: HistoryVersion[];
};

export const HistoryTrendCard = ({ versions }: HistoryTrendCardProps) => {
  return (
    <section className="flex flex-col gap-3">
      <ResumeAnalysisLineGraph versions={versions} />

      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
        <span className="rounded-full border border-border/70 px-2.5 py-1">
          {versions.length} total versions
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border border-border/70 px-2.5 py-1">
          <Sparkles className="h-3.5 w-3.5" />
          Resume timeline
        </span>
      </div>
    </section>
  );
};
