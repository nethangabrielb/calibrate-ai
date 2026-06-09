"use client";

import { useEnhancedResume } from "@/hooks/useEnhancedResume";
import { useMutation } from "@tanstack/react-query";
import { FileText, Sparkles, Upload } from "lucide-react";
import { SubmitHandler } from "react-hook-form";

import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";

import { cn } from "@/lib/utils";

import { EnhancedResumeInput } from "@/types/resume";

const ResumeEnhancerPage = () => {
  const mutation = useMutation({
    mutationFn: async (data: EnhancedResumeInput) => {
      // TODO: Implement the resume enhancement flow:
      // 1. Get the PDF file from the data.resume FileList (e.g., data.resume?.[0])
      // 2. Upload the file and extract its content by calling /api/resume (or using uploadResumeFile helper)
      // 3. Retrieve the parsed resume content string from the response
      // 4. Make a POST request to /api/resume/enhance with:
      //    - resume: the extracted text from the upload
      //    - jobDescription: data.jobDescription
      // 5. Return the response containing the enhanced resume
    },
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const uploadHandler = () => {
    fileInputRef.current?.click();
  };

  const onSubmit: SubmitHandler<EnhancedResumeInput> = (data) => {
    console.log("Submit!");
    // mutation.mutate(data);
  };

  const {
    register,
    errors,
    reset,
    renameResumeFile,
    resumeField,
    onResumeChange,
    handleSubmit,
    isSubmitting,
    getValues,
    hasCompleteFields,
    watch,
  } = useEnhancedResume({ onSubmit });

  return (
    <div className="bg-background text-foreground flex h-full min-h-0 w-full min-w-0 flex-col gap-6 px-8 py-4">
      <section className="flex flex-col gap-3">
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
      </section>

      <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-2">
        <Card className="border-border/70 bg-card shadow-sm">
          <CardHeader className="border-border/60 border-b pb-4">
            <div className="flex items-start gap-3">
              <span className="border-border/70 bg-background text-muted-foreground flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-medium">
                1
              </span>
              <div className="flex flex-col gap-1">
                <CardTitle className="text-lg font-medium">
                  Upload your resume
                </CardTitle>
                <CardDescription>
                  Start with the version you&apos;d send to employers today.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {errors?.resume?.message ===
            "Resume with this name already exists." ? (
              <div className="border-border/80 bg-muted/20 flex w-full flex-col items-center gap-5 rounded-xl border p-6 text-center">
                <div className="bg-destructive/10 border-destructive/20 text-destructive flex size-12 items-center justify-center rounded-full border shadow-sm">
                  <FileText className="size-5" />
                </div>
                <div className="flex max-w-sm flex-col gap-1">
                  <p className="text-foreground text-sm font-medium">
                    Duplicate file name detected
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Please provide a new name to distinguish this version of
                    your resume.
                  </p>
                </div>
                <div className="flex w-full max-w-sm flex-col gap-3 pt-1">
                  <Input
                    placeholder="Enter a new name for your resume"
                    {...register("resumeName")}
                    defaultValue={watch("resumeName") ?? ""}
                    className="bg-background border-border/70"
                  />
                  <p className="text-destructive text-xs">
                    A resume with this name already exists. Please rename your
                    file and try again.
                  </p>
                  <Button
                    type="button"
                    disabled={isSubmitting}
                    onClick={renameResumeFile}
                    className="w-full font-medium"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <Spinner />
                        Uploading...
                      </span>
                    ) : (
                      "Upload Resume"
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={uploadHandler}
                  className={cn(
                    "group border-border/80 bg-muted/20 flex w-full flex-col items-center gap-4 rounded-xl border border-dashed px-6 py-10 text-center transition-colors",
                    "hover:border-primary/40 hover:bg-muted/35 focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
                    isSubmitting &&
                      "bg-muted hover:bg-muted cursor-not-allowed",
                  )}
                  disabled={isSubmitting}
                >
                  {isSubmitting && <Spinner />}
                  <div
                    className={cn(
                      "border-border/70 bg-background group-hover:border-primary/30 flex size-12 items-center justify-center rounded-full border shadow-sm transition-colors",
                      isSubmitting && "sr-only",
                    )}
                  >
                    <Upload className="text-muted-foreground group-hover:text-primary size-5 transition-colors" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-foreground text-sm font-medium">
                      Click to upload your resume
                    </p>
                    <p className="text-muted-foreground text-xs">
                      PDF only · up to 5 MB
                    </p>
                  </div>
                  <span className="border-border/70 bg-background text-muted-foreground inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs">
                    <FileText className="size-3.5" />
                    {watch("resumeName") || "No file selected"}
                  </span>
                </button>
                <input
                  type="file"
                  className="sr-only"
                  accept=".pdf"
                  ref={(element) => {
                    resumeField.ref(element);
                    fileInputRef.current = element;
                  }}
                  name={resumeField.name}
                  onBlur={resumeField.onBlur}
                  onChange={onResumeChange}
                />
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card shadow-sm">
          <CardHeader className="border-border/60 border-b pb-4">
            <div className="flex items-start gap-3">
              <span className="border-border/70 bg-background text-muted-foreground flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-medium">
                2
              </span>
              <div className="flex flex-col gap-1">
                <CardTitle className="text-lg font-medium">
                  Paste the job description
                </CardTitle>
                <CardDescription>
                  The more detail you include, the better the tailoring.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex min-h-72 flex-col gap-4 pt-6">
            <Textarea
              placeholder="Paste the full job description here — responsibilities, requirements, and preferred qualifications."
              className="bg-background min-h-56 flex-1 resize-none"
              {...register("jobDescription")}
            />
            <p className="text-muted-foreground text-xs">
              Tip: include required skills and keywords from the posting for
              stronger alignment.
            </p>
          </CardContent>
        </Card>
      </div>

      <section className="border-border/70 bg-card flex flex-col gap-3 rounded-xl border p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium">Ready to enhance?</p>
          <p className="text-muted-foreground text-xs">
            Upload a resume and add a job description to generate a tailored
            version.
          </p>
        </div>
        <Button
          className="w-full sm:w-fit"
          disabled={!hasCompleteFields}
          onClick={handleSubmit(onSubmit)}
        >
          Enhance Resume
        </Button>
      </section>
    </div>
  );
};

export default ResumeEnhancerPage;
