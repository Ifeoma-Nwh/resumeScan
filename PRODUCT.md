# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

A single job seeker, working alone at a browser, tailoring one resume against a specific job description before applying. The tool is personal first but shareable: other job seekers can use it with their own OpenRouter key. There are no accounts, teams, or multi-user features.

## Product Purpose

resumeScan scores a resume against a job description using a free LLM as a lightweight ATS. It exists to show, before applying, which job-description keywords the resume hits and which it misses, so the user knows what to fix. Success means the user leaves with a score they trust, a clear list of missing keywords, and concrete edits to make.

## Positioning

The model only extracts and classifies keywords from the job description; the score is computed locally by a deterministic, inspectable weighting formula in `src/lib/scoring.ts`. Every keyword carries a category, an importance level, a matched flag, and a short evidence quote, so the result is auditable rather than a single opaque number. The browser talks to OpenRouter directly with the user's own key: no backend, no proxy, no bundled key.

## Operating Context

The user pastes a job description, their skills, work experience, education, and optionally projects into a single page. They run an analysis against a free OpenRouter model and read a score ring, missing keywords, matched keywords with evidence, and a short suggestion list. The form draft, last result, and model choice persist in `localStorage`, while the API key lives in `sessionStorage` for the tab session. Network-dependent usage: a failed run is usually a rate limit, timeout, or unavailable free model, and switching models is the first remedy.

## Capabilities and Constraints

- Vite + React 19 + TypeScript strict + Tailwind CSS 4, single page, no router, no backend.
- API key lives in `sessionStorage` for the tab session and is sent only to `openrouter.ai`; no server proxy is permitted.
- Free models only, fetched at runtime from `GET https://openrouter.ai/api/v1/models` and filtered to zero-price entries, with a hardcoded fallback if the fetch fails.
- The model must return JSON only. Parsing strips code fences, extracts the JSON object, validates shape, and retries once with a repair instruction.
- Scoring weights: hard 3, domain 2, soft 1, education 1; importance multiplier required 1, preferred 0.5; score is matched weight over total weight, rounded to an integer. App code computes it, never the model.
- Keywords are deduplicated case-insensitively and capped at 25. Chat requests use temperature 0.2 and a 90 second abort timeout.
- Deploy target undecided. The build is a static site, suitable for any static host.
- The score is a heuristic keyword match, not a prediction of a human reviewer or a real ATS.

## Evidence on Hand

- `README.md` documents how it works, key setup, model behavior, and privacy limits.
- `PLAN.md` holds the spec and build order.
- `src/lib/sample.ts` provides the "Load example" data used for quick testing.
- No user testimonials, customer counts, benchmarks, or pricing exist, and none should be fabricated.

## Product Principles

- The score must be explainable: every point traces to a keyword, its weight, and its evidence.
- Local-first and private: the key and resume text stay in the browser except for the direct OpenRouter request.
- Free and frictionless: no accounts, no payment, no backend to operate.
- Fail honestly: bad keys, rate limits, timeouts, and malformed JSON surface as readable errors, not silent zeros.

## Accessibility & Inclusion

Hold the UI to WCAG 2.2 AA: keyboard operable controls, labelled inputs, visible focus, and sufficient contrast.
