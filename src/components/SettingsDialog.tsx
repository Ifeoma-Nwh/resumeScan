import { useEffect, useId, useRef, useState } from 'react'
import type { MouseEvent, RefObject } from 'react'
import { DEFAULT_MODEL, FALLBACK_FREE_MODELS, fetchFreeModels } from '../lib/openrouter'
import type { FreeModel, Settings } from '../types'

interface SettingsDialogProps {
  open: boolean
  settings: Settings | null
  onClose: () => void
  onSave: (settings: Settings) => void
  onClear: () => void
}

interface SettingsFormProps {
  settings: Settings | null
  titleId: string
  keyInputRef: RefObject<HTMLInputElement | null>
  onSave: (settings: Settings) => void
  onClear: () => void
  onRequestClose: () => void
}

export function SettingsDialog({ open, settings, onClose, onSave, onClear }: SettingsDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const keyInputRef = useRef<HTMLInputElement>(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (dialog === null) return
    if (open && !dialog.open) {
      dialog.showModal()
      keyInputRef.current?.focus()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  useEffect(() => {
    const dialog = dialogRef.current
    if (dialog === null) return
    const handleDialogClose = () => onClose()
    dialog.addEventListener('close', handleDialogClose)
    return () => dialog.removeEventListener('close', handleDialogClose)
  }, [onClose])

  const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === dialogRef.current) {
      dialogRef.current?.close()
    }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={open ? titleId : undefined}
      onClick={handleBackdropClick}
      className="fixed inset-0 m-auto max-h-[90vh] w-[min(92vw,26rem)] overflow-y-auto rounded-2xl bg-white shadow-2xl backdrop:bg-slate-900/50"
    >
      {open && (
        <SettingsForm
          settings={settings}
          titleId={titleId}
          keyInputRef={keyInputRef}
          onSave={onSave}
          onClear={onClear}
          onRequestClose={() => dialogRef.current?.close()}
        />
      )}
    </dialog>
  )
}

function SettingsForm({ settings, titleId, keyInputRef, onSave, onClear, onRequestClose }: SettingsFormProps) {
  const savedModel = settings?.model ?? ''
  const [apiKey, setApiKey] = useState(settings?.apiKey ?? '')
  const [model, setModel] = useState(savedModel || DEFAULT_MODEL)
  const [showKey, setShowKey] = useState(false)
  const [models, setModels] = useState<FreeModel[]>(FALLBACK_FREE_MODELS)
  const [modelsLoading, setModelsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetchFreeModels()
      .then((fetched) => {
        if (cancelled) return
        const available = fetched.length > 0 ? fetched : FALLBACK_FREE_MODELS
        setModels(available)
        if (savedModel === '' && !available.some((entry) => entry.id === DEFAULT_MODEL)) {
          setModel(available[0].id)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setModels(FALLBACK_FREE_MODELS)
        }
      })
      .finally(() => {
        if (!cancelled) {
          setModelsLoading(false)
        }
      })
    return () => {
      cancelled = true
    }
  }, [savedModel])

  const trimmedKey = apiKey.trim()
  const modelOption = models.some((entry) => entry.id === model)
    ? null
    : { id: model, name: model }
  const modelOptions = modelOption === null ? models : [modelOption, ...models]

  const handleSave = () => {
    if (trimmedKey === '') return
    onSave({ apiKey: trimmedKey, model: model.trim() || DEFAULT_MODEL })
  }

  return (
    <div className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 id={titleId} className="text-base font-semibold text-slate-900">
            Settings
          </h2>
          <p className="mt-1 text-sm text-slate-500">Connect your own OpenRouter key to run analyses.</p>
        </div>
        <button
          type="button"
          aria-label="Close settings"
          onClick={onRequestClose}
          className="-mr-1 -mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>

      <div className="mt-5 space-y-4">
        <div>
          <label htmlFor="settings-api-key" className="text-sm font-medium text-slate-800">
            OpenRouter API key
          </label>
          <div className="relative mt-1.5">
            <input
              ref={keyInputRef}
              id="settings-api-key"
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(event) => setApiKey(event.target.value)}
              autoComplete="off"
              spellCheck={false}
              placeholder="sk-or-v1-..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-3.5 pr-11 text-sm text-slate-800 placeholder:text-slate-500 focus:border-emerald-600"
            />
            <button
              type="button"
              onClick={() => setShowKey((visible) => !visible)}
              aria-label={showKey ? 'Hide API key' : 'Show API key'}
              className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-xl text-slate-500 hover:text-slate-800"
            >
              {showKey ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                  <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                  <path d="m1 1 22 22" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx={12} cy={12} r={3} />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between gap-2">
            <label htmlFor="settings-model" className="text-sm font-medium text-slate-800">
              Model
            </label>
            {modelsLoading && (
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5 animate-spin" aria-hidden="true">
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
                Loading free models
              </span>
            )}
          </div>
          <select
            id="settings-model"
            value={model}
            onChange={(event) => setModel(event.target.value)}
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 pr-8 text-sm text-slate-800 focus:border-emerald-600"
          >
            {modelOptions.map((entry) => (
              <option key={entry.id} value={entry.id}>
                {entry.name}
              </option>
            ))}
          </select>
          <p className="mt-1.5 text-xs text-slate-500">Only zero-price models are listed.</p>
        </div>

        <div className="rounded-xl bg-slate-50 p-3.5 text-xs leading-relaxed text-slate-600">
          Your key is kept for this tab session only, cleared when the tab closes, and sent only to{' '}
          <a
            href="https://openrouter.ai/keys"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-emerald-700 underline underline-offset-2 hover:text-emerald-800"
          >
            openrouter.ai/keys
          </a>
          . It is never sent anywhere else.
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4">
        <button
          type="button"
          onClick={onClear}
          className="text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          Clear
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRequestClose}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={trimmedKey === ''}
            className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 focus-visible:outline-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
