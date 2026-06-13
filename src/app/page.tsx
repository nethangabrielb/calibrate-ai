import {
  ArrowRight,
  BarChart3,
  ClipboardList,
  History,
  Search,
  Sparkles,
  Target,
  Upload,
} from "lucide-react";

import Link from "next/link";
import { headers } from "next/headers";

import { SignOutButton } from "@/components/sign-out-button";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { auth } from "@/lib/auth";

const features = [
  {
    icon: ClipboardList,
    title: "Track everything",
    description:
      "Log company, role, salary, status, description, and key links in one searchable, paginated dashboard.",
  },
  {
    icon: Upload,
    title: "PDF Resume Parsing",
    description:
      "Upload your resume in PDF format to instantly parse and extract text without manually copy-pasting.",
  },
  {
    icon: Target,
    title: "AI Fit Analysis",
    description:
      "Compare your resume against any job description to get a calibrated match score, skill breakdown, and specific advice.",
  },
  {
    icon: Sparkles,
    title: "AI Resume Enhancer",
    description:
      "Optimize and rewrite your resume points to target specific job descriptions with real-time markdown rendering.",
  },
  {
    icon: History,
    title: "Versioning & History",
    description:
      "Save multiple resume versions per application, view your version timeline, and compare changes side-by-side.",
  },
  {
    icon: BarChart3,
    title: "Trend Visualization",
    description:
      "Visualize your application pipeline metrics and follow your resume score trend progression over time.",
  },
];

const steps = [
  {
    number: "01",
    icon: ClipboardList,
    title: "Add a job application",
    description:
      "Enter the company, title, description, and salary to log the role in your pipeline.",
  },
  {
    number: "02",
    icon: Upload,
    title: "Upload & analyze resume",
    description:
      "Upload your PDF resume. The AI runs a calibrated analysis comparing your qualifications to the job description.",
  },
  {
    number: "03",
    icon: Sparkles,
    title: "Tailor with AI guidance",
    description:
      "Identify skill gaps and use the AI enhancer to optimize your bullet points, tailoring your application for maximum fit.",
  },
  {
    number: "04",
    icon: History,
    title: "Iterate and track progress",
    description:
      "Save new resume versions as you edit, visualize score progression, and compare versions side-by-side before submitting.",
  },
];

const Home = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user || null;

  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      {/* Navigation */}
      <header className="border-b border-border">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <Link href="/">
            <img
              src="/calibrate_inverted.svg"
              alt="Calibrate AI"
              className="h-7"
            />
          </Link>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <span className="mr-2 hidden text-sm text-muted-foreground sm:inline">
                  Logged in as {user.email}
                </span>
                <Button asChild size="sm" variant="outline">
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <SignOutButton />
              </>
            ) : (
              <>
                <Button asChild size="sm" variant="ghost">
                  <Link href="/login">Log in</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/sign-up">Sign up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="flex flex-col items-center px-6 pt-28 pb-20 text-center sm:pt-36">
        <h1 className="max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
          Know where you stand before you apply.
        </h1>
        <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
          Calibrate tracks your job applications and uses AI to measure how well
          your resume fits each role — so you can focus on the ones worth your
          time.
        </p>
        <div className="mt-10 flex gap-3">
          {user ? (
            <Button asChild size="lg">
              <Link href="/dashboard">
                Go to Dashboard
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <>
              <Button asChild size="lg">
                <Link href="/sign-up">
                  Start tracking
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/login">Log in</Link>
              </Button>
            </>
          )}
        </div>
      </section>      {/* What it does */}
      <section className="border-t border-border px-6 py-16 sm:py-20">
        <div className="mx-auto grid max-w-5xl gap-10 sm:grid-cols-3 sm:gap-8 sm:gap-y-12">
          {features.map((feature) => (
            <div key={feature.title}>
              <feature.icon className="h-5 w-5 text-primary" />
              <h3 className="mt-3 text-sm font-medium">{feature.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-border px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-center text-lg font-semibold tracking-tight sm:text-xl">
            How it works
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Four steps. No setup, no integrations, no credit card.
          </p>

          <div className="mt-12 space-y-10">
            {steps.map((step, i) => (
              <div key={step.number} className="flex gap-5">
                <div className="flex flex-col items-center">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-xs font-medium text-muted-foreground">
                    {step.number}
                  </div>
                  {i < steps.length - 1 && (
                    <div className="mt-2 h-full w-px bg-border" />
                  )}
                </div>
                <div className="pb-2">
                  <h3 className="text-sm font-medium">{step.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What the AI actually tells you */}
      <section className="border-t border-border px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
            What the AI actually tells you
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            No vague advice. Every analysis returns structured, actionable data.
          </p>
        </div>
        <div className="mx-auto mt-10 grid max-w-3xl gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
          <div className="bg-background p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-primary">
              Fit score
            </p>
            <p className="mt-1.5 text-sm text-muted-foreground">
              A number from 0–100 based on how well your skills match the job
              requirements. Calibrated against a strict rubric — not inflated.
            </p>
          </div>
          <div className="bg-background p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-primary">
              Matching skills
            </p>
            <p className="mt-1.5 text-sm text-muted-foreground">
              The specific technologies, tools, and qualifications that appear in
              both your resume and the job description, ranked by relevance.
            </p>
          </div>
          <div className="bg-background p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-primary">
              Missing skills
            </p>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Concrete skill gaps the job requires that your resume
              doesn&apos;t cover — so you know exactly what to address.
            </p>
          </div>
          <div className="bg-background p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-primary">
              Recommendation
            </p>
            <p className="mt-1.5 text-sm text-muted-foreground">
              A plain-English summary: your strongest points to lead with, the
              most critical gap, and one specific action to take before applying.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Spotlight Section */}
      <section className="border-t border-border px-6 py-16 sm:py-20 bg-muted/30">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
              Optimize your application workflow
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Don&apos;t just analyze compatibility. Address the gaps and iterate.
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <div className="flex flex-col rounded-xl border border-border bg-background p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold">AI Resume Enhancer</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Optimize and rewrite your resume bullet points using advanced LLM guidance targeting the job&apos;s missing skills. Formats in clean markdown with instant side-by-side previews and custom print-friendly layouts.
              </p>
            </div>
            <div className="flex flex-col rounded-xl border border-border bg-background p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <History className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold">Version History & Comparison</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Track your revisions with timeline tracking. Plot your score trends over time with interactive progression charts, and compare any two resume versions side-by-side to review changes before you submit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="border-t border-border px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-md text-center">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            Stop guessing. Start calibrating.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Free to use. Takes under a minute to get your first analysis.
          </p>
          <div className="mt-8">
            {user ? (
              <Button asChild size="lg">
                <Link href="/dashboard">
                  Go to Dashboard
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button asChild size="lg">
                <Link href="/sign-up">
                  Create your account
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-border px-6 py-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Calibrate AI</p>
          <p>Made with ❤️ by nethangabrielb</p>
          <div className="flex gap-3">
            <Link
              href="/privacy-policy"
              className="transition-colors hover:text-foreground"
            >
              Privacy
            </Link>
            <Link
              href="/terms-of-service"
              className="transition-colors hover:text-foreground"
            >
              Terms
            </Link>
            <Separator orientation="vertical" className="h-3 self-center" />
            <a
              href="https://github.com/nethangabrielb/calibrate"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/nethangabrielb"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
