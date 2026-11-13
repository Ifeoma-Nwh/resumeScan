import { describe, expect, it } from 'vitest'
import type { Keyword, KeywordCategory, Importance } from '../types'
import { dedupeKeywords } from './normalize'
import { scoreBand, scoreKeywords } from './scoring'

function keyword(
  text: string,
  category: KeywordCategory,
  importance: Importance,
  matched: boolean,
): Keyword {
  return {
    keyword: text,
    category,
    importance,
    matched,
    evidence: matched ? `${text} evidence` : '',
  }
}

describe('scoreKeywords', () => {
  it('scores a weighted mix of matched and unmatched keywords', () => {
    const result = scoreKeywords([
      keyword('React', 'hard', 'required', true),
      keyword('Fintech', 'domain', 'preferred', true),
      keyword('Mentoring', 'soft', 'required', false),
      keyword('Degree', 'education', 'required', true),
    ])

    expect(result).toEqual({
      score: 83,
      matchedWeight: 5,
      totalWeight: 6,
    })
  })

  it('rounds the percentage to the nearest integer', () => {
    const result = scoreKeywords([
      keyword('Testing', 'soft', 'required', true),
      keyword('Accessibility', 'soft', 'required', true),
      keyword('GraphQL', 'soft', 'required', false),
    ])

    expect(result.score).toBe(67)
  })

  it('returns zero when there is no weight', () => {
    expect(scoreKeywords([])).toEqual({
      score: 0,
      matchedWeight: 0,
      totalWeight: 0,
    })
  })

  it('counts preferred keywords as half weight', () => {
    const result = scoreKeywords([
      keyword('React', 'hard', 'preferred', true),
      keyword('TypeScript', 'hard', 'required', false),
    ])

    expect(result).toEqual({
      score: 33,
      matchedWeight: 1.5,
      totalWeight: 4.5,
    })
  })

  it('applies the category weights', () => {
    const allMatched = scoreKeywords([
      keyword('React', 'hard', 'required', true),
      keyword('Fintech', 'domain', 'required', true),
      keyword('Leadership', 'soft', 'required', true),
      keyword('Degree', 'education', 'required', true),
    ])

    expect(allMatched).toEqual({
      score: 100,
      matchedWeight: 7,
      totalWeight: 7,
    })

    const hardMissing = scoreKeywords([
      keyword('React', 'hard', 'required', false),
      keyword('Fintech', 'domain', 'required', true),
      keyword('Leadership', 'soft', 'required', true),
      keyword('Degree', 'education', 'required', true),
    ])

    expect(hardMissing).toEqual({
      score: 57,
      matchedWeight: 4,
      totalWeight: 7,
    })
  })
})

describe('dedupeKeywords', () => {
  it('trims text, removes case-insensitive duplicates, drops empties, and caps at 25', () => {
    const extraKeywords = Array.from({ length: 30 }, (_, index) =>
      keyword(`Skill ${index + 1}`, 'hard', 'required', true),
    )

    const result = dedupeKeywords([
      keyword('  React  ', 'hard', 'required', true),
      keyword('react', 'hard', 'preferred', false),
      keyword('REACT', 'hard', 'required', true),
      keyword('   ', 'soft', 'required', false),
      ...extraKeywords,
    ])

    expect(result).toHaveLength(25)
    expect(result[0].keyword).toBe('React')
    expect(result[0].importance).toBe('required')
    expect(result.some((entry) => entry.keyword === '')).toBe(false)
    expect(
      result.filter((entry) => entry.keyword.toLowerCase() === 'react'),
    ).toHaveLength(1)
  })
})

describe('scoreBand', () => {
  it('marks scores below 50 as needs-work', () => {
    expect(scoreBand(0)).toBe('needs-work')
    expect(scoreBand(49)).toBe('needs-work')
  })

  it('marks scores from 50 to 74 as tailoring', () => {
    expect(scoreBand(50)).toBe('tailoring')
    expect(scoreBand(74)).toBe('tailoring')
  })

  it('marks scores of 75 and above as strong', () => {
    expect(scoreBand(75)).toBe('strong')
    expect(scoreBand(100)).toBe('strong')
  })
})
