import type { AnalyzeResumeResponse } from "@/lib/validators/analysis";

export interface StoredAnalysis {
  id: string;
  createdAt: string;
  label: string;
  fileName: string;
  sourceType: "file" | "text";
  hasJobDescription: boolean;
  result: AnalyzeResumeResponse["result"];
  weights: AnalyzeResumeResponse["weights"];
  warning?: string;
}
