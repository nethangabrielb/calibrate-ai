import z from "zod";

import { ResumeSchema } from "@/schemas/resume";

export type Resume = z.infer<typeof ResumeSchema>;
