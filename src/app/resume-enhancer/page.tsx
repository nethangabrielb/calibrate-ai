"use client";

import { FileText, Sparkles, Upload } from "lucide-react";

import { useRef } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const ResumeEnhancerPage = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const uploadHandler = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex h-full min-h-0 w-full min-w-0 flex-col gap-6 bg-background px-8 py-4 text-foreground">
      <section className="flex flex-col gap-3">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border/70 bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          <Sparkles className="size-3.5 text-primary" />
          AI-powered resume tailoring
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-medium">Resume Enhancer</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Upload your resume and paste a job description. We&apos;ll help you
            reshape your experience so it reads stronger for that specific role.
          </p>
        </div>
      </section>

      <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-2">
        <Card className="border-border/70 bg-card shadow-sm">
          <CardHeader className="border-b border-border/60 pb-4">
            <div className="flex items-start gap-3">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-border/70 bg-background text-xs font-medium text-muted-foreground">
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
            <button
              type="button"
              onClick={uploadHandler}
              className={cn(
                "group flex w-full flex-col items-center gap-4 rounded-xl border border-dashed border-border/80 bg-muted/20 px-6 py-10 text-center transition-colors",
                "hover:border-primary/40 hover:bg-muted/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              )}
            >
              <div className="flex size-12 items-center justify-center rounded-full border border-border/70 bg-background shadow-sm transition-colors group-hover:border-primary/30">
                <Upload className="size-5 text-muted-foreground transition-colors group-hover:text-primary" />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-foreground">
                  Click to upload your resume
                </p>
                <p className="text-xs text-muted-foreground">
                  PDF only · up to 5 MB
                </p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background px-3 py-1 text-xs text-muted-foreground">
                <FileText className="size-3.5" />
                No file selected
              </span>
            </button>
            <input
              type="file"
              className="sr-only"
              accept=".pdf"
              ref={fileInputRef}
            />
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card shadow-sm">
          <CardHeader className="border-b border-border/60 pb-4">
            <div className="flex items-start gap-3">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-border/70 bg-background text-xs font-medium text-muted-foreground">
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
              className="min-h-56 flex-1 resize-none bg-background"
            />
            <p className="text-xs text-muted-foreground">
              Tip: include required skills and keywords from the posting for
              stronger alignment.
            </p>
          </CardContent>
        </Card>
      </div>

      <section className="flex flex-col gap-3 rounded-xl border border-border/70 bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium">Ready to enhance?</p>
          <p className="text-xs text-muted-foreground">
            Upload a resume and add a job description to generate a tailored
            version.
          </p>
        </div>
        <Button className="w-full sm:w-fit" disabled>
          Enhance Resume
        </Button>
      </section>
    </div>
  );
};

export default ResumeEnhancerPage;
