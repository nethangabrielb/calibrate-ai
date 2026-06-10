import { mistral } from "@ai-sdk/mistral";
import { generateText } from "ai";

import { NextRequest, NextResponse } from "next/server";

import { isUserAuthenticated } from "@/lib/isAuthenticated";
import { ratelimit } from "@/lib/rateLimit";

export const POST = async (request: NextRequest) => {
  const { user, isAuthenticated } = await isUserAuthenticated();

  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  //Check rate limit before calling the LLM (same pattern as analysis route).
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

  const { resume, jobDescription } = (await request.json()) as {
    resume: string;
    jobDescription: string;
  };

  if (!resume || !jobDescription) {
    return NextResponse.json(
      {
        success: false,
        error: "Missing required fields",
        message: "You must provide a resume and job description to enhance.",
      },
      { status: 400 },
    );
  }

  if (typeof resume !== "string" || resume.trim().length < 10) {
    return NextResponse.json(
      {
        success: false,
        message: "Resume must be a non-empty string of at least 10 characters.",
      },
      { status: 400 },
    );
  }

  if (typeof jobDescription !== "string" || jobDescription.trim().length < 10) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Job description must be a non-empty string of at least 10 characters.",
      },
      { status: 400 },
    );
  }

  try {
    const { text } = await generateText({
      model: mistral("ministral-8b-latest"),
      prompt: `
        You are an expert resume writer. Rewrite the resume below to better align with the job description.
        Emphasize relevant skills and experience, rephrase bullet points for impact, and naturally incorporate
        keywords from the JD where truthful. Do not fabricate experience, skills, or credentials.
    
        <job_description>
        ${jobDescription}
        </job_description>
    
        <resume>
        ${resume}
        </resume>

        Formatting rules:
        - Use a single # for the candidate's name
        - Use ## for major sections (Technical Skills, Professional Experience, Projects, Education, etc.)
        - For the Technical Skills section, use a markdown table with two columns: Category and Technologies. Example:
          | Category | Technologies |
          |----------|-------------|
          | Languages | TypeScript, JavaScript, PHP |
          | Frontend | React, Next.js, Tailwind CSS |
        - For experience and project entries, use ### for the role/project title line, followed by bullet points
        - Each bullet point should be one concise line, max 20 words
        - No filler phrases, no repetition

        Constraints:
        - Keep the total output between 400 and 550 words — enough to fill one A4 page without overflow
        - Do NOT include a "Key Achievements" or summary section at the bottom — end with Education
    
        Return ONLY the rewritten resume in Markdown. No preamble, no explanation, no markdown fences.
      `,
    });

    // FUTURE: Optionally persist the enhanced resume (prisma.resume.update).

    // Return the enhanced resume in the response.
    const formatted = text.replace(/\\n/g, "\n");
    return NextResponse.json(
      { success: true, data: formatted },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        message: "An error occurred while enhancing the resume.",
      },
      { status: 500 },
    );
  }
};
