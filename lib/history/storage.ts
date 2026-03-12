"use client";

import type { StoredAnalysis } from "@/types/history";

const HISTORY_STORAGE_KEY = "ai-resume-reviewer-history-v2";
const HISTORY_LIMIT = 12;

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

export function readStoredHistory(): StoredAnalysis[] {
  if (!canUseStorage()) {
    return [];
  }

  const raw = window.localStorage.getItem(HISTORY_STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as StoredAnalysis[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveStoredHistoryEntry(entry: StoredAnalysis) {
  if (!canUseStorage()) {
    return;
  }

  const current = readStoredHistory().filter((item) => item.id !== entry.id);
  const next = [entry, ...current].slice(0, HISTORY_LIMIT);
  window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(next));
}

export function getStoredHistoryEntry(id: string) {
  return readStoredHistory().find((item) => item.id === id) ?? null;
}

export function clearStoredHistory() {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(HISTORY_STORAGE_KEY);
}
