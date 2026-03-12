import {
  MAX_JOB_DESCRIPTION_CHARS,
  MAX_RESUME_TEXT_CHARS
} from "@/lib/validators/resume";

function normalizeWhitespace(input: string) {
  return input
    .replace(/\u0000/g, "")
    .replace(/\r\n?/g, "\n")
    .replace(/[•◦▪]/g, "-")
    .replace(/[^\S\n]+/g, " ")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function cleanResumeText(text: string, maxChars = MAX_RESUME_TEXT_CHARS) {
  return normalizeWhitespace(text).slice(0, maxChars);
}

export function cleanJobDescription(text: string) {
  return normalizeWhitespace(text).slice(0, MAX_JOB_DESCRIPTION_CHARS);
}

