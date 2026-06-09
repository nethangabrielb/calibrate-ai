import z from "zod";

import {
  EnhancedResumeInputSchema,
  ResumeInputSchema,
  ResumeSchema,
} from "@/schemas/resume";

export type Resume = z.infer<typeof ResumeSchema>;
export type ResumeInput = z.infer<typeof ResumeInputSchema>;
export type EnhancedResumeInput = z.infer<typeof EnhancedResumeInputSchema>;
