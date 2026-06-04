"use client";

import { Sparkles } from "lucide-react";

import { HistoryTrendData, HistoryVersion } from "@/lib/history";

type HistoryTrendCardProps = {
  versions: HistoryVersion[];
  trendData: HistoryTrendData;
};

const lineColor = "#0f766e";

export const HistoryTrendCard = ({
  versions,
  trendData,
}: HistoryTrendCardProps) => {
  return (
    <section className="rounded-xl border border-border/70 bg-background p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
            Score trend
          </p>
          <p className="text-sm text-muted-foreground">
            Visual progression across versions.
          </p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full border border-border/70 px-2.5 py-1 text-xs font-medium text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5" />
          Timeline
        </span>
      </div>

      <div className="mt-4 h-24 rounded-lg border border-border/60 bg-muted/20 p-2">
        {trendData.points.length > 0 ? (
          <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible">
            <defs>
              <linearGradient id="historyLineFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={lineColor} stopOpacity="0.3" />
                <stop offset="100%" stopColor={lineColor} stopOpacity="0" />
              </linearGradient>
            </defs>
            {trendData.areaPath ? (
              <path
                d={trendData.areaPath}
                fill="url(#historyLineFill)"
                stroke="none"
              />
            ) : null}
            <polyline
              fill="none"
              stroke={lineColor}
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
              points={trendData.points
                .map((point) => `${point.x},${point.y}`)
                .join(" ")}
            />
            {trendData.points.map((point, index) => (
              <circle
                key={`${point.x}-${point.y}-${index}`}
                cx={point.x}
                cy={point.y}
                r="2.2"
                fill={lineColor}
              />
            ))}
          </svg>
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
            No score data yet.
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
        <span className="rounded-full border border-border/70 px-2.5 py-1">
          {versions.length} total versions
        </span>
        <span className="rounded-full border border-border/70 px-2.5 py-1">
          Latest score {versions[0]?.score ?? "N/A"}
        </span>
      </div>
    </section>
  );
};
