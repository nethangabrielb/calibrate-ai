"use client";

export const HistoryPageSkeleton = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="h-52 rounded-2xl border border-border/70 bg-muted/30" />
        <div className="h-52 rounded-2xl border border-border/70 bg-muted/30" />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-3">
          <div className="h-52 rounded-xl border border-border/70 bg-muted/30" />
          <div className="h-52 rounded-xl border border-border/70 bg-muted/30" />
          <div className="h-52 rounded-xl border border-border/70 bg-muted/30" />
        </div>
        <div className="h-[34rem] rounded-xl border border-border/70 bg-muted/30" />
      </div>
    </div>
  );
};
