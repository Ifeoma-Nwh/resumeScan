import { useEffect, useState } from 'react'
import type { AnalysisErrorInfo } from '../lib/openrouter'
import { scoreBand, scoreKeywords } from '../lib/scoring'
import type { ScoreBand } from '../lib/scoring'
import type { AnalysisResult, Importance, Keyword, KeywordCategory } from '../types'
import { KeywordChips } from './KeywordChips'
import { ScoreRing } from './ScoreRing'

interface ResultsPanelProps {
  result: AnalysisResult | null
  isLoading: boolean
  error: AnalysisErrorInfo | null
}

interface ResultContentProps {
  result: AnalysisResult
  score: number
  missing: Keyword[]
  matched: Keyword[]
  copied: boolean
  onCopy: () => void
}

interface Verdict {
  title: string
  detail: string
  className: string
  detailClassName: string
  regionClassName: string
}

const CATEGORY_ORDER: Record<KeywordCategory, number> = { hard: 0, domain: 1, soft: 2, education: 3 }
const IMPORTANCE_ORDER: Record<Importance, number> = { required: 0, preferred: 1 }

const BAND_VERDICTS: Record<ScoreBand, Verdict> = {
  strong: {
    title: 'Strong match',
    detail: 'Your resume already covers most of what this job asks for.',
    className: 'text-emerald-700',
    detailClassName: 'text-emerald-700',
    regionClassName: 'border-emerald-200 bg-emerald-50',
  },
  tailoring: {
    title: 'Worth tailoring',
    detail: 'A few targeted edits around the missing keywords could lift this score.',
    className: 'text-amber-700',
    detailClassName: 'text-amber-700',
    regionClassName: 'border-amber-200 bg-amber-50',
  },
  'needs-work': {
    title: 'Needs work',
    detail: 'Rebuild the resume around the required keywords before applying.',
    className: 'text-rose-700',
    detailClassName: 'text-rose-700',
    regionClassName: 'border-rose-200 bg-rose-50',
  },
}

function verdictFor(score: number): Verdict {
  return BAND_VERDICTS[scoreBand(score)]
}

function missingKeywords(result: AnalysisResult): Keyword[] {
  return result.keywords
    .filter((keyword) => !keyword.matched)
    .sort(
      (a, b) =>
        IMPORTANCE_ORDER[a.importance] - IMPORTANCE_ORDER[b.importance] ||
        CATEGORY_ORDER[a.category] - CATEGORY_ORDER[b.category],
    )
}

function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="flex flex-col items-center gap-3">
        <div className="h-40 w-40 rounded-full bg-slate-200" />
        <div className="h-5 w-40 rounded-full bg-slate-200" />
        <div className="h-4 w-56 max-w-full rounded-full bg-slate-100" />
      </div>
      <div className="mt-6 space-y-3">
        <div className="h-4 w-32 rounded bg-slate-200" />
        <div className="flex flex-wrap gap-2">
          <div className="h-7 w-24 rounded-full bg-slate-200" />
          <div className="h-7 w-20 rounded-full bg-slate-200" />
          <div className="h-7 w-28 rounded-full bg-slate-200" />
        </div>
        <div className="h-7 w-36 rounded-full bg-slate-100" />
      </div>
      <p className="mt-4 text-sm text-slate-500">Scoring your resume against the job description...</p>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 py-10 text-center">
      <span
        aria-hidden="true"
        className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6" />
          <path d="M8 13h8" />
          <path d="M8 17h5" />
        </svg>
      </span>
      <p className="text-sm font-medium text-slate-700">No analysis yet</p>
      <p className="max-w-xs text-sm text-slate-500">
        Fill in the form and run an analysis to see your score, missing keywords, and suggestions.
      </p>
    </div>
  )
}

function ResultContent({ result, score, missing, matched, copied, onCopy }: ResultContentProps) {
  const verdict = verdictFor(score)

  return (
    <div>
      <div className={`flex flex-col items-center gap-3 rounded-xl border px-4 py-6 ${verdict.regionClassName}`}>
        <ScoreRing score={score} />
        <div className="text-center">
          <p className={`text-base font-semibold ${verdict.className}`}>{verdict.title}</p>
          <p className={`mt-1 max-w-xs text-sm ${verdict.detailClassName}`}>{verdict.detail}</p>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Missing keywords ({missing.length})
          </h3>
          {missing.length > 0 && (
            <button
              type="button"
              onClick={onCopy}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-900"
            >
              {copied ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3.5 w-3.5 text-emerald-600"
                  aria-hidden="true"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3.5 w-3.5"
                  aria-hidden="true"
                >
                  <rect x={9} y={9} width={13} height={13} rx={2} />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              )}
              {copied ? 'Copied' : 'Copy missing keywords'}
            </button>
          )}
        </div>
        {missing.length > 0 ? (
          <div className="mt-2.5">
            <KeywordChips keywords={missing} variant="missing" />
          </div>
        ) : (
          <p className="mt-2 text-sm text-slate-500">Every extracted keyword appears in your resume.</p>
        )}
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Matched keywords ({matched.length})
        </h3>
        {matched.length > 0 ? (
          <div className="mt-2.5">
            <KeywordChips keywords={matched} variant="matched" />
          </div>
        ) : (
          <p className="mt-2 text-sm text-slate-500">No keywords matched.</p>
        )}
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Suggestions</h3>
        {result.suggestions.length > 0 ? (
          <ol className="mt-2.5 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-slate-600">
            {result.suggestions.map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ol>
        ) : (
          <p className="mt-2 text-sm text-slate-500">No suggestions returned.</p>
        )}
      </div>
    </div>
  )
}

export function ResultsPanel({ result, isLoading, error }: ResultsPanelProps) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), 2000)
    return () => window.clearTimeout(timer)
  }, [copied])

  const missing: Keyword[] = result === null ? [] : missingKeywords(result)
  const matched: Keyword[] =
    result === null ? [] : result.keywords.filter((keyword) => keyword.matched)
  const score = result === null ? 0 : scoreKeywords(result.keywords).score

  const handleCopy = async () => {
    const text = missing.map((keyword) => keyword.keyword).join(', ')
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      <h2 className="mb-4 text-base font-semibold text-slate-900">Results</h2>

      {error !== null && (
        <div role="alert" className="mb-4 flex gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mt-0.5 h-5 w-5 shrink-0 text-rose-600"
            aria-hidden="true"
          >
            <circle cx={12} cy={12} r={10} />
            <path d="M12 8v4" />
            <path d="M12 16h.01" />
          </svg>
          <div className="min-w-0 text-sm text-rose-900">
            <p>{error.message}</p>
            {error.showKeyLink && (
              <a
                href="https://openrouter.ai/keys"
                target="_blank"
                rel="noreferrer"
                className="mt-1.5 inline-block font-medium text-rose-900 underline underline-offset-2 hover:text-rose-700"
              >
                Open the OpenRouter keys page
              </a>
            )}
          </div>
        </div>
      )}

      <div aria-live="polite">
        {isLoading ? (
          <LoadingSkeleton />
        ) : result !== null ? (
          <ResultContent
            result={result}
            score={score}
            missing={missing}
            matched={matched}
            copied={copied}
            onCopy={handleCopy}
          />
        ) : (
          <EmptyState />
        )}
      </div>
    </section>
  )
}
