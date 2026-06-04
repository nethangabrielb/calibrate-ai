"use client";

import { HistoryVersion } from "@/lib/history";
import { cn } from "@/lib/utils";

type HistoryCompareCardProps = {
  label: string;
  version: HistoryVersion;
};

const skillStyles = {
  match:
    "border-teal-500/40 bg-teal-500/10 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
  miss: "border-destructive/40 bg-destructive/10 text-destructive dark:bg-destructive/20",
};

export const HistoryCompareCard = ({
  label,
  version,
}: HistoryCompareCardProps) => {
  return (
    <div className="rounded-lg border border-border/60 bg-background p-3">
      <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <div className="mt-2 flex items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-medium text-foreground">
            {version.resumeLabel}
          </h4>
          <p className="text-xs text-muted-foreground">
            {version.versionLabel}
          </p>
        </div>
        <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
          {version.score}
        </div>
      </div>

      <div className="mt-3 grid gap-3">
        <div className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2">
          <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
            Uploaded
          </p>
          <p className="mt-1 text-sm text-foreground">
            {version.uploadedAtLabel}
          </p>
        </div>
      </div>
      <div className="rounded-lg border border-border/60 bg-muted/20 p-3 mt-2">
        <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
          AI Recommendation
        </p>
        <p className="mt-2 text-sm leading-6 text-foreground/90">
          {version.recommendation}
        </p>
      </div>
    </div>
  );
};
