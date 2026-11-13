import type {
  Importance,
  Keyword,
  KeywordCategory,
  ScoreBreakdown,
} from '../types'

const CATEGORY_WEIGHTS: Record<KeywordCategory, number> = {
  hard: 3,
  domain: 2,
  soft: 1,
  education: 1,
}

const IMPORTANCE_MULTIPLIERS: Record<Importance, number> = {
  required: 1,
  preferred: 0.5,
}

export function scoreKeywords(keywords: Keyword[]): ScoreBreakdown {
  let matchedWeight = 0
  let totalWeight = 0

  for (const keyword of keywords) {
    const weight =
      CATEGORY_WEIGHTS[keyword.category] *
      IMPORTANCE_MULTIPLIERS[keyword.importance]

    totalWeight += weight

    if (keyword.matched) {
      matchedWeight += weight
    }
  }

  const score =
    totalWeight === 0 ? 0 : Math.round((matchedWeight / totalWeight) * 100)

  return { score, matchedWeight, totalWeight }
}

export type ScoreBand = 'needs-work' | 'tailoring' | 'strong'

export function scoreBand(score: number): ScoreBand {
  if (score >= 75) return 'strong'
  if (score >= 50) return 'tailoring'
  return 'needs-work'
}
