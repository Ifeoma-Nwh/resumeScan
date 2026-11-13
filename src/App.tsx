import { useCallback, useRef, useState } from 'react'
import { ResumeForm } from './components/ResumeForm'
import { ResultsPanel } from './components/ResultsPanel'
import { SettingsDialog } from './components/SettingsDialog'
import { analyzeResume, AnalysisError, describeAnalysisError, type AnalysisErrorInfo } from './lib/openrouter'
import { SAMPLE_RESUME } from './lib/sample'
import { scoreBand, scoreKeywords } from './lib/scoring'
import type { ScoreBand } from './lib/scoring'
import {
  clearApiKey,
  clearSettings,
  loadDraft,
  loadResult,
  loadSettings,
  saveDraft,
  saveResult,
  saveSettings,
} from './lib/storage'
import type { AnalysisResult, ResumeField, ResumeInput, Settings } from './types'

const REQUIRED_FIELDS: ResumeField[] = ['jobDescription', 'skills', 'experience', 'education']

const HEADER_BAND_BORDER: Record<ScoreBand, string> = {
  'needs-work': 'border-rose-700',
  tailoring: 'border-amber-700',
  strong: 'border-emerald-700',
}

export function App() {
  const [draft, setDraft] = useState<ResumeInput>(() => loadDraft())
  const [settings, setSettings] = useState<Settings | null>(() => loadSettings())
  const [result, setResult] = useState<AnalysisResult | null>(() => loadResult())
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<AnalysisErrorInfo | null>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const resultsRef = useRef<HTMLDivElement>(null)

  const canAnalyze = REQUIRED_FIELDS.every((field) => draft[field].trim() !== '')
  const score = result === null ? null : scoreKeywords(result.keywords).score

  const handleFieldChange = (field: ResumeField, value: string) => {
    const nextDraft = { ...draft, [field]: value }
    setDraft(nextDraft)
    saveDraft(nextDraft)
  }

  const handleLoadExample = () => {
    setDraft(SAMPLE_RESUME)
    saveDraft(SAMPLE_RESUME)
  }

  const handleAnalyze = async () => {
    if (settings === null || settings.apiKey.trim() === '') {
      setSettingsOpen(true)
      setError({
        message: 'Add your OpenRouter API key in settings, then run the analysis again.',
        showKeyLink: true,
      })
      return
    }

    setIsAnalyzing(true)
    setError(null)

    try {
      const analysis = await analyzeResume(draft, settings)
      setResult(analysis)
      saveResult(analysis)
      if (window.matchMedia('(max-width: 1023px)').matches) {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    } catch (analysisError) {
      if (analysisError instanceof AnalysisError && analysisError.code === 'invalid-key') {
        clearApiKey()
        setSettings((current) => (current === null ? current : { ...current, apiKey: '' }))
      }
      setError(describeAnalysisError(analysisError))
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleSettingsClose = useCallback(() => setSettingsOpen(false), [])

  const handleSettingsSave = useCallback((nextSettings: Settings) => {
    setSettings(nextSettings)
    saveSettings(nextSettings)
    setSettingsOpen(false)
  }, [])

  const handleSettingsClear = useCallback(() => {
    setSettings(null)
    clearSettings()
    setSettingsOpen(false)
  }, [])

  return (
    <div className="min-h-screen">
      <header
        className={`border-b bg-white transition-colors duration-300 ${score === null ? 'border-slate-200' : HEADER_BAND_BORDER[scoreBand(score)]}`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6" />
                <path d="m9 15 2 2 4-4" />
              </svg>
            </span>
            <div>
              <h1 className="text-base font-semibold tracking-tight text-slate-900">resumeScan</h1>
              <p className="text-xs text-slate-500 sm:text-sm">
                Score your resume against a job description with a free model.
              </p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Open settings"
            onClick={() => setSettingsOpen(true)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-900"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2 lg:gap-8">
          <ResumeForm
            draft={draft}
            onChange={handleFieldChange}
            onAnalyze={handleAnalyze}
            onLoadExample={handleLoadExample}
            isAnalyzing={isAnalyzing}
            canAnalyze={canAnalyze}
          />
          <div ref={resultsRef} className="lg:sticky lg:top-6">
            <ResultsPanel result={result} isLoading={isAnalyzing} error={error} />
          </div>
        </div>
      </main>

      <SettingsDialog
        open={settingsOpen}
        settings={settings}
        onClose={handleSettingsClose}
        onSave={handleSettingsSave}
        onClear={handleSettingsClear}
      />
    </div>
  )
}
