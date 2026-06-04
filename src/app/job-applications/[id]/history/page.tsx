"use client";

import { AnalysisHistory } from "@/app/job-applications/components/analysis-history";
import JobApplicationSkeleton from "@/app/job-applications/components/job-application-skeleton";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, History } from "lucide-react";

import { use } from "react";

import Link from "next/link";

import { Button } from "@/components/ui/button";

import { formatDate } from "@/lib/data";

import { Analysis } from "@/types/analysis";
import { Application } from "@/types/application";

const JobApplicationHistoryPage = ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = use(params);

  const { data: application, isPending: applicationPending } =
    useQuery<Application>({
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

  const { data: analyses, isPending: analysesPending } = useQuery<{
    success: boolean;
    data: Analysis[];
  }>({
    queryKey: ["analyses", id],
    queryFn: async () => {
      const res = await fetch(`/api/analysis/${id}`);

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.message || "Failed to fetch analyses.");
      }

      return res.json();
    },
    enabled: !!id,
  });

  const isLoading = applicationPending || analysesPending;

  return (
    <div className="flex min-h-screen w-full min-w-0 flex-col gap-6 bg-background px-4 py-4 text-foreground sm:px-6 lg:px-8">
      {isLoading ? (
        <JobApplicationSkeleton />
      ) : (
        <>
          <section className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-start sm:justify-between sm:p-6">
            <div className="flex flex-col gap-2">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border/70 bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
                <History className="h-3.5 w-3.5" />
                Resume history
              </div>
              <h1 className="text-2xl font-medium tracking-tight sm:text-3xl">
                {application?.title ?? "Job Application History"}
              </h1>
              <p className="max-w-2xl text-sm text-muted-foreground">
                Review the full analysis trail for this application and compare
                how the resume evolved over time.
              </p>
              {application?.createdAt && (
                <p className="text-xs text-muted-foreground">
                  Applied on {formatDate(application.createdAt)}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2 sm:items-end">
              <Link href={`/job-applications/${id}`}>
                <Button variant="outline" className="w-fit gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to analysis
                </Button>
              </Link>
            </div>
          </section>

          <AnalysisHistory analyses={analyses?.data ?? []} />
        </>
      )}
    </div>
  );
};

export default JobApplicationHistoryPage;
