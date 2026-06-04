"use client";

import { HistoryVersion, getHistoryComparisonSummary } from "@/lib/history";

import { HistoryCompareCard } from "./history-compare-card";

type HistoryComparePanelProps = {
  versions: HistoryVersion[];
  leftVersionId: string;
  rightVersionId: string;
  onLeftVersionIdChange: (versionId: string) => void;
  onRightVersionIdChange: (versionId: string) => void;
};

export const HistoryComparePanel = ({
  versions,
  leftVersionId,
  rightVersionId,
  onLeftVersionIdChange,
  onRightVersionIdChange,
}: HistoryComparePanelProps) => {
  const leftVersion = versions.find(
    (version) => String(version.id) === leftVersionId,
  );
  const rightVersion = versions.find(
    (version) => String(version.id) === rightVersionId,
  );
  const summary = getHistoryComparisonSummary(leftVersion, rightVersion);
  const canCompare = Boolean(
    leftVersion && rightVersion && leftVersion.id !== rightVersion.id,
  );

  return (
    <section className="flex flex-col gap-4 rounded-xl border border-border/70 bg-background p-4 shadow-sm">
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-medium tracking-tight">Compare versions</h3>
        <p className="text-xs text-muted-foreground">
          Choose any two versions to inspect score movement and summary
          differences.
        </p>
      </div>

      <div className="grid gap-3">
        <label className="grid gap-1.5 text-xs font-medium text-muted-foreground">
          Left version
          <select
            className="h-10 rounded-lg border border-border/70 bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary"
            value={leftVersionId}
            onChange={(event) => onLeftVersionIdChange(event.target.value)}
          >
            <option value="">Select a version</option>
            {versions.map((version) => (
              <option key={version.id} value={String(version.id)}>
                {version.versionLabel} - {version.resumeLabel}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1.5 text-xs font-medium text-muted-foreground">
          Right version
          <select
            className="h-10 rounded-lg border border-border/70 bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary"
            value={rightVersionId}
            onChange={(event) => onRightVersionIdChange(event.target.value)}
          >
            <option value="">Select a version</option>
            {versions.map((version) => (
              <option key={version.id} value={String(version.id)}>
                {version.versionLabel} - {version.resumeLabel}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="rounded-lg border border-border/60 bg-muted/20 p-3 text-sm">
        <p className={`font-medium ${summary.toneClassName}`}>
          {summary.label}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {summary.description}
        </p>
      </div>

      {canCompare ? (
        <div className="grid gap-3 xl:grid-cols-2">
          <HistoryCompareCard label="Left version" version={leftVersion!} />
          <HistoryCompareCard label="Right version" version={rightVersion!} />
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-border/70 px-4 py-6 text-sm text-muted-foreground">
          Select two different versions to open a side-by-side comparison.
        </div>
      )}

      {typeof summary.scoreDelta === "number" ? (
        <div className="rounded-lg border border-border/60 bg-background p-3">
          <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
            Score difference
          </p>
          <p className={`mt-2 text-2xl font-medium ${summary.toneClassName}`}>
            {summary.scoreDelta > 0 ? "+" : ""}
            {summary.scoreDelta}
          </p>
        </div>
      ) : null}
    </section>
  );
};
