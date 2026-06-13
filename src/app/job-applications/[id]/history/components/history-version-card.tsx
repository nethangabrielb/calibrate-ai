"use client";

import { Sparkles } from "lucide-react";
import { toast } from "sonner";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import { formatHistoryDate } from "@/lib/history";
import { HistoryVersion } from "@/lib/history";
import { cn } from "@/lib/utils";

type HistoryVersionCardProps = {
  version: HistoryVersion;
  onCompareFromHere: (versionId: number) => void;
  jobDescription: string;
  applicationId: string;
};

const skillStyles = {
  match:
    "border-teal-500/40 bg-teal-500/10 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
  miss: "border-destructive/40 bg-destructive/10 text-destructive dark:bg-destructive/20",
};

export const HistoryVersionCard = ({
  version,
  onCompareFromHere,
  jobDescription,
  applicationId,
}: HistoryVersionCardProps) => {
  const router = useRouter();

  const handleEnhanceWithAI = () => {
    const resume = version.resumes?.[0] || version.resume;
    if (!resume || !resume.content) {
      toast.error("Resume content is not available for this version.");
      return;
    }

    // Store raw text and metadata in sessionStorage
    sessionStorage.setItem("enhance_resume_content", resume.content);
    sessionStorage.setItem("enhance_resume_name", resume.name || "Resume.pdf");
    sessionStorage.setItem("enhance_job_description", jobDescription);
    sessionStorage.setItem("enhance_application_id", applicationId);

    // Use hard navigation to guarantee a fresh page mount
    window.location.href = `/resume-enhancer`;
  };

  return (
    <article className="border-border/70 bg-muted/20 grid gap-3 rounded-xl border p-4 sm:grid-cols-[auto_1fr]">
      <div className="flex items-center gap-3 sm:flex-col sm:items-start sm:gap-2">
        <div className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-full text-base font-semibold">
          {version.score}
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
            {version.versionLabel}
          </span>
          {version.scoreDeltaLabel ? (
            <span
              className={cn("text-sm font-medium", version.scoreDeltaClassName)}
            >
              {version.scoreDeltaLabel} vs previous
            </span>
          ) : (
            <span className="text-muted-foreground text-sm font-medium">
              First version
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-medium">{version.resumeLabel}</h3>
            <p className="text-muted-foreground text-xs">
              Analysis on {formatHistoryDate(version.createdAt)}
            </p>
          </div>

          <div className="text-muted-foreground flex flex-wrap gap-2 text-xs">
            <span className="border-border/70 rounded-full border px-2.5 py-1">
              {version.versionLabel}
            </span>
            <span className="border-border/70 rounded-full border px-2.5 py-1">
              Uploaded {version.uploadedAtLabel}
            </span>
            <span className="border-border/70 rounded-full border px-2.5 py-1">
              Score {version.score}
            </span>
          </div>
        </div>

        <div className="grid gap-2 lg:grid-cols-2">
          <div className="border-border/60 bg-background rounded-lg border px-3 py-2">
            <p className="text-muted-foreground text-[11px] font-medium tracking-widest uppercase">
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
              <p className="text-foreground mt-1 text-sm">
                No matching skills captured.
              </p>
            )}
          </div>

          <div className="border-border/60 bg-background rounded-lg border px-3 py-2">
            <p className="text-muted-foreground text-[11px] font-medium tracking-widest uppercase">
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
              <p className="text-foreground mt-1 text-sm">
                No missing skills captured.
              </p>
            )}
          </div>
        </div>

        <p className="text-muted-foreground text-sm leading-6">
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
          <Button
            type="button"
            size="sm"
            className="w-fit gap-1.5"
            onClick={handleEnhanceWithAI}
          >
            <Sparkles className="size-3.5 animate-pulse text-white" />
            Enhance Resume with AI
          </Button>
        </div>
      </div>
    </article>
  );
};
