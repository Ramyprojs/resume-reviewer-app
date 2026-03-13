import { NextRequest, NextResponse } from "next/server";

import { analyzeResumeWithGemini, hasGeminiApiKey } from "@/lib/ai/gemini";
import { analyzeResumeLocally } from "@/lib/ai/local-analysis";
import { cleanJobDescription, cleanResumeText } from "@/lib/parsers/text-cleaner";
import { parseResumeFile } from "@/lib/parsers/resume-parser";
import { getScoreWeights } from "@/lib/scoring/weights";
import { DEMO_ANALYSIS_RESULT } from "@/lib/utils/demo-content";
import { ApiError, jsonErrorResponse } from "@/lib/utils/http";
import {
  enforceRateLimit,
  getRequestFingerprint
} from "@/lib/utils/rate-limit";
import {
  analyzeResumeResponseSchema
} from "@/lib/validators/analysis";
import {
  analyzeResumeFieldsSchema,
  MIN_RESUME_TEXT_CHARS
} from "@/lib/validators/resume";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getStringField(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value : "";
}

function getGeminiFallbackWarning(error: unknown) {
  if (!(error instanceof Error)) {
    return "Gemini was unavailable, so the app used a grounded local fallback analysis based only on the extracted resume text.";
  }

  const normalizedMessage = error.message.toLowerCase();

  if (
    normalizedMessage.includes("quota") ||
    normalizedMessage.includes("resource_exhausted") ||
    normalizedMessage.includes("429")
  ) {
    return "Gemini quota is currently exhausted, so the app used a grounded local fallback analysis based only on the extracted resume text.";
  }

  if (
    normalizedMessage.includes("invalid analysis payload") ||
    normalizedMessage.includes("structured analysis payload") ||
    normalizedMessage.includes("json")
  ) {
    return "Gemini returned an invalid structured response, so the app used a grounded local fallback analysis based only on the extracted resume text.";
  }

  if (
    normalizedMessage.includes("api key") ||
    normalizedMessage.includes("permission") ||
    normalizedMessage.includes("unauthorized") ||
    normalizedMessage.includes("forbidden") ||
    normalizedMessage.includes("401") ||
    normalizedMessage.includes("403")
  ) {
    return "Gemini could not be reached with the current API configuration, so the app used a grounded local fallback analysis based only on the extracted resume text.";
  }

  return "Gemini was unavailable, so the app used a grounded local fallback analysis based only on the extracted resume text.";
}

export async function POST(request: NextRequest) {
  try {
    enforceRateLimit(getRequestFingerprint(request));

    const formData = await request.formData();
    const resumeFile = formData.get("resumeFile");
    const fields = analyzeResumeFieldsSchema.parse({
      resumeText: getStringField(formData.get("resumeText")),
      jobDescription: getStringField(formData.get("jobDescription")),
      tailorMode: getStringField(formData.get("tailorMode")) === "true",
      demoMode: getStringField(formData.get("demoMode")) === "true"
    });

    const pastedResumeText = cleanResumeText(fields.resumeText);
    const jobDescription = cleanJobDescription(fields.jobDescription);
    const hasUploadedFile = resumeFile instanceof File && resumeFile.size > 0;

    if (!pastedResumeText && !hasUploadedFile) {
      throw new ApiError(
        400,
        "Upload a PDF or DOCX resume, or paste your resume text to continue."
      );
    }

    let extractedResumeText = "";
    let fileName = "Pasted resume";
    let detectedMimeType: string | undefined;
    let warning: string | undefined;
    const usedFallbackText = false;
    let sourceType: "file" | "text" = "text";

    if (hasUploadedFile) {
      const parsedFile = await parseResumeFile(resumeFile);
      extractedResumeText = parsedFile.text;
      fileName = parsedFile.fileName;
      detectedMimeType = parsedFile.detectedMimeType;
      sourceType = "file";
    }

    const finalResumeText = cleanResumeText(
      extractedResumeText || pastedResumeText
    );

    if (finalResumeText.length < MIN_RESUME_TEXT_CHARS) {
      throw new ApiError(
        400,
        "Please provide a more complete resume before running the analysis."
      );
    }

    let result;

    if (!hasGeminiApiKey()) {
      if (fields.demoMode) {
        result = DEMO_ANALYSIS_RESULT;
      } else {
        result = analyzeResumeLocally({
          resumeText: finalResumeText,
          jobDescription
        });
        warning =
          "No Gemini API key is configured, so the app used a grounded local fallback analysis based only on the extracted resume text.";
      }
    } else {
      try {
        result = await analyzeResumeWithGemini({
          resumeText: finalResumeText,
          jobDescription,
          tailoringMode: fields.tailorMode
        });
      } catch (error) {
        result = analyzeResumeLocally({
          resumeText: finalResumeText,
          jobDescription
        });
        warning = getGeminiFallbackWarning(error);
      }
    }

    const responsePayload = analyzeResumeResponseSchema.parse({
      id: crypto.randomUUID(),
      source: {
        type: sourceType,
        fileName
      },
      parsing: {
        extractedCharacters: finalResumeText.length,
        detectedMimeType,
        usedFallbackText
      },
      warning,
      resumeTextUsed: finalResumeText,
      weights: getScoreWeights(Boolean(jobDescription)),
      result
    });

    return NextResponse.json(responsePayload, { status: 200 });
  } catch (error) {
    return jsonErrorResponse(error);
  }
}
