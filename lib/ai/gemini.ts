import { GoogleGenAI } from "@google/genai";

import {
  AI_ANALYSIS_JSON_SCHEMA,
  analysisResultSchema,
  type AnalysisResult
} from "@/lib/validators/analysis";
import { buildResumeReviewUserPrompt, RESUME_REVIEW_SYSTEM_PROMPT } from "@/lib/ai/prompt";
import { computeOverallScore } from "@/lib/scoring/weights";
import { ApiError } from "@/lib/utils/http";

interface AnalyzeResumeWithGeminiInput {
  resumeText: string;
  jobDescription?: string;
  tailoringMode?: boolean;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeForComparison(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getCandidateName(resumeText: string) {
  const firstLine = resumeText
    .split("\n")
    .map((line) => line.trim())
    .find(Boolean);

  if (!firstLine || firstLine.length > 80 || !/^[A-Za-z][A-Za-z\s.'-]+$/.test(firstLine)) {
    return "";
  }

  return firstLine;
}

function scrubUngroundedNameReferences(text: string, resumeText: string) {
  const candidateName = getCandidateName(resumeText);

  return text.replace(
    /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2})'s resume\b/g,
    (match, referencedName) => {
      if (
        normalizeForComparison(referencedName) === normalizeForComparison(candidateName)
      ) {
        return match;
      }

      if (normalizeForComparison(resumeText).includes(normalizeForComparison(referencedName))) {
        return match;
      }

      return "The candidate's resume";
    }
  );
}

function getConfiguredApiKey() {
  return process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY ?? "";
}

function getModelName() {
  return process.env.GOOGLE_MODEL ?? process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
}

export function hasGeminiApiKey() {
  return Boolean(getConfiguredApiKey());
}

function getClient() {
  const apiKey = getConfiguredApiKey();

  if (!apiKey) {
    throw new ApiError(
      500,
      "Missing GEMINI_API_KEY or GOOGLE_API_KEY. Add one to your environment before running live AI analysis."
    );
  }

  return new GoogleGenAI({ apiKey });
}

function stripCodeFences(raw: string) {
  return raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

function extractJsonCandidate(raw: string) {
  const stripped = stripCodeFences(raw);
  const firstBrace = stripped.indexOf("{");
  const lastBrace = stripped.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    return stripped;
  }

  return stripped.slice(firstBrace, lastBrace + 1);
}

function dedupeStrings(values: string[]) {
  return Array.from(
    new Set(
      values
        .map((value) => value.trim())
        .filter(Boolean)
    )
  );
}

function clampScore(value: unknown) {
  const parsed =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number.parseFloat(value)
        : Number.NaN;

  if (!Number.isFinite(parsed)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(parsed)));
}

function coerceLine(value: unknown, fallback = "") {
  const normalized = typeof value === "string" ? value.trim() : fallback;
  return normalized.slice(0, 320).trim() || fallback;
}

function coerceParagraph(
  value: unknown,
  fallback = "Grounded analysis generated from the extracted resume text."
) {
  const normalized = typeof value === "string" ? value.trim() : fallback;
  return normalized.slice(0, 1800).trim() || fallback;
}

function coerceStringArray(value: unknown, maxItems: number) {
  if (!Array.isArray(value)) {
    return [];
  }

  return dedupeStrings(
    value
      .map((item) => {
        if (typeof item === "string") {
          return item;
        }

        if (typeof item === "number" || typeof item === "boolean") {
          return String(item);
        }

        return "";
      })
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => item.slice(0, 320).trim())
      .filter(Boolean)
  ).slice(0, maxItems);
}

function coerceAnalysisDraft(raw: unknown, hasJobDescription: boolean) {
  const draft = isRecord(raw) ? raw : {};
  const categoryScores = isRecord(draft.categoryScores) ? draft.categoryScores : {};
  const jobMatchAnalysis = isRecord(draft.jobMatchAnalysis)
    ? draft.jobMatchAnalysis
    : {};

  return analysisResultSchema.parse({
    overallScore: clampScore(draft.overallScore),
    summary: coerceParagraph(
      draft.summary,
      "Grounded analysis generated from the extracted resume text."
    ),
    categoryScores: {
      content: clampScore(categoryScores.content),
      formatting: clampScore(categoryScores.formatting),
      ats: clampScore(categoryScores.ats),
      experience: clampScore(categoryScores.experience),
      skills: clampScore(categoryScores.skills),
      grammar: clampScore(categoryScores.grammar),
      jobMatch: hasJobDescription ? clampScore(categoryScores.jobMatch) : 0
    },
    strengths: coerceStringArray(draft.strengths, 8),
    weaknesses: coerceStringArray(draft.weaknesses, 8),
    missingSections: coerceStringArray(draft.missingSections, 8),
    atsIssues: coerceStringArray(draft.atsIssues, 8),
    keywordSuggestions: coerceStringArray(draft.keywordSuggestions, 10),
    formattingSuggestions: coerceStringArray(draft.formattingSuggestions, 8),
    grammarSuggestions: coerceStringArray(draft.grammarSuggestions, 8),
    bulletPointImprovements: Array.isArray(draft.bulletPointImprovements)
      ? draft.bulletPointImprovements
          .map((item) => {
            const normalizedItem = isRecord(item) ? item : {};
            const original = coerceLine(normalizedItem.original);
            const improved = coerceLine(normalizedItem.improved);
            const reason = coerceLine(normalizedItem.reason);

            if (!original || !improved || !reason) {
              return null;
            }

            return {
              original,
              improved,
              reason
            };
          })
          .filter((item): item is NonNullable<typeof item> => Boolean(item))
          .slice(0, 8)
      : [],
    sectionFeedback: Array.isArray(draft.sectionFeedback)
      ? draft.sectionFeedback
          .map((item) => {
            const normalizedItem = isRecord(item) ? item : {};
            const section = coerceLine(normalizedItem.section, "General");
            const feedback = coerceParagraph(
              normalizedItem.feedback,
              "No grounded section-level explanation was returned for this section."
            );

            return {
              section,
              score: clampScore(normalizedItem.score),
              feedback,
              suggestions: coerceStringArray(normalizedItem.suggestions, 6)
            };
          })
          .slice(0, 10)
      : [],
    jobMatchAnalysis: {
      matchedKeywords: hasJobDescription
        ? coerceStringArray(jobMatchAnalysis.matchedKeywords, 20)
        : [],
      missingKeywords: hasJobDescription
        ? coerceStringArray(jobMatchAnalysis.missingKeywords, 20)
        : [],
      fitSummary: hasJobDescription
        ? coerceParagraph(
            jobMatchAnalysis.fitSummary,
            "A target job description was provided, but the AI response did not return a reliable fit summary."
          )
        : "No job description provided; role-fit was not evaluated."
    },
    finalRecommendations: coerceStringArray(draft.finalRecommendations, 8)
  });
}

function getOutputText(outputText: string | undefined) {
  if (!outputText?.trim()) {
    throw new ApiError(
      502,
      "The Gemini response did not include a structured analysis payload."
    );
  }

  return outputText;
}

function toApiError(
  error: unknown,
  fallbackMessage: string,
  fallbackStatus = 502
) {
  if (error instanceof ApiError) {
    return error;
  }

  const maybeError = error as { message?: string; status?: number };

  return new ApiError(
    typeof maybeError?.status === "number"
      ? maybeError.status
      : fallbackStatus,
    maybeError?.message || fallbackMessage
  );
}

function normalizeAnalysis(
  draft: AnalysisResult,
  hasJobDescription: boolean,
  resumeText: string
): AnalysisResult {
  const matchedKeywords = dedupeStrings(draft.jobMatchAnalysis.matchedKeywords);
  const normalizedResumeText = normalizeForComparison(resumeText);

  const normalizedJobMatch = hasJobDescription
    ? {
        matchedKeywords,
        missingKeywords: dedupeStrings(
          draft.jobMatchAnalysis.missingKeywords
        ).filter(
          (keyword) => !matchedKeywords.includes(keyword)
        ),
        fitSummary: draft.jobMatchAnalysis.fitSummary.trim()
      }
    : {
        matchedKeywords: [],
        missingKeywords: [],
        fitSummary: "No job description provided; role-fit was not evaluated."
      };

  const categoryScores = {
    ...draft.categoryScores,
    jobMatch: hasJobDescription ? draft.categoryScores.jobMatch : 0
  };

  return analysisResultSchema.parse({
    ...draft,
    overallScore: computeOverallScore(categoryScores, hasJobDescription),
    categoryScores,
    summary: scrubUngroundedNameReferences(draft.summary.trim(), resumeText),
    strengths: dedupeStrings(draft.strengths),
    weaknesses: dedupeStrings(draft.weaknesses),
    missingSections: dedupeStrings(draft.missingSections),
    atsIssues: dedupeStrings(draft.atsIssues),
    keywordSuggestions: dedupeStrings(draft.keywordSuggestions),
    formattingSuggestions: dedupeStrings(draft.formattingSuggestions),
    grammarSuggestions: dedupeStrings(draft.grammarSuggestions),
    bulletPointImprovements: draft.bulletPointImprovements.filter((item) =>
      normalizedResumeText.includes(normalizeForComparison(item.original))
    ),
    finalRecommendations: dedupeStrings(draft.finalRecommendations),
    sectionFeedback: draft.sectionFeedback.map((section) => ({
      ...section,
      feedback: scrubUngroundedNameReferences(section.feedback, resumeText)
    })),
    jobMatchAnalysis: {
      ...normalizedJobMatch,
      fitSummary: scrubUngroundedNameReferences(
        normalizedJobMatch.fitSummary,
        resumeText
      )
    }
  });
}

async function requestStructuredAnalysis(
  client: GoogleGenAI,
  input: AnalyzeResumeWithGeminiInput
) {
  try {
    const response = await client.models.generateContent({
      model: getModelName(),
      contents: buildResumeReviewUserPrompt(input),
      config: {
        systemInstruction: RESUME_REVIEW_SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseJsonSchema: AI_ANALYSIS_JSON_SCHEMA
      }
    });

    return getOutputText(response.text);
  } catch (error) {
    throw toApiError(
      error,
      "Gemini could not generate a resume analysis right now."
    );
  }
}

async function repairStructuredAnalysis(
  client: GoogleGenAI,
  rawOutput: string,
  hasJobDescription: boolean
) {
  const repairPrompt = `
Repair the following model output into valid JSON that matches the provided schema exactly.

Rules:
- Return JSON only.
- Preserve the original meaning.
- Do not add unsupported keys.
- If a field is missing, fill it conservatively.
- If no job description was provided, set categoryScores.jobMatch to 0, matchedKeywords to [], missingKeywords to [], and fitSummary to "No job description provided; role-fit was not evaluated."

Original output:
"""
${rawOutput}
"""

Job description provided: ${hasJobDescription ? "yes" : "no"}
`.trim();

  try {
    const response = await client.models.generateContent({
      model: getModelName(),
      contents: repairPrompt,
      config: {
        systemInstruction:
          "You repair malformed structured outputs. Return JSON only and match the schema exactly.",
        responseMimeType: "application/json",
        responseJsonSchema: AI_ANALYSIS_JSON_SCHEMA
      }
    });

    return getOutputText(response.text);
  } catch (error) {
    throw toApiError(
      error,
      "Gemini could not repair the analysis response.",
      500
    );
  }
}

function parseStructuredOutput(rawOutput: string, hasJobDescription: boolean) {
  const candidate = extractJsonCandidate(rawOutput);
  return coerceAnalysisDraft(JSON.parse(candidate), hasJobDescription);
}

export async function analyzeResumeWithGemini(
  input: AnalyzeResumeWithGeminiInput
): Promise<AnalysisResult> {
  const client = getClient();
  const hasJobDescription = Boolean(input.jobDescription?.trim());

  const firstPass = await requestStructuredAnalysis(client, input);

  try {
    return normalizeAnalysis(
      parseStructuredOutput(firstPass, hasJobDescription),
      hasJobDescription,
      input.resumeText
    );
  } catch (initialError) {
    const repaired = await repairStructuredAnalysis(
      client,
      firstPass,
      hasJobDescription
    );

    try {
      return normalizeAnalysis(
        parseStructuredOutput(repaired, hasJobDescription),
        hasJobDescription,
        input.resumeText
      );
    } catch {
      throw new ApiError(
        502,
        "The Gemini API returned an invalid analysis payload. Please try again.",
        initialError instanceof Error ? initialError.message : undefined
      );
    }
  }
}
