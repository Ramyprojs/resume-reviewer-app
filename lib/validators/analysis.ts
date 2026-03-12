import { z } from "zod";

const scoreSchema = z.number().finite().min(0).max(100);
const shortLineSchema = z.string().trim().min(1).max(320);
const paragraphSchema = z.string().trim().min(1).max(1800);

export const categoryScoresSchema = z
  .object({
    content: scoreSchema,
    formatting: scoreSchema,
    ats: scoreSchema,
    experience: scoreSchema,
    skills: scoreSchema,
    grammar: scoreSchema,
    jobMatch: scoreSchema
  })
  .strict();

export const bulletPointImprovementSchema = z
  .object({
    original: shortLineSchema,
    improved: shortLineSchema,
    reason: shortLineSchema
  })
  .strict();

export const sectionFeedbackSchema = z
  .object({
    section: shortLineSchema,
    score: scoreSchema,
    feedback: paragraphSchema,
    suggestions: z.array(shortLineSchema).max(6)
  })
  .strict();

export const jobMatchAnalysisSchema = z
  .object({
    matchedKeywords: z.array(shortLineSchema).max(20),
    missingKeywords: z.array(shortLineSchema).max(20),
    fitSummary: paragraphSchema
  })
  .strict();

export const analysisResultSchema = z
  .object({
    overallScore: scoreSchema,
    summary: paragraphSchema,
    categoryScores: categoryScoresSchema,
    strengths: z.array(shortLineSchema).max(8),
    weaknesses: z.array(shortLineSchema).max(8),
    missingSections: z.array(shortLineSchema).max(8),
    atsIssues: z.array(shortLineSchema).max(8),
    keywordSuggestions: z.array(shortLineSchema).max(10),
    formattingSuggestions: z.array(shortLineSchema).max(8),
    grammarSuggestions: z.array(shortLineSchema).max(8),
    bulletPointImprovements: z.array(bulletPointImprovementSchema).max(8),
    sectionFeedback: z.array(sectionFeedbackSchema).max(10),
    jobMatchAnalysis: jobMatchAnalysisSchema,
    finalRecommendations: z.array(shortLineSchema).max(8)
  })
  .strict();

export const analyzeResumeResponseSchema = z
  .object({
    id: z.string().min(1),
    source: z
      .object({
        type: z.enum(["file", "text"]),
        fileName: z.string().min(1).optional()
      })
      .strict(),
    parsing: z
      .object({
        extractedCharacters: z.number().int().min(0),
        detectedMimeType: z.string().min(1).optional(),
        usedFallbackText: z.boolean()
      })
      .strict(),
    warning: z.string().min(1).optional(),
    resumeTextUsed: z.string().min(1).optional(),
    weights: z
      .object({
        content: z.number().min(0).max(1),
        experience: z.number().min(0).max(1),
        ats: z.number().min(0).max(1),
        skills: z.number().min(0).max(1),
        formatting: z.number().min(0).max(1),
        grammar: z.number().min(0).max(1),
        jobMatch: z.number().min(0).max(1)
      })
      .strict(),
    result: analysisResultSchema
  })
  .strict();

export type CategoryScores = z.infer<typeof categoryScoresSchema>;
export type AnalysisResult = z.infer<typeof analysisResultSchema>;
export type AnalyzeResumeResponse = z.infer<typeof analyzeResumeResponseSchema>;

export const AI_ANALYSIS_JSON_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "overallScore",
    "summary",
    "categoryScores",
    "strengths",
    "weaknesses",
    "missingSections",
    "atsIssues",
    "keywordSuggestions",
    "formattingSuggestions",
    "grammarSuggestions",
    "bulletPointImprovements",
    "sectionFeedback",
    "jobMatchAnalysis",
    "finalRecommendations"
  ],
  properties: {
    overallScore: {
      type: "number",
      minimum: 0,
      maximum: 100
    },
    summary: {
      type: "string"
    },
    categoryScores: {
      type: "object",
      additionalProperties: false,
      required: [
        "content",
        "formatting",
        "ats",
        "experience",
        "skills",
        "grammar",
        "jobMatch"
      ],
      properties: {
        content: { type: "number", minimum: 0, maximum: 100 },
        formatting: { type: "number", minimum: 0, maximum: 100 },
        ats: { type: "number", minimum: 0, maximum: 100 },
        experience: { type: "number", minimum: 0, maximum: 100 },
        skills: { type: "number", minimum: 0, maximum: 100 },
        grammar: { type: "number", minimum: 0, maximum: 100 },
        jobMatch: { type: "number", minimum: 0, maximum: 100 }
      }
    },
    strengths: {
      type: "array",
      items: { type: "string" }
    },
    weaknesses: {
      type: "array",
      items: { type: "string" }
    },
    missingSections: {
      type: "array",
      items: { type: "string" }
    },
    atsIssues: {
      type: "array",
      items: { type: "string" }
    },
    keywordSuggestions: {
      type: "array",
      items: { type: "string" }
    },
    formattingSuggestions: {
      type: "array",
      items: { type: "string" }
    },
    grammarSuggestions: {
      type: "array",
      items: { type: "string" }
    },
    bulletPointImprovements: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["original", "improved", "reason"],
        properties: {
          original: { type: "string" },
          improved: { type: "string" },
          reason: { type: "string" }
        }
      }
    },
    sectionFeedback: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["section", "score", "feedback", "suggestions"],
        properties: {
          section: { type: "string" },
          score: { type: "number", minimum: 0, maximum: 100 },
          feedback: { type: "string" },
          suggestions: {
            type: "array",
            items: { type: "string" }
          }
        }
      }
    },
    jobMatchAnalysis: {
      type: "object",
      additionalProperties: false,
      required: ["matchedKeywords", "missingKeywords", "fitSummary"],
      properties: {
        matchedKeywords: {
          type: "array",
          items: { type: "string" }
        },
        missingKeywords: {
          type: "array",
          items: { type: "string" }
        },
        fitSummary: { type: "string" }
      }
    },
    finalRecommendations: {
      type: "array",
      items: { type: "string" }
    }
  }
} as const;
