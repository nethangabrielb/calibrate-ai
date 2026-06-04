"use client";

import { Button } from "@/components/ui/button";

import { formatHistoryDate } from "@/lib/history";
import { HistoryVersion } from "@/lib/history";
import { cn } from "@/lib/utils";

type HistoryVersionCardProps = {
  version: HistoryVersion;
  onCompareFromHere: (versionId: number) => void;
};

const skillStyles = {
  match:
    "border-teal-500/40 bg-teal-500/10 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
  miss: "border-destructive/40 bg-destructive/10 text-destructive dark:bg-destructive/20",
};

export const HistoryVersionCard = ({
  version,
  onCompareFromHere,
}: HistoryVersionCardProps) => {
  return (
    <article className="grid gap-3 rounded-xl border border-border/70 bg-muted/20 p-4 sm:grid-cols-[auto_1fr]">
      <div className="flex items-center gap-3 sm:flex-col sm:items-start sm:gap-2">
        <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-base font-semibold text-primary">
          {version.score}
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {version.versionLabel}
          </span>
          {version.scoreDeltaLabel ? (
            <span
              className={cn("text-sm font-medium", version.scoreDeltaClassName)}
            >
              {version.scoreDeltaLabel} vs previous
            </span>
          ) : (
            <span className="text-sm font-medium text-muted-foreground">
              First version
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-medium">{version.resumeLabel}</h3>
            <p className="text-xs text-muted-foreground">
              Analysis on {formatHistoryDate(version.createdAt)}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span className="rounded-full border border-border/70 px-2.5 py-1">
              {version.versionLabel}
            </span>
            <span className="rounded-full border border-border/70 px-2.5 py-1">
              Uploaded {version.uploadedAtLabel}
            </span>
            <span className="rounded-full border border-border/70 px-2.5 py-1">
              Score {version.score}
            </span>
          </div>
        </div>

        <div className="grid gap-2 lg:grid-cols-2">
          <div className="rounded-lg border border-border/60 bg-background px-3 py-2">
            <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
              Matching skills
            </p>
            {version.matchingSkills?.length ? (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {version.matchingSkills.map((skill) => (
                  <span
                    key={skill}
                    className={cn(
                      "rounded-full border px-2.5 py-0.5 text-[12px] font-medium whitespace-nowrap",
                      skillStyles.match,
                    )}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-1 text-sm text-foreground">
                No matching skills captured.
              </p>
            )}
          </div>

          <div className="rounded-lg border border-border/60 bg-background px-3 py-2">
            <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
              Missing skills
            </p>
            {version.missingSkills?.length ? (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {version.missingSkills.map((skill) => (
                  <span
                    key={skill}
                    className={cn(
                      "rounded-full border px-2.5 py-0.5 text-[12px] font-medium whitespace-nowrap",
                      skillStyles.miss,
                    )}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-1 text-sm text-foreground">
                No missing skills captured.
              </p>
            )}
          </div>
        </div>

        <p className="text-sm leading-6 text-muted-foreground">
          {version.recommendation}
        </p>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="w-fit"
            onClick={() => onCompareFromHere(version.id)}
          >
            Compare from here
          </Button>
        </div>
      </div>
    </article>
  );
};
