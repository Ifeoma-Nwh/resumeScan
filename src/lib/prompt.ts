import type { ResumeInput } from '../types'

const JSON_CONTRACT =
  '{"keywords":[{"keyword":"React","category":"hard","importance":"required","matched":true,"evidence":"short quote from the resume, or empty"}],"suggestions":["3 to 6 concrete improvements"]}'

const MAX_REPAIR_RESPONSE_LENGTH = 4000

function section(value: string): string {
  const trimmed = value.trim()
  return trimmed === '' ? '(empty)' : trimmed
}

function truncate(value: string): string {
  if (value.length <= MAX_REPAIR_RESPONSE_LENGTH) return value
  return `${value.slice(0, MAX_REPAIR_RESPONSE_LENGTH)}\n...[truncated]`
}

export function buildAnalysisPrompt(input: ResumeInput): string {
  return `You are an applicant tracking system (ATS) that compares a resume against a job description.

Analyze the resume sections below against the job description. Extract the most important keywords the employer is looking for, decide whether the resume supports each one, and suggest concrete improvements.

Job description:
${section(input.jobDescription)}

Resume skills (hard and soft skills):
${section(input.skills)}

Work experience:
${section(input.experience)}

Education:
${section(input.education)}

Projects (optional):
${section(input.projects)}

Rules:
- Extract 12 to 25 important keywords from the job description.
- Use category "hard" for tools, technologies, and concrete skills, "domain" for industry or product knowledge, "soft" for interpersonal and leadership skills, and "education" for degrees, certifications, and formal training.
- Use importance "required" when the job description treats the keyword as mandatory and "preferred" when it is a nice-to-have.
- Set "matched" to true only when the resume actually supports the keyword. Do not guess or infer skills that are not present.
- For matched keywords, put a short direct quote from the resume in "evidence". For unmatched keywords, use an empty evidence string.
- Provide 3 to 6 concrete, actionable suggestions for improving the resume for this job.
- Return JSON only. Do not include markdown, code fences, or commentary.
- Use exactly this JSON shape:
${JSON_CONTRACT}`
}

export function buildRepairPrompt(
  invalidResponse: string,
  parseError: string,
): string {
  return `Your previous response could not be parsed as valid JSON.

Parse error: ${parseError}

Previous response:
${truncate(invalidResponse)}

Repair the previous response so it is valid JSON only. Keep the same analysis and do not add commentary, markdown, or code fences.

Return JSON only using exactly this JSON shape:
${JSON_CONTRACT}`
}
