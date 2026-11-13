# resumeScan Plan

Initial plan for a personal web app that scores a resume against a job description using a free LLM as an ATS.

## Stack and shape

- Vite + React 19 + TypeScript (strict), Tailwind CSS 4, ESLint.
- Single page, no router.
- No backend. The browser calls OpenRouter directly with a key the user pastes in.
- State stays in React; the form draft, last result, and model choice persist to `localStorage`, while the API key lives in `sessionStorage` for the tab session only.

## Inputs

One page with five textareas, all paste friendly, each with a character counter:

1. Job description (required)
2. Resume skills, hard and soft together (required)
3. Work experience (required)
4. Education (required)
5. Projects (optional)

Analyze is disabled until the four required fields have content. A "Load example" link fills everything with sample data for quick testing.

## Model call

- Settings dialog: OpenRouter API key (password field, show/hide), model picker, save and clear. Key is stored only in `sessionStorage` (cleared when the tab closes) and sent only to OpenRouter.
- Free models are fetched at runtime from `GET https://openrouter.ai/api/v1/models` and filtered to zero-price models, so the list never goes stale. One sensible model is preselected, with a hardcoded fallback if the fetch fails.
- Request to `POST https://openrouter.ai/api/v1/chat/completions` with temperature 0.2 and a 90 second abort timeout.
- Prompt asks for JSON only, with this contract:

```json
{
  "keywords": [
    {
      "keyword": "React",
      "category": "hard",
      "importance": "required",
      "matched": true,
      "evidence": "short quote from the resume, or empty"
    }
  ],
  "suggestions": ["3 to 6 concrete improvements"]
}
```

- `category` is one of `hard`, `soft`, `domain`, `education`.
- `importance` is one of `required`, `preferred`.
- Parsing strips code fences, finds the JSON object, validates shape, and retries once with a repair instruction if parsing fails.
- Errors are mapped to readable messages: invalid key (401), rate limited (429), model unavailable, timeout, bad JSON.

## Scoring

- App code computes the percentage, not the model:
  - Weight by category: hard 3, domain 2, soft 1, education 1.
  - Multiply by importance: required 1, preferred 0.5.
  - Score = matched weight / total weight, rounded to an integer.
- Duplicate keywords are removed case-insensitively and the list is capped at 25.
- The evidence string lets the user see why a keyword counted as matched.
- `scoring.ts` stays a pure function with a few Vitest cases.

## Results panel

- Large SVG score ring with color bands: rose under 50, amber 50 to 74, emerald 75 and up, plus a short verdict.
- Missing keywords as priority chips, with a "Copy missing keywords" button.
- Matched keywords as muted chips, with evidence on hover or expand.
- Short suggestions list.
- Empty state before first run, loading skeleton during analysis, error banner with a link to the OpenRouter keys page when needed.

## Layout

- Desktop: form on the left, results column on the right, results sticky.
- Mobile: stacked, auto-scroll to results after analysis.
- Settings gear in the header, accessible dialog with proper labels and focus handling.

## Files

```text
package.json, vite.config.ts, tsconfig.json, index.html, PLAN.md, AGENTS.md
src/main.tsx, App.tsx, index.css, types.ts
src/lib/openrouter.ts, prompt.ts, scoring.ts, storage.ts, normalize.ts, sample.ts
src/components/ResumeForm.tsx, SettingsDialog.tsx, ResultsPanel.tsx, ScoreRing.tsx, KeywordChips.tsx
src/lib/scoring.test.ts
README.md
```

## Build order

1. Scaffold Vite React TS, Tailwind, ESLint.
2. Types, sample data, storage helpers.
3. Prompt, OpenRouter client, JSON validation, error mapping.
4. Scoring function plus tests.
5. Settings dialog and form.
6. Results panel and layout polish.
7. README with setup, free key steps, and model notes. Run lint, type check, tests, and build.

## Workflow

- Follow `AGENTS.md` for planning and change/edit mode.
- Ask clarifying questions rather than assuming design or features.
- Use sub-agents for research, plan review, and implementation, and act as coordinator.
- Load the `impeccable` skill for all UI work: the form, settings dialog, results panel, score ring, chips, empty and loading states, and responsive layout polish.
- After each feature, run lint and type check.

## Open questions

- Should hard and soft skills share one textarea? The current plan says yes, since the job description drives keyword extraction.
- Should suggestions be included alongside keywords? The current plan says yes, to make the score actionable.
- Where will the app deploy? The output is a static site that works on Vercel or Netlify.

## Security hardening (follow-up)

A security review found no SQL injection surface, since there is no backend or database, and no XSS path, since React escapes every rendered string and the code uses no `dangerouslySetInnerHTML`, `eval`, or `new Function`. Prompt injection through the five input fields is possible, but strict output validation in `normalize.ts` keeps it to semantic damage only, such as a skewed score. Two follow-up changes are planned.

### API key lifetime

The key is scoped to the tab session, so a new tab requires pasting it again.

- Move the API key from `localStorage` to `sessionStorage`, so it clears when the tab closes.
- Keep the model choice in `localStorage`, since it is not secret and is useful across tabs.
- Delete the legacy `resumeScan.settings` entry from `localStorage` on first load, so any key already on disk is wiped.
- Clear the stored key when OpenRouter returns 401 (`invalid-key`), so a rejected key does not stay stored.
- The settings Clear button clears both the key and the model.
- Affected files: `src/lib/storage.ts`, `src/App.tsx`, plus copy in `SettingsDialog.tsx` and `ResumeForm.tsx`.
- Update the `AGENTS.md` invariant and the README privacy note to match.

### Free-model training disclaimer

- Add a static amber notice in `ResumeForm.tsx`, directly above the Analyze button, styled like the amber verdict region in `ResultsPanel.tsx`.
- Copy: free OpenRouter models may use input for training. Avoid confidential details: replace company names with `[Company]`, towns with `[City]`, and project links with `[Project]` before analyzing.
- Always visible, not dismissible. Use `role="note"`. No new state or dependencies.
- Add a line to the README privacy note.

### Deferred

- Per-field input length caps. Noted in the review as cheap insurance against oversized prompts, but not approved for this change.
- A UI note that pasted content can influence the model's output. Prompt injection stays documented here only.

### Verification

Run `npm run lint`, `npm run typecheck`, `npm run test`, then `npm run build`.
