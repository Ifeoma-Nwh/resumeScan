export type KeywordCategory = 'hard' | 'domain' | 'soft' | 'education'

export type Importance = 'required' | 'preferred'

export interface Keyword {
  keyword: string
  category: KeywordCategory
  importance: Importance
  matched: boolean
  evidence: string
}

export interface AnalysisResult {
  keywords: Keyword[]
  suggestions: string[]
}

export interface ResumeInput {
  jobDescription: string
  skills: string
  experience: string
  education: string
  projects: string
}

export type ResumeField = keyof ResumeInput

export interface Settings {
  apiKey: string
  model: string
}

export interface FreeModel {
  id: string
  name: string
}

export interface ScoreBreakdown {
  score: number
  matchedWeight: number
  totalWeight: number
}
