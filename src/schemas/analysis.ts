import z from "zod";

import { ResumeSchema } from "@/schemas/resume";

export const AnalysisSchema = z.object({
  id: z.number(),
  jobId: z.number(),
  score: z.float64(),
  matchingSkills: z.array(z.string()),
  missingSkills: z.array(z.string()),
  recommendation: z.string(),
  createdAt: z.date(),
  resumes: z.array(ResumeSchema),
});
