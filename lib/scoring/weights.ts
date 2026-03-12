import type { CategoryScores } from "@/lib/validators/analysis";

export const SCORE_WEIGHTS_WITH_JOB = {
  content: 0.25,
  experience: 0.2,
  ats: 0.15,
  skills: 0.1,
  formatting: 0.1,
  grammar: 0.1,
  jobMatch: 0.1
} as const;

export const SCORE_WEIGHTS_WITHOUT_JOB = {
  content: 0.28,
  experience: 0.23,
  ats: 0.17,
  skills: 0.12,
  formatting: 0.1,
  grammar: 0.1,
  jobMatch: 0
} as const;

export type ScoreWeights =
  | typeof SCORE_WEIGHTS_WITH_JOB
  | typeof SCORE_WEIGHTS_WITHOUT_JOB;

export function getScoreWeights(hasJobDescription: boolean): ScoreWeights {
  return hasJobDescription
    ? SCORE_WEIGHTS_WITH_JOB
    : SCORE_WEIGHTS_WITHOUT_JOB;
}

// The model scores each category on a 0-100 scale, while the server applies
// fixed weights so the overall score is deterministic and explainable.
export function computeOverallScore(
  categoryScores: CategoryScores,
  hasJobDescription: boolean
) {
  const weights = getScoreWeights(hasJobDescription);

  const total =
    categoryScores.content * weights.content +
    categoryScores.experience * weights.experience +
    categoryScores.ats * weights.ats +
    categoryScores.skills * weights.skills +
    categoryScores.formatting * weights.formatting +
    categoryScores.grammar * weights.grammar +
    categoryScores.jobMatch * weights.jobMatch;

  return Math.round(total);
}

