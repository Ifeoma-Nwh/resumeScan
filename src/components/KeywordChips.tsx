import { useId, useState } from 'react'
import type { Importance, Keyword } from '../types'

interface KeywordChipsProps {
  keywords: Keyword[]
  variant: 'missing' | 'matched'
}

function missingChipClasses(importance: Importance): string {
  const base = 'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-sm font-medium'
  return importance === 'required'
    ? `${base} border-rose-200 bg-rose-50 text-rose-900`
    : `${base} border-amber-200 bg-amber-50 text-amber-900`
}

function missingHintClasses(importance: Importance): string {
  return importance === 'required'
    ? 'text-[11px] font-normal text-rose-700'
    : 'text-[11px] font-normal text-amber-700'
}

export function KeywordChips({ keywords, variant }: KeywordChipsProps) {
  const [expandedKeyword, setExpandedKeyword] = useState<string | null>(null)
  const baseId = useId()
  const isMissing = variant === 'missing'

  return (
    <ul className="flex flex-wrap gap-2">
      {keywords.map((keyword, index) => {
        const hasEvidence = keyword.evidence.trim() !== ''
        const panelId = `${baseId}-evidence-${index}`
        const expanded = expandedKeyword === keyword.keyword
        const showToggle = !isMissing && hasEvidence

        return (
          <li key={keyword.keyword} className="flex flex-col">
            <span
              className={isMissing ? missingChipClasses(keyword.importance) : 'inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-sm text-slate-600'}
              title={hasEvidence ? `Evidence: ${keyword.evidence}` : undefined}
            >
              {!isMissing && (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3.5 w-3.5 shrink-0 text-emerald-600"
                  aria-hidden="true"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              )}
              <span>{keyword.keyword}</span>
              {isMissing && (
                <span className={missingHintClasses(keyword.importance)}>
                  {keyword.importance === 'required' ? 'Required' : 'Preferred'} ·{' '}
                  {keyword.category.charAt(0).toUpperCase() + keyword.category.slice(1)}
                </span>
              )}
              {showToggle && (
                <button
                  type="button"
                  aria-expanded={expanded}
                  aria-controls={panelId}
                  onClick={() => setExpandedKeyword(expanded ? null : keyword.keyword)}
                  className="-mr-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-slate-500 hover:text-slate-800"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`h-3 w-3 transition-transform ${expanded ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                  <span className="sr-only">Evidence for {keyword.keyword}</span>
                </button>
              )}
            </span>
            {!isMissing && hasEvidence && (
              <p
                id={panelId}
                hidden={!expanded}
                className="mt-1 max-w-56 rounded-md bg-slate-100 px-2.5 py-1.5 text-xs italic leading-relaxed text-slate-600"
              >
                “{keyword.evidence}”
              </p>
            )}
          </li>
        )
      })}
    </ul>
  )
}
