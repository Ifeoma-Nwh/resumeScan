# AGENTS.md

## Planning mode

- Always ask clarifying questions.
- Never assume design or features.
- Use deep-dive sub-agents to assist with research.
- Use deep-dive sub-agents to review the different aspects of your plan presenting to the user.

## Change / edit mode

- Never implement features yourself when possible - use sub-agents!
- Identify changes from the plan that can be implemented in parallel, and use sub-agents to implement the features efficiently
- when using sub-agents to implement features, act as a coordinator only
- Use these free models for the task (Deepseek, GLM, Mimo, Nemotron, Minimax, Big Pickle) - Deepseek free model for complex tasks (like coding), Mimo or Nemotron free model for UI tasks - GLM or Big Pickle for simpler tasks like documentation
- After completing features (large or small), always run commands like lint, type check to check code quality.

## Repository state

- `AGENTS.md` and `PLAN.md` are the only files. Treat `PLAN.md` as the spec and build order, and scaffold the Vite app before assuming any `src/` path exists.

## Stack

- Vite + React 19 + TypeScript (strict) + Tailwind CSS 4.
- Lint with ESLint.
- Unit tests use Vitest, scoped to the scoring logic.
- Single page, no router, no backend.

## Invariants

- The browser calls OpenRouter directly. Never add a server or proxy for the API key. The user's key lives in `sessionStorage` for the tab session and is sent only to `openrouter.ai`.
- Category weights: hard 3, domain 2, soft 1, education 1. Importance multiplier: required 1, preferred 0.5. Score is matched weight divided by total weight, rounded to an integer.
- Free models come from `GET https://openrouter.ai/api/v1/models`, filtered to zero-price entries. Keep a hardcoded fallback only for fetch failure.
- The model must return JSON only. When changing the contract, update the prompt, validation, and types together. Parsing strips code fences, extracts the JSON object, and retries once with a repair instruction.
- Deduplicate keywords case-insensitively and cap the list at 25.
- Chat requests use temperature 0.2 and a 90 second abort timeout.

## Verification

- No package manifest exists yet. After scaffolding, use the `package.json` scripts and run lint, tests, then build in that order.

## Planned layout

- Follow the file list and build order in `PLAN.md` rather than inventing new directories or boundaries.
