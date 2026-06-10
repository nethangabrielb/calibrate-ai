"use client";

import { ArrowLeft, Check, Copy, Download, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
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
              /* Remove browser's default headers (date/title) and footers (URL/page numbers) by setting margin to 0 */
              @page {
                size: A4;
                margin: 0;
              }

              /* Hide the sidebar, top navigation bar and other screen-only utilities */
              main > :not(:last-child),
              .print\\:hidden,
              .no-print {
                display: none !important;
              }
              
              /* Reset body and html layout to flow naturally across printed pages */
              html, body, main {
                height: auto !important;
                min-height: 0 !important;
                overflow: visible !important;
                background: white !important;
                color: black !important;
                margin: 0 !important;
              }
              
              /* Apply standard page margins directly to the body as padding */
              body {
                padding: 12mm 15mm !important;
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
              
              /* Remove the shadow, border and screen constraints from the document view card */
              .print-document-view {
                border: none !important;
                box-shadow: none !important;
                padding: 0 !important;
                margin: 0 !important;
                background: white !important;
                color: black !important;
                width: 100% !important;
                max-width: 100% !important;
                min-height: 0 !important;
              }

              /* Print typography — match screen look but compact for single page */
              .print-document-view h1 {
                font-size: 22pt !important;
                margin-top: 0 !important;
                margin-bottom: 4pt !important;
              }

              .print-document-view h2 {
                font-size: 12pt !important;
                margin-top: 14pt !important;
                margin-bottom: 4pt !important;
              }

              .print-document-view h3 {
                font-size: 10pt !important;
                margin-top: 6pt !important;
                margin-bottom: 2pt !important;
              }

              .print-document-view p {
                font-size: 9pt !important;
                line-height: 1.35 !important;
                margin-bottom: 3pt !important;
              }

              .print-document-view ul,
              .print-document-view ol {
                margin-bottom: 3pt !important;
                padding-left: 14px !important;
              }

              .print-document-view li {
                font-size: 9pt !important;
                line-height: 1.35 !important;
                margin-bottom: 1pt !important;
              }

              .print-document-view table {
                font-size: 9pt !important;
              }

              .print-document-view th,
              .print-document-view td {
                padding: 2pt 6pt !important;
              }
              /* Center the contact info line (first p right after the name h1) */
              .print-document-view h1 + p {
                text-align: center !important;
              }
            }

            /* Screen: center contact info line under the name */
            .print-document-view h1 + p {
              text-align: center;
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
                remarkPlugins={[remarkGfm]}
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
                  table: ({ ...props }) => (
                    <table
                      className="text-foreground/90 mb-4 w-full border-collapse text-sm"
                      {...props}
                    />
                  ),
                  thead: ({ ...props }) => (
                    <thead className="sr-only" {...props} />
                  ),
                  th: ({ ...props }) => (
                    <th
                      className="text-foreground px-3 py-1.5 text-left text-xs font-semibold uppercase tracking-wider"
                      {...props}
                    />
                  ),
                  td: ({ ...props }) => (
                    <td
                      className="border-border/40 text-foreground/90 border-b px-3 py-1.5 text-sm"
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
