import z from "zod";

import { ResumeInputSchema, ResumeSchema } from "@/schemas/resume";

export type Resume = z.infer<typeof ResumeSchema>;
export type ResumeInput = z.infer<typeof ResumeInputSchema>;
