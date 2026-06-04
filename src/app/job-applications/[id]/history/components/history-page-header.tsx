"use client";

import { ArrowLeft, History, TrendingUp } from "lucide-react";

import Link from "next/link";

import { Button } from "@/components/ui/button";

import { formatHistoryDate } from "@/lib/history";

import { Application } from "@/types/application";

type HistoryPageHeaderProps = {
  application: Application;
  versionCount: number;
  latestScore?: number;
  analysisHref: string;
  applicationsHref: string;
};

export const HistoryPageHeader = ({
  application,
  versionCount,
  latestScore,
  analysisHref,
  applicationsHref,
}: HistoryPageHeaderProps) => {
  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-start sm:justify-between sm:p-6">
      <div className="flex flex-col gap-2">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border/70 bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
          <History className="h-3.5 w-3.5" />
          Resume history
        </div>

        <h1 className="text-2xl font-medium tracking-tight sm:text-3xl">
          {application.title}
        </h1>

        <p className="max-w-2xl text-sm text-muted-foreground">
          Review the full analysis trail for this application and compare how
          the resume evolved over time.
        </p>

        <div className="flex flex-wrap gap-2 pt-1 text-xs text-muted-foreground">
          {application.createdAt && (
            <span className="rounded-full border border-border/70 px-2.5 py-1">
              Applied on {formatHistoryDate(application.createdAt)}
            </span>
          )}
          {typeof latestScore === "number" && (
            <span className="inline-flex items-center gap-1 rounded-full border border-border/70 px-2.5 py-1">
              <TrendingUp className="h-3.5 w-3.5" />
              Latest score {latestScore}
            </span>
          )}
          <span className="rounded-full border border-border/70 px-2.5 py-1">
            {versionCount} versions
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:items-end">
        <Link href={analysisHref}>
          <Button variant="outline" className="w-fit gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to analysis
          </Button>
        </Link>
        <Link
          href={applicationsHref}
          className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
        >
          Back to applications
        </Link>
      </div>
    </section>
  );
};
