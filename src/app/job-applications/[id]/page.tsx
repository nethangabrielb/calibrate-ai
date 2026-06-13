"use client";

import { AnalysisPanel } from "@/app/job-applications/components/analysis-panel";
import JobApplicationSkeleton from "@/app/job-applications/components/job-application-skeleton";
import SkeletonAnalysisPanel from "@/app/job-applications/components/skeleton-analysis-panel";
import { useResume } from "@/hooks/useResume";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, MapPin, Sparkles } from "lucide-react";
import { SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

import { use, useState, useEffect } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { CreateAnalysisDialog } from "@/components/create-analysis-dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { formatDate } from "@/lib/data";
import { uploadResumeFile } from "@/lib/resume";
import { cn } from "@/lib/utils";

import { Analysis } from "@/types/analysis";
import { Application } from "@/types/application";
import { Resume, ResumeInput } from "@/types/resume";

const JobApplication = ({ params }: { params: Promise<{ id: string }> }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isFitCheckRunning, setIsFitCheckRunning] = useState(false);
  const queryClient = useQueryClient();
  const { id } = use(params);

  useEffect(() => {
    const fitResumeContent = sessionStorage.getItem("fit_check_resume_content");
    const fitResumeName = sessionStorage.getItem("fit_check_resume_name");

    if (fitResumeContent && fitResumeName) {
      // Clear sessionStorage immediately so we don't repeat on reload
      sessionStorage.removeItem("fit_check_resume_content");
      sessionStorage.removeItem("fit_check_resume_name");

      setIsFitCheckRunning(true);

      const runFitCheck = async () => {
        try {
          // 1. Save the resume text via /api/resume?save=true
          const saveRes = await fetch("/api/resume?save=true", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              content: fitResumeContent,
              name: fitResumeName,
            }),
          });

          if (!saveRes.ok) {
            const errData = await saveRes.json();
            throw new Error(errData.error || "Failed to save enhanced resume.");
          }

          const { resume } = await saveRes.json();

          // 2. Trigger AI analysis against this job application
          const analysisRes = await fetch(`/api/analysis/${id}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ resume }),
          });

          const analysisData = await analysisRes.json();

          if (!analysisRes.ok) {
            throw new Error(analysisData.message || "Failed to run analysis against job application.");
          }

          toast.success("AI analysis completed — showing enhanced resume results.");
          queryClient.invalidateQueries({ queryKey: ["analyses", id] });
        } catch (err) {
          console.error(err);
          toast.error(err instanceof Error ? err.message : "Failed to analyze enhanced resume.");
        } finally {
          setIsFitCheckRunning(false);
        }
      };

      runFitCheck();
    }
  }, [id, queryClient, router]);

  const { data, isPending: applicationPending } = useQuery<Application>({
    queryKey: ["application", id],
    queryFn: async () => {
      const res = await fetch(`/api/applications/${id}`);

      if (!res.ok) {
        throw new Error("Failed to fetch application data");
      }

      const json = await res.json();

      return json.data[0] as Application;
    },
    enabled: !!id,
  });

  const { data: analyses, isPending: analysisPending } = useQuery<{
    success: boolean;
    data: Analysis[];
  }>({
    queryKey: ["analyses", id],
    queryFn: async () => {
      const res = await fetch(`/api/analysis/${id}`);

      const json = await res.json();

      if (!res.ok) {
        toast.error(json.message || "Failed to fetch analyses.");
        throw new Error(json.message || "Failed to fetch analyses.");
      }

      return json;
    },
    enabled: !!id,
  });

  const statusStyle = (
    status: "APPLIED" | "INTERVIEWING" | "OFFERED" | "REJECTED",
  ) => {
    switch (status) {
      case "APPLIED":
        return "bg-blue-100 text-blue-800";
      case "INTERVIEWING":
        return "bg-yellow-100 text-yellow-800";
      case "OFFERED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      default:
        return "";
    }
  };

  const onSubmit: SubmitHandler<ResumeInput> = async (_data) => {
    const resumeFile = _data.resume?.[0];

    if (resumeFile) {
      try {
        const parsedResumeFile = (await uploadResumeFile(
          resumeFile as File,
        )) as {
          success: boolean;
          resume: Resume | null;
          error?: string;
          status?: number;
        };

        if (parsedResumeFile.success) {
          const res = await fetch(`/api/analysis/${id}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ resume: parsedResumeFile.resume }),
          });
          const json = await res.json();
          if (!res.ok) {
            toast.error(json.message || "Failed to run analysis.");
            console.error("Failed to run analysis");
            return;
          }
          if (json.success) {
            queryClient.invalidateQueries({ queryKey: ["analyses", id] });
            toast.success(json.message || "Analysis created successfully!");
            setIsOpen(false);
          } else {
            toast.error(json.message || "Failed to run analysis");
          }
        } else {
          toast.error(parsedResumeFile.error || "Failed to upload resume.");
        }
      } catch (error) {
        toast.error((error as Error).message || "Failed to upload resume.");
        console.error("Failed to upload resume:", error);
        return;
      }
    }
  };

  const {
    register,
    reset,
    renameResumeFile,
    resumeField,
    onResumeChange,
    errors,
    isSubmitting,
    handleSubmit,
    getValues,
  } = useResume({ onSubmit });

  const analysisContent = (() => {
    // Show skeleton with AI analysis message when fit check is running
    if (isFitCheckRunning) {
      return (
        <SkeletonAnalysisPanel>
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border/70 bg-primary/5 px-5 py-6 text-center">
            <div className="flex items-center gap-2 text-sm font-medium text-primary">
              <Sparkles className="size-4 animate-pulse" />
              Analyzing enhanced resume fit…
            </div>
            <p className="max-w-sm text-xs leading-relaxed text-muted-foreground">
              We&apos;re saving your enhanced resume and running a fresh AI
              analysis against this job application. This may take a moment.
            </p>
          </div>
        </SkeletonAnalysisPanel>
      );
    }

    if (analysisPending) {
      return <SkeletonAnalysisPanel />;
    }

    if (analyses && analyses?.data?.length > 0) {
      return (
        <>
          <AnalysisPanel analysis={analyses?.data?.[0]}>
            <div className="flex items-center justify-center gap-3 px-5 py-3">
              <Button
                className="w-fit cursor-pointer"
                variant="outline"
                onClick={() => router.push(`/job-applications/${id}/history`)}
              >View Analysis History
              </Button><CreateAnalysisDialog
                register={register}
                resumeField={resumeField}
                onResumeChange={onResumeChange}
                errors={errors}
                handleSubmit={handleSubmit(onSubmit)}
                isSubmitting={isSubmitting}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                buttonText="Re-run AI Analysis"
                reset={reset}
                resumeName={getValues("resume")?.[0]?.name}
                renameResume={renameResumeFile}
              />
            </div>
          </AnalysisPanel>
        </>
      );
    }

    return (
      <div className="flex flex-1 flex-col justify-center items-center px-5 py-8 gap-4">
        <p className="max-w-md text-sm leading-6 text-muted-foreground text-center">
          It seems this application does not have any AI analysis available yet.
          Click the button below to run an AI analysis on this application and
          get insights on how to improve it.
        </p>
        <CreateAnalysisDialog
          register={register}
          resumeField={resumeField}
          onResumeChange={onResumeChange}
          errors={errors}
          handleSubmit={handleSubmit(onSubmit)}
          isSubmitting={isSubmitting}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          reset={reset}
          resumeName={getValues("resume")?.[0]?.name}
          renameResume={renameResumeFile}
        />
      </div>
    );
  })();

  return (
    <div className="flex min-h-screen w-full min-w-0 flex-col gap-4 bg-background px-4 py-4 text-foreground sm:gap-6 sm:px-6 lg:px-8 xl:h-[calc(100vh-2rem)] xl:flex-row">
      {applicationPending ? (
        <JobApplicationSkeleton />
      ) : (
        <div className="flex w-full min-h-0 flex-col xl:w-5/12">
          <section className="h-fit space-y-2">
            <h1 className="text-2xl font-medium sm:text-3xl">{data?.title}</h1>
            <h3 className="text-[16px] font-normal text-secondary-foreground">
              {data?.company}
            </h3>

            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
              {data?.location && (
                <>
                  <div className="flex items-center gap-1 text-black/70">
                    <MapPin className="inline-block h-4 w-4" />
                    <p>{data?.location}</p>
                  </div>
                  <Separator
                    orientation="vertical"
                    className="hidden md:block"
                  />
                </>
              )}
              {data?.salary && (
                <>
                  <div className="flex items-center gap-1 text-black/70">
                    <p>
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: data?.salaryCurrency ?? "USD",
                        maximumFractionDigits: 0,
                      }).format(data?.salary)}
                    </p>
                  </div>
                  <Separator
                    orientation="vertical"
                    className="hidden md:block"
                  />
                </>
              )}
              {data?.createdAt && (
                <div className="flex items-center gap-1 text-black/70">
                  <p>Applied on {formatDate(data?.createdAt)}</p>
                </div>
              )}
            </div>
            <div
              className={cn(
                "mb-2 mt-2 w-fit rounded-full px-4 py-2 text-[12px] font-semibold",
                statusStyle(data?.status as Application["status"]),
              )}
            >
              {data?.status}
            </div>
          </section>
          <section className="mt-4 flex h-[42vh] min-h-0 flex-col gap-2 overflow-hidden rounded-lg border border-border p-4 shadow-sm backdrop-blur-sm md:h-[48vh] xl:h-auto xl:flex-1">
            <h1 className="text-xl font-medium shrink-0">
              Full Job Description
            </h1>
            <p className="min-h-0 overflow-y-auto font-light scrollbar-thin scrollbar-track-transparent scrollbar-thumb-rounded scrollbar-thumb-border/70">
              {data?.description}
            </p>
          </section>
        </div>
      )}

      {/* AI Analysis Section */}
      <div className="flex w-full min-h-0 flex-col gap-4 rounded-2xl border border-border bg-card p-4 shadow-lg backdrop-blur-sm sm:p-6 xl:h-[calc(100vh-2rem)] xl:w-7/12 xl:overflow-hidden">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <h1 className="text-xl font-medium tracking-tight sm:text-2xl">
            AI Analysis
          </h1>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/job-applications"
              className="group inline-flex w-fit items-center gap-1 text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              <span className="select-none leading-none">
                Back to applications
              </span>
            </Link>
          </div>
        </header>

        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pr-1">
          {analysisContent}
        </div>
      </div>
    </div>
  );
};

export default JobApplication;
