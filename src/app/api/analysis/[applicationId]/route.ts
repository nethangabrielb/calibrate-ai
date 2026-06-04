import { MistralLanguageModelOptions, mistral } from "@ai-sdk/mistral";
import { Output, generateText } from "ai";
import { z } from "zod";

import { NextRequest, NextResponse } from "next/server";

import { isUserAuthenticated } from "@/lib/isAuthenticated";
import prisma from "@/lib/prisma";
import { ratelimit } from "@/lib/rateLimit";

import { Resume } from "@/types/resume";

export const GET = async (
  _request: NextRequest,
  { params }: { params: Promise<{ applicationId: string }> },
) => {
  const { user, isAuthenticated } = await isUserAuthenticated();

  const { applicationId } = await params;

  if (!isAuthenticated) {
    return NextResponse.json(
      {
        success: false,
        error: "User not authenticated",
        message: "You must be logged in to view analyses.",
      },
      { status: 401 },
    );
  }

  // check if user is the owner of the job application before fetching analyses
  const job = await prisma.job.findUnique({
    where: { id: Number(applicationId) },
  });

  if (!job || job.userId !== user.id) {
    return NextResponse.json(
      {
        success: false,
        error: "Unauthorized access",
        message:
          "You do not have permission to view analyses for this application.",
      },
      { status: 403 },
    );
  }

  try {
    const analyses = await prisma.analysis.findMany({
      where: { jobId: Number(applicationId) },
      include: { resumes: true },
      orderBy: { createdAt: "desc" },
    });

    if (!analyses) {
      throw new Error("Failed to fetch analyses");
    }

    return NextResponse.json(
      {
        success: true,
        data: analyses,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error,
        message: "An error occurred while fetching analyses.",
      },
      { status: 500 },
    );
  }
};

export const POST = async (
  request: NextRequest,
  { params }: { params: Promise<{ applicationId: string }> },
) => {
  const { user, isAuthenticated } = await isUserAuthenticated();

  const { applicationId } = await params;

  if (!isAuthenticated) {
    return NextResponse.json(
      {
        success: false,
        error: "User not authenticated",
        message: "You must be logged in to create analyses.",
      },
      { status: 401 },
    );
  }

  // check for rate limit
  const { success, limit, remaining, reset } = await ratelimit.limit(user.id);

  if (!success) {
    return NextResponse.json(
      {
        success,
        message: `Too many requests. Retry after ${Math.ceil((reset - Date.now()) / 1000 / 60)} minutes`,
      },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
          "Retry-After": Math.ceil((reset - Date.now()) / 1000).toString(),
        },
      },
    );
  }

  const resume = (await request
    .json()
    .then((body) => body.resume)) as Resume | null;

  if (!resume) {
    return NextResponse.json(
      {
        success: false,
        error: "Resume not provided",
        message: "You must provide a resume for analysis.",
      },
      { status: 400 },
    );
  }

  if (resume && resume.userId !== user.id) {
    return NextResponse.json(
      {
        success: false,
        error: "Unauthorized resume",
        message:
          "The provided resume does not belong to the authenticated user.",
      },
      { status: 401 },
    );
  }

  if (
    resume &&
    (typeof resume.content !== "string" || resume.content.trim().length < 10)
  ) {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid input",
        message: "Resume must be a non-empty string of at least 10 characters.",
      },
      { status: 400 },
    );
  }

  const application = await prisma.job.findUnique({
    where: {
      id: Number(applicationId),
    },
  });

  if (!application) {
    return NextResponse.json(
      {
        success: false,
        error: "Application not found",
        message: "The specified job application was not found.",
      },
      { status: 404 },
    );
  }

  if (application.userId !== user.id) {
    return NextResponse.json(
      {
        success: false,
        error: "Unauthorized",
        message: "You are unauthorized to perform this action",
      },
      { status: 401 },
    );
  }

  try {
    const { output } = await generateText({
      model: mistral("ministral-8b-latest"),
      providerOptions: {
        mistral: {
          strictJsonSchema: true,
        } satisfies MistralLanguageModelOptions,
      },
      output: Output.object({
        schema: z.object({
          score: z.number(),
          matchingSkills: z.array(z.string()),
          missingSkills: z.array(z.string()),
          recommendation: z.string(),
        }),
      }),
      prompt: `You are a precise technical recruiter. Never inflate scores. Never fabricate skills.

      Analyze the resume against the job description below and return a structured evaluation.

      <job_description>
      ${application.description}
      </job_description>

      <resume>
      ${resume?.content}
      </resume>

      Instructions:
      - Read both documents fully before scoring
      - Extract only named, concrete skills: technologies, tools, frameworks, methodologies, certifications, and domain knowledge
      - Never include soft skills (e.g. "communication", "leadership", "teamwork") unless the JD explicitly requires a certification or measurable competency
      - Never fabricate skills not present in either document

      Scoring rubric:
      - 80–100: Strong fit. Candidate meets most required and preferred qualifications
      - 60–79: Moderate fit. Core skills align but meaningful gaps exist in required qualifications
      - 40–59: Partial fit. Transferable experience present but significant skill gaps remain
      - 0–39: Weak fit. Fundamental misalignment in skills, experience level, or domain

      Return ONLY a valid JSON object. No markdown, no preamble, no explanation outside the JSON.

      {
        "score": <integer 0–100, calibrated strictly against the rubric above>,
        "matchingSkills": [
          <8–12 strings. Only skills explicitly present in BOTH the resume and JD. Ranked by relevance to the role. No duplicates, no vague categories.>
        ],
        "missingSkills": [
          <5–8 strings. Short keyword phrases, maximum 4 words each. Never full sentences. Bad: "specific mention of maintainable code implementation". Good: "Redis/caching", "design patterns", "load balancing". Only skills explicitly required or preferred in the JD.>
        ],
        "recommendation": "<4 sentences. Sentence 1: overall fit verdict and score rationale. Sentence 2: the 2–3 strongest alignment points the candidate should lead with. Sentence 3: the single most critical gap and its impact on candidacy. Sentence 4: one concrete, specific action the candidate can take before applying. Plain text only — no markdown, no asterisks, no special characters.>"
      }`,
    });

    // 5. Persist generated analysis into `prisma.analysis.create(...)`.
    try {
      const analysis = await prisma.analysis.create({
        data: {
          jobId: application.id,
          score: output.score,
          matchingSkills: output.matchingSkills,
          missingSkills: output.missingSkills,
          recommendation: output.recommendation,
          resumes: { connect: { id: resume.id } },
        },
      });

      if (!analysis) {
        return NextResponse.json(
          {
            success: false,
            message:
              "There was an issue analyzing the job application. Please try again later.",
          },
          { status: 400 },
        );
      }

      return NextResponse.json(
        {
          success: true,
          message: "Application has been successfully analyzed!",
          analysis,
        },
        { status: 201 },
      );
    } catch (error) {
      try {
        await prisma.resume.delete({ where: { id: resume?.id } }); // cleanup resume if saving analysis fails
      } catch (cleanupError) {
        console.error(
          "Failed to cleanup resume after analysis save failure:",
          cleanupError,
        );
      }
      return NextResponse.json(
        {
          success: false,
          error,
          message:
            "There was an issue saving the analysis. Please try again later.",
        },
        { status: 500 },
      );
    }
  } catch (error) {
    try {
      await prisma.resume.delete({ where: { id: resume?.id } }); // cleanup resume if analysis generation fails
    } catch (cleanupError) {
      console.error(
        "Failed to cleanup resume after analysis generation failure:",
        cleanupError,
      );
    }
    return NextResponse.json(
      {
        success: false,
        error,
        message:
          "There was an issue analyzing the job application. Please try again later.",
      },
      { status: 501 },
    );
  }
};
