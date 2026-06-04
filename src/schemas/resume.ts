import z from "zod";

export const ResumeSchema = z.object({
  id: z.number(),
  name: z.string(),
  userId: z.number(),
  analysisId: z.number().nullable(),
  content: z.string(),
  createdAt: z.date(),
});
