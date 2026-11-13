import type {
  AnalysisResult,
  Importance,
  Keyword,
  KeywordCategory,
} from '../types'

const MAX_KEYWORDS = 25
const MAX_SUGGESTIONS = 6

const KEYWORD_CATEGORIES: readonly KeywordCategory[] = [
  'hard',
  'domain',
  'soft',
  'education',
]

const IMPORTANCE_LEVELS: readonly Importance[] = ['required', 'preferred']

function isKeywordCategory(value: unknown): value is KeywordCategory {
  return (
    typeof value === 'string' &&
    (KEYWORD_CATEGORIES as readonly string[]).includes(value)
  )
}

function isImportance(value: unknown): value is Importance {
  return (
    typeof value === 'string' &&
    (IMPORTANCE_LEVELS as readonly string[]).includes(value)
  )
}

function normalizeKeyword(value: unknown): Keyword | null {
  if (typeof value !== 'object' || value === null) return null

  const record = value as Record<string, unknown>

  if (typeof record.keyword !== 'string' || record.keyword.trim() === '') {
    return null
  }

  if (!isKeywordCategory(record.category)) return null
  if (!isImportance(record.importance)) return null
  if (typeof record.matched !== 'boolean') return null

  return {
    keyword: record.keyword.trim(),
    category: record.category,
    importance: record.importance,
    matched: record.matched,
    evidence: typeof record.evidence === 'string' ? record.evidence : '',
  }
}

function normalizeSuggestions(value: unknown): string[] {
  if (!Array.isArray(value)) return []

  const seen = new Set<string>()
  const suggestions: string[] = []

  for (const entry of value) {
    if (typeof entry !== 'string') continue

    const text = entry.trim()
    if (text === '') continue

    const key = text.toLowerCase()
    if (seen.has(key)) continue

    seen.add(key)
    suggestions.push(text)

    if (suggestions.length === MAX_SUGGESTIONS) break
  }

  return suggestions
}

export function dedupeKeywords(keywords: Keyword[]): Keyword[] {
  const seen = new Set<string>()
  const result: Keyword[] = []

  for (const keyword of keywords) {
    const text = keyword.keyword.trim()
    if (text === '') continue

    const key = text.toLowerCase()
    if (seen.has(key)) continue

    seen.add(key)
    result.push({ ...keyword, keyword: text })

    if (result.length === MAX_KEYWORDS) break
  }

  return result
}

export function extractJsonObject(text: string): string {
  const withoutFences = text.replace(/```[a-zA-Z]*\s*/g, '')
  const start = withoutFences.indexOf('{')
  const end = withoutFences.lastIndexOf('}')

  if (start === -1 || end === -1 || end <= start) {
    throw new Error('Response did not contain a JSON object')
  }

  return withoutFences.slice(start, end + 1)
}

export function normalizeAnalysis(value: unknown): AnalysisResult {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error('Analysis response must be a JSON object')
  }

  const record = value as Record<string, unknown>

  if (!Array.isArray(record.keywords)) {
    throw new Error('Analysis response is missing a keywords array')
  }

  const keywords = dedupeKeywords(
    record.keywords
      .map(normalizeKeyword)
      .filter((keyword): keyword is Keyword => keyword !== null),
  )

  if (keywords.length === 0) {
    throw new Error('Analysis response did not include any valid keywords')
  }

  return {
    keywords,
    suggestions: normalizeSuggestions(record.suggestions),
  }
}

export function parseAnalysis(text: string): AnalysisResult {
  const objectText = extractJsonObject(text)
  let parsed: unknown

  try {
    parsed = JSON.parse(objectText) as unknown
  } catch {
    throw new Error('Response was not valid JSON')
  }

  return normalizeAnalysis(parsed)
}
