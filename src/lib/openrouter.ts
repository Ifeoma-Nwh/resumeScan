import type {
  AnalysisResult,
  FreeModel,
  ResumeInput,
  Settings,
} from '../types'
import { parseAnalysis } from './normalize'
import { buildAnalysisPrompt, buildRepairPrompt } from './prompt'

export const DEFAULT_MODEL = 'deepseek/deepseek-chat-v3-0324:free'

export const FALLBACK_FREE_MODELS: FreeModel[] = [
  { id: DEFAULT_MODEL, name: 'DeepSeek Chat v3' },
  {
    id: 'meta-llama/llama-3.3-70b-instruct:free',
    name: 'Llama 3.3 70B Instruct',
  },
  { id: 'qwen/qwen-2.5-72b-instruct:free', name: 'Qwen 2.5 72B Instruct' },
]

export type AnalysisErrorCode =
  | 'missing-key'
  | 'invalid-key'
  | 'rate-limited'
  | 'model-unavailable'
  | 'timeout'
  | 'bad-json'
  | 'network'
  | 'unknown'

export interface AnalysisErrorInfo {
  message: string
  showKeyLink: boolean
}

export class AnalysisError extends Error {
  readonly code: AnalysisErrorCode

  constructor(code: AnalysisErrorCode, message?: string) {
    super(message ?? code)
    this.name = 'AnalysisError'
    this.code = code
  }
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

const MODELS_ENDPOINT = 'https://openrouter.ai/api/v1/models'
const CHAT_ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions'
const REQUEST_TIMEOUT_MS = 90_000

const SYSTEM_PROMPT =
  'You are an applicant tracking system (ATS). Compare the resume to the job description and return JSON only, with no markdown, code fences, or commentary.'

function isZeroPrice(value: unknown): boolean {
  return value === 0 || value === '0'
}

function readFreeModel(entry: unknown): FreeModel | null {
  if (typeof entry !== 'object' || entry === null) return null

  const record = entry as Record<string, unknown>
  const id = typeof record.id === 'string' ? record.id.trim() : ''

  if (id === '') return null

  const pricing = record.pricing
  if (typeof pricing !== 'object' || pricing === null) return null

  const prices = pricing as Record<string, unknown>
  if (!isZeroPrice(prices.prompt) || !isZeroPrice(prices.completion)) {
    return null
  }

  const name =
    typeof record.name === 'string' && record.name.trim() !== ''
      ? record.name.trim()
      : id

  return { id, name }
}

export async function fetchFreeModels(): Promise<FreeModel[]> {
  try {
    const response = await fetch(MODELS_ENDPOINT)
    if (!response.ok) return FALLBACK_FREE_MODELS

    const payload: unknown = await response.json()
    if (typeof payload !== 'object' || payload === null) {
      return FALLBACK_FREE_MODELS
    }

    const data = (payload as { data?: unknown }).data
    if (!Array.isArray(data)) return FALLBACK_FREE_MODELS

    const models = data
      .map(readFreeModel)
      .filter((model): model is FreeModel => model !== null)
      .sort((left, right) => left.name.localeCompare(right.name))

    return models.length === 0 ? FALLBACK_FREE_MODELS : models
  } catch {
    return FALLBACK_FREE_MODELS
  }
}

function getRequestOrigin(): string {
  return typeof window === 'undefined' ? '' : window.location.origin
}

function statusToError(status: number): AnalysisError {
  if (status === 401) return new AnalysisError('invalid-key')
  if (status === 429) return new AnalysisError('rate-limited')
  if (status === 400 || status === 404) {
    return new AnalysisError('model-unavailable')
  }
  return new AnalysisError('network')
}

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError'
}

function readMessageContent(payload: unknown): string {
  if (typeof payload !== 'object' || payload === null) {
    throw new AnalysisError('model-unavailable')
  }

  const choices = (payload as { choices?: unknown }).choices
  if (!Array.isArray(choices) || choices.length === 0) {
    throw new AnalysisError('model-unavailable')
  }

  const first = choices[0]
  if (typeof first !== 'object' || first === null) {
    throw new AnalysisError('model-unavailable')
  }

  const message = (first as { message?: unknown }).message
  if (typeof message !== 'object' || message === null) {
    throw new AnalysisError('model-unavailable')
  }

  const content = (message as { content?: unknown }).content
  if (typeof content !== 'string') {
    throw new AnalysisError('model-unavailable')
  }

  return content
}

async function requestCompletion(
  apiKey: string,
  model: string,
  messages: ChatMessage[],
): Promise<string> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const response = await fetch(CHAT_ENDPOINT, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': getRequestOrigin(),
        'X-Title': 'resumeScan',
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        messages,
      }),
    })

    if (!response.ok) {
      throw statusToError(response.status)
    }

    const payload: unknown = await response.json()
    return readMessageContent(payload)
  } catch (error) {
    if (error instanceof AnalysisError) throw error
    if (isAbortError(error)) throw new AnalysisError('timeout')
    throw new AnalysisError('network')
  } finally {
    clearTimeout(timeout)
  }
}

export async function analyzeResume(
  input: ResumeInput,
  settings: Settings,
): Promise<AnalysisResult> {
  const apiKey = settings.apiKey.trim()
  if (apiKey === '') throw new AnalysisError('missing-key')

  const model = settings.model.trim() === '' ? DEFAULT_MODEL : settings.model.trim()
  const userPrompt = buildAnalysisPrompt(input)
  const messages: ChatMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: userPrompt },
  ]

  const firstResponse = await requestCompletion(apiKey, model, messages)

  try {
    return parseAnalysis(firstResponse)
  } catch (error) {
    const parseError =
      error instanceof Error ? error.message : 'Response was not valid JSON'

    const repairMessages: ChatMessage[] = [
      ...messages,
      { role: 'assistant', content: firstResponse },
      {
        role: 'user',
        content: buildRepairPrompt(firstResponse, parseError),
      },
    ]

    const repairResponse = await requestCompletion(apiKey, model, repairMessages)

    try {
      return parseAnalysis(repairResponse)
    } catch {
      throw new AnalysisError('bad-json')
    }
  }
}

export function describeAnalysisError(error: unknown): AnalysisErrorInfo {
  const code = error instanceof AnalysisError ? error.code : 'unknown'

  switch (code) {
    case 'missing-key':
      return {
        message: 'Add your OpenRouter API key in settings, then try again.',
        showKeyLink: true,
      }
    case 'invalid-key':
      return {
        message: 'OpenRouter rejected the API key. Check the key and try again.',
        showKeyLink: true,
      }
    case 'rate-limited':
      return {
        message:
          'OpenRouter is rate limiting this model. Wait a moment or choose another free model.',
        showKeyLink: false,
      }
    case 'model-unavailable':
      return {
        message:
          'The selected model is unavailable. Choose another free model in settings.',
        showKeyLink: false,
      }
    case 'timeout':
      return {
        message:
          'The request timed out after 90 seconds. Try again or choose a faster model.',
        showKeyLink: false,
      }
    case 'bad-json':
      return {
        message:
          'The model returned a response that was not valid JSON. Try again.',
        showKeyLink: false,
      }
    case 'network':
      return {
        message: 'Could not reach OpenRouter. Check your connection and try again.',
        showKeyLink: false,
      }
    default:
      return {
        message: 'Something went wrong while analyzing the resume. Try again.',
        showKeyLink: false,
      }
  }
}
