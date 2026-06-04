import { formatDate } from "@/lib/data";
import { cn } from "@/lib/utils";

import { Analysis } from "@/types/analysis";

type AnalysisHistoryProps = {
  analyses: Analysis[];
};

type AnalysisWithResume = Analysis & {
  resume?: {
    id: number;
    name: string;
    createdAt: string;
  } | null;
};

const skillStyles = {
  match:
    "border-teal-500/40 bg-teal-500/10 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
  miss: "border-destructive/40 bg-destructive/10 text-destructive dark:bg-destructive/20",
};

export const AnalysisHistory = ({ analyses }: AnalysisHistoryProps) => {
  const history = analyses as AnalysisWithResume[];

  const getScoreDelta = (currentScore: number, nextScore?: number) => {
    if (typeof nextScore !== "number") {
      return null;
    }

    const delta = currentScore - nextScore;

    if (delta === 0) {
      return { label: "No change", className: "text-muted-foreground" };
    }

    return {
      label: `${delta > 0 ? "+" : ""}${delta}`,
      className:
        delta > 0
          ? "text-emerald-600 dark:text-emerald-400"
          : "text-destructive",
    };
  };

  return (
    <section className="flex flex-col gap-4 rounded-xl border border-border/70 bg-background p-4">
      <header className="flex flex-col gap-1">
        <h2 className="text-lg font-medium tracking-tight">Resume History</h2>
        <p className="text-sm text-muted-foreground">
          Review past resume versions and compare how each analysis changed over
          time.
        </p>
      </header>

      <div className="flex flex-col gap-3">
        {history.length > 0 ? (
          <div className="flex flex-col gap-3">
            {history.map((analysis, index) => {
              const previousAnalysis = history[index + 1];
              const scoreDelta = getScoreDelta(
                analysis.score,
                previousAnalysis?.score,
              );
              const resumeName =
                analysis.resumes[0]?.name ??
                `Resume version ${history.length - index}`;

              return (
                <article
                  key={analysis.id}
                  className="grid gap-3 rounded-xl border border-border/70 bg-muted/20 p-4 sm:grid-cols-[auto_1fr]"
                >
                  <div className="flex items-center gap-3 sm:flex-col sm:items-start sm:gap-2">
                    <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-base font-semibold text-primary">
                      {analysis.score}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                        Score
                      </span>
                      {scoreDelta ? (
                        <span
                          className={`text-sm font-medium ${scoreDelta.className}`}
                        >
                          {scoreDelta.label} vs previous
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
                        <h3 className="text-sm font-medium">{resumeName}</h3>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(analysis.createdAt)}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                        <span className="rounded-full border border-border/70 px-2.5 py-1">
                          Analysis #{history.length - index}
                        </span>
                        {analysis.resumes[0]?.createdAt && (
                          <span className="rounded-full border border-border/70 px-2.5 py-1">
                            Resume uploaded{" "}
                            {formatDate(analysis.resumes[0].createdAt)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-2 lg:grid-cols-2">
                      <div className="rounded-lg border border-border/60 bg-background px-3 py-2">
                        <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
                          Matching skills
                        </p>
                        {analysis.matchingSkills?.length ? (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {analysis.matchingSkills.map((skill) => (
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
                        {analysis.missingSkills?.length ? (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {analysis.missingSkills.map((skill) => (
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
                      {analysis.recommendation}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-border/70 px-4 py-6 text-sm text-muted-foreground">
            No resume analyses yet.
          </div>
        )}
      </div>
    </section>
  );
};
