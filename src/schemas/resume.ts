import z from "zod";

export const ResumeSchema = z.object({
  id: z.number(),
  name: z.string(),
  userId: z.number(),
  analysisId: z.number().nullable(),
  content: z.string(),
  createdAt: z.date(),
});

export const ResumeInputSchema = z.object({
  resume: z
    .instanceof(FileList)
    .refine((files: FileList) => files[0]?.type === "application/pdf", {
      message: "Only PDF files are accepted.",
    })
    .refine((files: FileList) => files[0]?.size < 5 * 1024 * 1024, {
      message: "File size must be less than 5MB.",
    })
    .refine(
      async (files: FileList) => {
        const res = await fetch(
          `/api/resume/check-name?resumeName=${files[0]?.name}`,
        );
        const { exists } = await res.json();
        return !exists;
      },
      {
        message: "Resume with this name already exists.",
      },
    )
    .nullable(),
  resumeName: z
    .string()
    .max(50, { message: "New file name must be less than 50 characters." })
    .trim()
    .transform((val) => (val === "" ? undefined : val))
    .optional(),
});
