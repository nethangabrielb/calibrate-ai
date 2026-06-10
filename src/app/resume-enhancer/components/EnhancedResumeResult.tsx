"use client";

import { ArrowLeft, Check, Copy, Download, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

import { useCallback, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface EnhancedResumeResultProps {
  enhancedResume: string;
  onReset: () => void;
}

export const EnhancedResumeResult = ({
  enhancedResume,
  onReset,
}: EnhancedResumeResultProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(enhancedResume);
      setCopied(true);
      toast.success("Resume content copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy resume.");
    }
  }, [enhancedResume]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  return (
    <div className="print-root-container flex flex-col gap-6">
      {/* print styles injection */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              /* Hide the sidebar and other screen-only utilities */
              main > div:first-child,
              .print\\:hidden,
              .no-print {
                display: none !important;
              }
              
              /* Force clean backgrounds & text colors */
              html, body, main {
                height: auto !important;
                min-height: 0 !important;
                overflow: visible !important;
                background: white !important;
                color: black !important;
              }
              
              /* Reset the parent container to display natural document layout */
              main > div:last-child {
                display: block !important;
                height: auto !important;
                overflow: visible !important;
                padding: 0 !important;
                margin: 0 !important;
              }
              
              .print-root-container {
                padding: 0 !important;
                margin: 0 !important;
                border: none !important;
                box-shadow: none !important;
                background: white !important;
              }
              
              /* Stylize the A4 preview box into a standard full-width page */
              .print-document-view {
                border: none !important;
                box-shadow: none !important;
                padding: 0 !important;
                margin: 0 !important;
                background: white !important;
                color: black !important;
                width: 100% !important;
                max-width: 100% !important;
              }

              /* Refined print typography rules */
              .print-document-view h1 {
                font-size: 20pt !important;
                font-weight: bold !important;
                color: black !important;
                text-align: center !important;
                margin-top: 0 !important;
                margin-bottom: 6pt !important;
              }
              
              .print-document-view h2 {
                font-size: 12pt !important;
                font-weight: bold !important;
                color: black !important;
                border-bottom: 1.5px solid #111 !important;
                padding-bottom: 2px !important;
                margin-top: 16pt !important;
                margin-bottom: 6pt !important;
                text-transform: uppercase !important;
                letter-spacing: 0.5px !important;
              }
              
              .print-document-view h3 {
                font-size: 10.5pt !important;
                font-weight: bold !important;
                color: black !important;
                margin-top: 8pt !important;
                margin-bottom: 2pt !important;
              }
              
              .print-document-view p,
              .print-document-view li {
                font-size: 9.5pt !important;
                line-height: 1.4 !important;
                color: #222 !important;
              }
              
              .print-document-view ul {
                list-style-type: disc !important;
                padding-left: 15px !important;
                margin-bottom: 6pt !important;
              }
              
              .print-document-view li {
                margin-bottom: 2px !important;
              }
            }
          `,
        }}
      />

      {/* action Header Panel */}
      <section className="border-border/60 flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between print:hidden">
        <div className="flex flex-col gap-1">
          <div className="text-primary flex items-center gap-2 text-xs font-semibold">
            <Sparkles className="size-3.5" />
            Resume Tailored Successfully
          </div>
          <h2 className="text-xl font-semibold">Your Tailored Resume</h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="size-4" />
            Enhance Another
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="flex items-center gap-2"
          >
            {copied ? (
              <>
                <Check className="size-4 text-green-600" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="size-4" />
                Copy Markdown
              </>
            )}
          </Button>

          <Button
            size="sm"
            onClick={handlePrint}
            className="flex items-center gap-2"
          >
            <Download className="size-4" />
            Download PDF
          </Button>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-12 print:block">
        <div className="lg:col-span-4 print:hidden">
          <Card className="border-border/70 bg-card sticky top-6 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Tips for your resume
              </CardTitle>
              <CardDescription>
                Get the most out of your generated copy.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-muted-foreground flex flex-col gap-4 text-xs leading-relaxed">
              <div className="border-primary/20 flex flex-col gap-1.5 border-l-2 pl-3">
                <p className="text-foreground font-semibold">
                  Print or Save as PDF
                </p>
                <p>
                  Click &quot;Download PDF&quot; to open the browser print
                  dialog. Make sure to set margins to default and enable
                  background graphics for best styling results.
                </p>
              </div>
              <div className="border-primary/20 flex flex-col gap-1.5 border-l-2 pl-3">
                <p className="text-foreground font-semibold">
                  Verify Your History
                </p>
                <p>
                  Our AI focuses on aligning existing roles and metrics. Be sure
                  to proofread to ensure experience lists, dates, and
                  credentials match perfectly.
                </p>
              </div>
              <div className="border-primary/20 flex flex-col gap-1.5 border-l-2 pl-3">
                <p className="text-foreground font-semibold">
                  Custom Adjustments
                </p>
                <p>
                  If you need to make quick edits, copy the raw markdown text
                  and paste it into your favorite editor or word processor.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* document View */}
        <div className="lg:col-span-8 print:col-span-12">
          <Card className="print-document-view border-border/70 bg-card mx-auto min-h-[960px] w-full max-w-[816px] rounded-sm p-8 font-sans shadow-md md:p-12">
            <article className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown
                components={{
                  h1: ({ ...props }) => (
                    <h1
                      className="text-foreground mb-3 border-b-0 pb-1 text-center text-2xl font-bold tracking-tight md:text-3xl"
                      {...props}
                    />
                  ),
                  h2: ({ ...props }) => (
                    <h2
                      className="border-border text-foreground mt-8 mb-4 border-b pb-1.5 text-lg font-semibold tracking-wide uppercase md:text-xl"
                      {...props}
                    />
                  ),
                  h3: ({ ...props }) => (
                    <h3
                      className="text-foreground mt-5 mb-1 text-sm font-semibold md:text-base"
                      {...props}
                    />
                  ),
                  p: ({ ...props }) => (
                    <p
                      className="text-foreground/90 mb-4 text-sm leading-relaxed"
                      {...props}
                    />
                  ),
                  ul: ({ ...props }) => (
                    <ul
                      className="mb-5 list-disc space-y-1.5 pl-5"
                      {...props}
                    />
                  ),
                  ol: ({ ...props }) => (
                    <ol
                      className="mb-5 list-decimal space-y-1.5 pl-5"
                      {...props}
                    />
                  ),
                  li: ({ ...props }) => (
                    <li
                      className="text-foreground/90 text-sm leading-relaxed"
                      {...props}
                    />
                  ),
                  strong: ({ ...props }) => (
                    <strong className="text-foreground font-bold" {...props} />
                  ),
                  a: ({ ...props }) => (
                    <a
                      className="text-primary hover:text-primary/80 underline"
                      {...props}
                    />
                  ),
                }}
              >
                {enhancedResume}
              </ReactMarkdown>
            </article>
          </Card>
        </div>
      </div>
    </div>
  );
};
