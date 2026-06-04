"use client";

import { useQuery } from "@tanstack/react-query";

import { use } from "react";

import { Analysis } from "@/types/analysis";
import { Application } from "@/types/application";

import { HistoryPage } from "./components/history-page";
import { HistoryPageSkeleton } from "./components/history-page-skeleton";

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
        <HistoryPageSkeleton />
      ) : (
        <HistoryPage
          application={application as Application}
          analyses={analyses?.data ?? []}
          applicationId={id}
        />
      )}
    </div>
  );
};

export default JobApplicationHistoryPage;
