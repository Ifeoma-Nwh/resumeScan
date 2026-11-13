import type { FormEvent } from 'react'
import type { ResumeField, ResumeInput } from '../types'

interface ResumeFormProps {
  draft: ResumeInput
  onChange: (field: ResumeField, value: string) => void
  onAnalyze: () => void
  onLoadExample: () => void
  isAnalyzing: boolean
  canAnalyze: boolean
}

interface FieldConfig {
  id: string
  field: ResumeField
  label: string
  hint: string
  required: boolean
  placeholder: string
  rows: number
}

const FIELD_CONFIGS: FieldConfig[] = [
  {
    id: 'job-description',
    field: 'jobDescription',
    label: 'Job description',
    hint: 'Paste the full posting, including responsibilities and requirements.',
    required: true,
    placeholder: 'Paste the job posting here...',
    rows: 8,
  },
  {
    id: 'skills',
    field: 'skills',
    label: 'Skills',
    hint: 'Hard and soft skills together, as a list or comma separated.',
    required: true,
    placeholder: 'React, TypeScript, Node.js, communication, mentoring...',
    rows: 5,
  },
  {
    id: 'experience',
    field: 'experience',
    label: 'Work experience',
    hint: 'Roles, companies, dates, and headline results.',
    required: true,
    placeholder: 'Senior Developer, Acme Corp, 2021 to present...',
    rows: 6,
  },
  {
    id: 'education',
    field: 'education',
    label: 'Education',
    hint: 'Degrees, schools, and relevant coursework.',
    required: true,
    placeholder: 'BSc Computer Science, State University, 2018...',
    rows: 4,
  },
  {
    id: 'projects',
    field: 'projects',
    label: 'Projects',
    hint: 'Optional: side projects, open source work, or a portfolio.',
    required: false,
    placeholder: 'Ledgerly, a personal budgeting app built with React...',
    rows: 4,
  },
]

export function ResumeForm({
  draft,
  onChange,
  onAnalyze,
  onLoadExample,
  isAnalyzing,
  canAnalyze,
}: ResumeFormProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onAnalyze()
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-slate-900">Your inputs</h2>
        <p className="mt-1 text-sm text-slate-500">
          Paste each section below. Text is sent to openrouter.ai only when you run an analysis.
        </p>
      </div>

      <div className="space-y-5">
        {FIELD_CONFIGS.map((config) => {
          const value = draft[config.field]
          const hintId = `${config.id}-hint`
          return (
            <div key={config.id}>
              <div className="flex items-center justify-between gap-3">
                <label htmlFor={config.id} className="text-sm font-medium text-slate-800">
                  {config.label}
                </label>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                    config.required ? 'bg-slate-200 text-slate-700' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {config.required ? 'Required' : 'Optional'}
                </span>
              </div>
              <p id={hintId} className="mt-1 text-xs text-slate-500">
                {config.hint}
              </p>
              <textarea
                id={config.id}
                value={value}
                onChange={(event) => onChange(config.field, event.target.value)}
                rows={config.rows}
                placeholder={config.placeholder}
                aria-describedby={hintId}
                className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm leading-relaxed text-slate-800 placeholder:text-slate-500 hover:border-slate-300 focus:border-emerald-600"
              />
              <p className="mt-1 text-right text-xs tabular-nums text-slate-500">
                {value.length} {value.length === 1 ? 'character' : 'characters'}
              </p>
            </div>
          )
        })}
      </div>

      <div className="mt-6 border-t border-slate-200 pt-4">
        <div
          role="note"
          className="flex gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs leading-relaxed text-amber-900"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mt-0.5 h-4 w-4 shrink-0 text-amber-600"
            aria-hidden="true"
          >
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
          </svg>
          <p>
            Free OpenRouter models may use your input for training. Avoid confidential details: replace
            company names with <code className="font-mono">[Company]</code>, towns with{' '}
            <code className="font-mono">[City]</code>, and project links with{' '}
            <code className="font-mono">[Project]</code> before analyzing.
          </p>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onLoadExample}
            className="text-sm font-medium text-emerald-700 underline-offset-4 hover:text-emerald-800 hover:underline"
          >
            Load example
          </button>
          <button
            type="submit"
            disabled={!canAnalyze || isAnalyzing}
            title={!canAnalyze ? 'Fill in the four required fields first' : undefined}
            className="inline-flex min-w-44 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 focus-visible:outline-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isAnalyzing && (
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 animate-spin" aria-hidden="true">
                <circle
                  cx={12}
                  cy={12}
                  r={10}
                  stroke="currentColor"
                  strokeWidth={3}
                  className="opacity-25"
                />
                <path
                  d="M12 2a10 10 0 0 1 10 10"
                  stroke="currentColor"
                  strokeWidth={3}
                  strokeLinecap="round"
                />
              </svg>
            )}
            {isAnalyzing ? 'Analyzing...' : 'Analyze resume'}
          </button>
        </div>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-slate-500">
        Your API key is kept for this tab only and is sent only to{' '}
        <a
          href="https://openrouter.ai"
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-2 text-emerald-700 hover:text-emerald-800"
        >
          openrouter.ai
        </a>
        .
      </p>
    </form>
  )
}
