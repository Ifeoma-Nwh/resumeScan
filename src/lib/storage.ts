import type { AnalysisResult, ResumeInput, Settings } from '../types'
import { normalizeAnalysis } from './normalize'

const LEGACY_SETTINGS_KEY = 'resumeScan.settings'
const API_KEY_KEY = 'resumeScan.apiKey'
const MODEL_KEY = 'resumeScan.model'
const DRAFT_KEY = 'resumeScan.draft'
const RESULT_KEY = 'resumeScan.result'

type StorageKind = 'local' | 'session'

function getStorage(kind: StorageKind): Storage | null {
  if (typeof window === 'undefined') return null

  try {
    return kind === 'session' ? window.sessionStorage : window.localStorage
  } catch {
    return null
  }
}

function readJson(key: string): unknown {
  const storage = getStorage('local')
  if (storage === null) return null

  try {
    const raw = storage.getItem(key)
    if (raw === null) return null
    return JSON.parse(raw) as unknown
  } catch {
    return null
  }
}

function writeJson(key: string, value: unknown): void {
  const storage = getStorage('local')
  if (storage === null) return

  try {
    storage.setItem(key, JSON.stringify(value))
  } catch {
    return
  }
}

function readStringItem(key: string, kind: StorageKind): string {
  const storage = getStorage(kind)
  if (storage === null) return ''

  try {
    return storage.getItem(key) ?? ''
  } catch {
    return ''
  }
}

function writeStringItem(key: string, value: string, kind: StorageKind): void {
  const storage = getStorage(kind)
  if (storage === null) return

  try {
    storage.setItem(key, value)
  } catch {
    return
  }
}

function removeItem(key: string, kind: StorageKind): void {
  const storage = getStorage(kind)
  if (storage === null) return

  try {
    storage.removeItem(key)
  } catch {
    return
  }
}

function readString(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function emptyDraft(): ResumeInput {
  return {
    jobDescription: '',
    skills: '',
    experience: '',
    education: '',
    projects: '',
  }
}

export function loadSettings(): Settings | null {
  removeItem(LEGACY_SETTINGS_KEY, 'local')

  const apiKey = readStringItem(API_KEY_KEY, 'session')
  const model = readStringItem(MODEL_KEY, 'local')

  if (apiKey === '' && model === '') return null

  return { apiKey, model }
}

export function saveSettings(settings: Settings): void {
  writeStringItem(API_KEY_KEY, settings.apiKey, 'session')
  writeStringItem(MODEL_KEY, settings.model, 'local')
}

export function clearSettings(): void {
  removeItem(API_KEY_KEY, 'session')
  removeItem(MODEL_KEY, 'local')
}

export function clearApiKey(): void {
  removeItem(API_KEY_KEY, 'session')
}

export function loadDraft(): ResumeInput {
  const value = readJson(DRAFT_KEY)
  if (typeof value !== 'object' || value === null) return emptyDraft()

  const record = value as Record<string, unknown>

  return {
    jobDescription: readString(record.jobDescription),
    skills: readString(record.skills),
    experience: readString(record.experience),
    education: readString(record.education),
    projects: readString(record.projects),
  }
}

export function saveDraft(draft: ResumeInput): void {
  writeJson(DRAFT_KEY, draft)
}

export function loadResult(): AnalysisResult | null {
  const value = readJson(RESULT_KEY)
  if (value === null) return null

  try {
    return normalizeAnalysis(value)
  } catch {
    return null
  }
}

export function saveResult(result: AnalysisResult): void {
  writeJson(RESULT_KEY, result)
}

export function clearResult(): void {
  removeItem(RESULT_KEY, 'local')
}
