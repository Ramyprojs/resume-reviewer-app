import { z } from "zod";

export const MAX_FILE_BYTES = 5 * 1024 * 1024;
export const MAX_RESUME_TEXT_CHARS = 22_000;
export const MAX_JOB_DESCRIPTION_CHARS = 18_000;
export const MIN_RESUME_TEXT_CHARS = 120;

export const analyzeResumeFieldsSchema = z
  .object({
    resumeText: z.string().trim().max(MAX_RESUME_TEXT_CHARS).optional().default(""),
    jobDescription: z
      .string()
      .trim()
      .max(MAX_JOB_DESCRIPTION_CHARS)
      .optional()
      .default(""),
    tailorMode: z.boolean().default(false),
    demoMode: z.boolean().default(false)
  })
  .strict();

export type AnalyzeResumeFields = z.infer<typeof analyzeResumeFieldsSchema>;

