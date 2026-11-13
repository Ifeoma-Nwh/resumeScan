# resumeScan

resumeScan is a single page web app that scores a resume against a job description using a free LLM through OpenRouter as a lightweight ATS. It is built with Vite, React 19, TypeScript (strict), and Tailwind CSS 4. There is no backend: the browser calls OpenRouter directly, and the user pastes their own API key, which is stored in `sessionStorage` for the tab session and sent only to `openrouter.ai`.

This is a first web application, built with a coding agent ([OpenCode](https://opencode.ai)) rather than written by hand.

## Skills used

- Vite, React 19, TypeScript strict mode, and Tailwind CSS 4 for the app shell and UI.
- OpenRouter chat completions, prompt design, and JSON parsing with runtime validation of `unknown` data.
- React state with `sessionStorage` and `localStorage` persistence helpers.
- SVG data visualization for the score ring, plus accessible forms, dialogs, and loading and empty states.
- The `impeccable` skill from `pbakaus/impeccable` (installed in `.agents/skills/impeccable`) for UI design and review.
- ESLint, `tsc -b`, and Vitest for quality checks.

## How it works

You paste a job description, your skills, work experience, and education (projects are optional) into a form. When you run an analysis, the app sends that text to the selected free OpenRouter model and asks it to return JSON: a list of keywords found in the job description, each with a category, an importance level, whether the resume matched it, and a short evidence quote, plus a list of improvement suggestions.

The model never computes the score. The app does that locally in `src/lib/scoring.ts`:

- Category weights: hard 3, domain 2, soft 1, education 1.
- Importance multipliers: required 1, preferred 0.5.
- Score = matched weight divided by total weight, as a percentage rounded to an integer.

Duplicate keywords are deduplicated case-insensitively and the list is capped at 25 keywords. The results panel shows the score in a colored ring, missing keywords as priority chips with a copy button, matched keywords as muted chips with their evidence, and the suggestions list.

## Getting an OpenRouter key

Free models on OpenRouter still require an API key:

1. Sign in at [openrouter.ai](https://openrouter.ai) and create a key at [openrouter.ai/keys](https://openrouter.ai/keys).
2. Open the settings gear in the app header, paste the key, and save it. It is kept in `sessionStorage` for this tab session only, cleared when the tab closes, and sent only to `openrouter.ai`.

No key is set up for you and none is bundled with the app.

## Setup

```sh
npm install
npm run dev       # start the dev server
npm run build     # type check and build a static site in dist/
npm run preview   # serve the built site locally
```

Quality checks:

```sh
npm run lint       # ESLint
npm run typecheck  # tsc -b
npm test           # Vitest, scoped to the scoring logic
```

## Models

The model picker in settings lists free models fetched at runtime from `GET https://openrouter.ai/api/v1/models`, filtered to entries with zero prompt and completion prices, so the list does not go stale. If that request fails, a small hardcoded fallback list is used instead.

Requests are sent with temperature 0.2 and a 90 second abort timeout. If the model's response is not valid JSON, the app retries once with a repair instruction before failing.

Some free models are rate limited or slow. If an analysis fails with a rate limit, timeout, or model unavailable error, the first thing to try is switching to a different free model in settings.

## Privacy and limitations

- Your API key is kept in `sessionStorage` for the tab session and cleared when the tab closes. Your model choice stays in `localStorage`.
- Resume text is sent directly to OpenRouter, and only when you run an analysis. Free OpenRouter models may use input for training, so replace company names with `[Company]`, towns with `[City]`, and project links with `[Project]` before analyzing confidential material.
- There is no server: nothing is proxied, and results are not saved remotely. The last result, the form draft, and your model choice persist in `localStorage` only.
- The score is a heuristic based on keyword matching. It is not a guarantee of how any human reviewer or real ATS will treat your resume.

## Project structure

```text
src/
  App.tsx            # page layout, state, and orchestration
  types.ts           # shared types: Keyword, ResumeInput, Settings, AnalysisResult
  lib/
    openrouter.ts    # OpenRouter client: free model fetch, chat request, error mapping
    prompt.ts        # prompt and repair prompt builders
    scoring.ts       # pure scoring function (with Vitest cases)
    normalize.ts     # JSON parsing and validation of the model contract
    storage.ts       # session and local storage helpers for settings, draft, and result
    sample.ts        # example data for the "Load example" link
  components/
    ResumeForm.tsx   # the five paste friendly fields with character counters
    SettingsDialog.tsx # API key and model picker dialog
    ResultsPanel.tsx # score ring, keyword chips, suggestions
    ScoreRing.tsx    # SVG score ring with color bands
    KeywordChips.tsx # priority and matched keyword chips
```
