"use client";

import {
  Briefcase,
  Check,
  FileText,
  Loader2,
  Sparkles,
  Upload,
} from "lucide-react";

import { useEffect, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";

import { cn } from "@/lib/utils";

interface Step {
  id: number;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STEPS: Step[] = [
  {
    id: 1,
    label: "Uploading resume & extracting content",
    icon: Upload,
  },
  {
    id: 2,
    label: "Analyzing job description requirements",
    icon: Briefcase,
  },
  {
    id: 3,
    label: "Rephrasing accomplishments with AI",
    icon: Sparkles,
  },
  {
    id: 4,
    label: "Structuring tailored resume format",
    icon: FileText,
  },
];

export const ResumeEnhancerLoading = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [progress, setProgress] = useState(5);

  useEffect(() => {
    // progress increment timer
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev; // hold at 95% until finished
        // increment faster early on, then slower
        const increment = prev < 50 ? 8 : prev < 80 ? 4 : 1.5;
        return Math.min(prev + increment, 95);
      });
    }, 400);

    // step progression timer
    const stepTimers = [
      setTimeout(() => setCurrentStep(2), 2500),
      setTimeout(() => setCurrentStep(3), 5500),
      setTimeout(() => setCurrentStep(4), 9000),
    ];

    return () => {
      clearInterval(progressInterval);
      stepTimers.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
      <Card className="border-border/70 bg-card relative w-full max-w-md overflow-hidden p-8 shadow-xl">
        <div className="bg-primary/5 absolute -top-12 -right-12 -z-10 size-40 rounded-full blur-3xl" />
        <div className="bg-primary/5 absolute -bottom-12 -left-12 -z-10 size-40 rounded-full blur-3xl" />

        <CardContent className="flex flex-col items-center gap-6 p-0 text-center">
          <div className="bg-primary/10 border-primary/20 relative flex size-16 items-center justify-center rounded-full border shadow-inner">
            <Loader2 className="text-primary size-8 animate-spin" />
            <div className="bg-primary/5 absolute inset-0 animate-ping rounded-full opacity-75" />
          </div>

          <div className="flex flex-col gap-1.5">
            <h3 className="text-foreground text-lg font-medium">
              Tailoring Your Resume
            </h3>
            <p className="text-muted-foreground max-w-[280px] text-xs">
              Our AI is aligning your experience with the job description.
            </p>
          </div>

          <div className="flex w-full flex-col gap-2">
            <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
              <div
                className="bg-primary h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-muted-foreground flex justify-between text-[10px] font-medium">
              <span>Optimizing alignment</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>

          <div className="border-border/60 flex w-full flex-col gap-3.5 border-t pt-5 text-left">
            {STEPS.map((step) => {
              const Icon = step.icon;
              const isCompleted = currentStep > step.id;
              const isActive = currentStep === step.id;
              const isPending = currentStep < step.id;

              return (
                <div
                  key={step.id}
                  className={cn(
                    "flex items-center gap-3 transition-all duration-300",
                    isCompleted && "text-muted-foreground",
                    isActive && "text-foreground font-medium",
                    isPending && "text-muted-foreground/40",
                  )}
                >
                  <div
                    className={cn(
                      "flex size-7 shrink-0 items-center justify-center rounded-full border text-xs transition-colors",
                      isCompleted &&
                        "border-primary/30 bg-primary/5 text-primary",
                      isActive &&
                        "border-primary bg-background text-primary ring-primary/20 animate-pulse shadow-sm ring-2",
                      isPending &&
                        "border-border/60 bg-muted/20 text-muted-foreground/30",
                    )}
                  >
                    {isCompleted ? (
                      <Check className="size-3.5 stroke-[2.5]" />
                    ) : isActive ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Icon className="size-3.5" />
                    )}
                  </div>
                  <span className="text-xs md:text-sm">{step.label}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
