"use client";

import { useMutation } from "@tanstack/react-query";
import { Sparkles, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";

import { uploadResumeFile } from "@/lib/resume";

import { EnhancedResumeResult } from "./components/EnhancedResumeResult";
import { ResumeEnhancerForm } from "./components/ResumeEnhancerForm";
import { ResumeEnhancerLoading } from "./components/ResumeEnhancerLoading";

type EnhanceMutationInput = {
  resume?: FileList | null;
  resumeName?: string;
  jobDescription: string;
  resumeContent?: string;
};

const ResumeEnhancerPage = () => {
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const hasFiredRef = useRef(false);

  const mutation = useMutation({
    mutationFn: async (data: EnhanceMutationInput) => {
      let parsedResume = data.resumeContent || "";
      let fileName = data.resumeName || "";

      if (!parsedResume) {
        const file = data.resume?.[0] as File;
        if (!file) {
          throw new Error("Please upload a resume file.");
        }
        fileName = file.name;

        // upload file and extract contents
        const res = await uploadResumeFile(file, false);
        if (!res.success || !res.resume) {
          throw new Error(res.error || "Failed to upload resume");
        }

        parsedResume = res.resume as string;
      }

      // request resume enhancement
      const enhanceRes = await fetch("/api/resume/enhance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resume: parsedResume,
          jobDescription: data.jobDescription,
        }),
      });

      if (!enhanceRes.ok) {
        const errorData = await enhanceRes.json();
        throw new Error(
          errorData.error || errorData.message || "Failed to enhance resume",
        );
      }

      const enhancedResume = await enhanceRes.json();
      if (!enhancedResume.success || !enhancedResume.data) {
        throw new Error(
          enhancedResume.message ||
            "Failed to generate tailored resume content",
        );
      }

      return {
        data: enhancedResume.data as string,
        resumeName: data.resumeName || fileName,
      };
    },
    onError: (err: Error) => {
      toast.error(err.message || "An unexpected error occurred.");
    },
  });

  useEffect(() => {
    if (hasFiredRef.current) return;

    const resumeContent = sessionStorage.getItem("enhance_resume_content");
    const jobDescription = sessionStorage.getItem("enhance_job_description");
    const resumeName = sessionStorage.getItem("enhance_resume_name");
    const appId = sessionStorage.getItem("enhance_application_id");

    if (resumeContent && jobDescription && appId) {
      hasFiredRef.current = true;

      // Clear immediately
      sessionStorage.removeItem("enhance_resume_content");
      sessionStorage.removeItem("enhance_resume_name");
      sessionStorage.removeItem("enhance_job_description");
      sessionStorage.removeItem("enhance_application_id");

      setApplicationId(appId);
      mutation.mutate({
        resumeContent,
        resumeName: resumeName || "Resume.pdf",
        jobDescription,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReset = () => {
    setApplicationId(null);
    mutation.reset();
  };

  return (
    <div className="bg-background text-foreground print-root-container flex h-full min-h-0 w-full min-w-0 flex-col gap-6 px-8 py-4">
      <section className="flex flex-col gap-3 print:hidden">
        <div className="border-border/70 bg-card text-muted-foreground inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium">
          <Sparkles className="text-primary size-3.5" />
          AI-powered resume tailoring
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-medium">Resume Enhancer</h1>
          <p className="text-muted-foreground max-w-2xl text-sm">
            Upload your resume and paste a job description. We&apos;ll help you
            reshape your experience so it reads stronger for that specific role.
          </p>
        </div>
        {mutation.isSuccess && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="absolute top-0 right-0 mx-8 my-4 flex w-fit items-center gap-2"
          >
            <ArrowLeft className="size-4" />
            Enhance Another
          </Button>
        )}
      </section>

      {/* main conditional rendering flow */}
      {mutation.isPending ? (
        <ResumeEnhancerLoading />
      ) : mutation.isSuccess && mutation.data ? (
        <EnhancedResumeResult
          enhancedResume={mutation.data.data}
          resumeName={mutation.data.resumeName}
          onReset={handleReset}
          applicationId={applicationId}
        />
      ) : (
        <ResumeEnhancerForm
          onEnhance={(data) => mutation.mutate(data)}
          isPending={mutation.isPending}
        />
      )}
    </div>
  );
};

export default ResumeEnhancerPage;

