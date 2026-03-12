import type { NextRequest } from "next/server";

import { ApiError } from "@/lib/utils/http";

declare global {
  var __resumeRateLimitStore:
    | Map<string, { count: number; resetAt: number }>
    | undefined;
}

const rateLimitStore = globalThis.__resumeRateLimitStore ?? new Map();

if (!globalThis.__resumeRateLimitStore) {
  globalThis.__resumeRateLimitStore = rateLimitStore;
}

export function getRequestFingerprint(request: NextRequest) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "local-dev"
  );
}

export function enforceRateLimit(
  key: string,
  options: { limit?: number; windowMs?: number } = {}
) {
  const limit = options.limit ?? 10;
  const windowMs = options.windowMs ?? 10 * 60 * 1000;
  const now = Date.now();

  const current = rateLimitStore.get(key);

  if (!current || current.resetAt <= now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }

  if (current.count >= limit) {
    throw new ApiError(
      429,
      "Too many analysis requests. Please wait a few minutes before trying again."
    );
  }

  rateLimitStore.set(key, {
    count: current.count + 1,
    resetAt: current.resetAt
  });
}
