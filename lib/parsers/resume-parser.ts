import { fileTypeFromBuffer } from "file-type";

import { cleanResumeText } from "@/lib/parsers/text-cleaner";
import {
  MAX_FILE_BYTES,
  MIN_RESUME_TEXT_CHARS
} from "@/lib/validators/resume";
import {
  ALLOWED_RESUME_MIME_TYPES,
  getFileExtension,
  sanitizeFileName
} from "@/lib/utils/file";
import { ApiError } from "@/lib/utils/http";

type ResumeExtension = "pdf" | "docx";

export interface ParsedResumeFile {
  text: string;
  fileName: string;
  detectedMimeType?: string;
  size: number;
  extension: ResumeExtension;
}

function isZipLike(buffer: Buffer) {
  return (
    buffer.length >= 4 &&
    buffer[0] === 0x50 &&
    buffer[1] === 0x4b &&
    buffer[2] === 0x03 &&
    buffer[3] === 0x04
  );
}

function isPdfLike(buffer: Buffer) {
  return buffer.subarray(0, 4).toString("ascii") === "%PDF";
}

function assertSupportedFile(file: File, extension: string) {
  if (!extension || !["pdf", "docx"].includes(extension)) {
    throw new ApiError(
      400,
      "Please upload a PDF or DOCX resume file."
    );
  }

  if (file.size === 0) {
    throw new ApiError(400, "The uploaded file is empty.");
  }

  if (file.size > MAX_FILE_BYTES) {
    throw new ApiError(
      413,
      "Resume files must be 5 MB or smaller."
    );
  }

  if (
    file.type &&
    !ALLOWED_RESUME_MIME_TYPES.includes(
      file.type as (typeof ALLOWED_RESUME_MIME_TYPES)[number]
    ) &&
    extension === "pdf"
  ) {
    throw new ApiError(
      400,
      "The uploaded file does not look like a supported PDF or DOCX resume."
    );
  }
}

async function extractPdfText(buffer: Buffer) {
  const pdfParse = (await import("pdf-parse")).default;
  const parsed = await pdfParse(buffer);
  return parsed.text;
}

async function extractDocxText(buffer: Buffer) {
  const mammoth = await import("mammoth");
  const parsed = await mammoth.extractRawText({ buffer });
  return parsed.value;
}

export async function parseResumeFile(file: File): Promise<ParsedResumeFile> {
  const extension = getFileExtension(file.name);

  assertSupportedFile(file, extension);

  const safeFileName = sanitizeFileName(file.name);
  const buffer = Buffer.from(await file.arrayBuffer());
  const sniffed = await fileTypeFromBuffer(buffer);

  if (extension === "pdf" && !isPdfLike(buffer)) {
    throw new ApiError(400, "The uploaded PDF appears to be malformed.");
  }

  if (extension === "docx" && !isZipLike(buffer)) {
    throw new ApiError(400, "The uploaded DOCX appears to be malformed.");
  }

  let rawText = "";

  try {
    rawText =
      extension === "pdf"
        ? await extractPdfText(buffer)
        : await extractDocxText(buffer);
  } catch (error) {
    throw new ApiError(
      422,
      `We couldn't extract readable text from ${safeFileName}. Paste the resume text manually or try a different export.`,
      error instanceof Error ? error.message : undefined
    );
  }

  const cleanedText = cleanResumeText(rawText);

  if (cleanedText.length < MIN_RESUME_TEXT_CHARS) {
    throw new ApiError(
      422,
      "The file was parsed, but there was not enough readable resume text to analyze. Paste the resume text manually instead."
    );
  }

  return {
    text: cleanedText,
    fileName: safeFileName,
    detectedMimeType: sniffed?.mime ?? file.type ?? undefined,
    size: file.size,
    extension: extension as ResumeExtension
  };
}
