# CodePrep AI

## Tech Stack

### Frontend
React · Vite · Tailwind CSS · React Query · Recharts

### Backend
Node.js · Express · MongoDB · Mongoose · LangChain · ChromaDB · Gemini

### AI / ML
LangChain · Gemini · ChromaDB

---

## Architecture

| Pattern | Details |
|---|---|
| **Backend** | Controller-Service Pattern |
| **Auth** | JWT with Bearer tokens |
| **API** | RESTful, rate-limited (100 req/15min) |
| **Validation** | Zod schemas via middleware |
| **Frontend state** | React Query for server state, Context for auth/theme |

---

## Design System

| Area | Details |
|---|---|
| **Theme** | Dark/light via `darkMode: 'class'`, persisted to localStorage, respects `prefers-color-scheme` |
| **Colors** | `surface` (slate scale) and `primary` (indigo scale) — both 50–950 |
| **Typography** | `font-sans`: Inter, system-ui · `font-mono`: JetBrains Mono, Fira Code |
| **Animations** | `fade-in` (0.2s), `slide-up` (0.3s, 12px translate) |
| **CSS vars** | `--color-bg`, `--color-surface`, `--color-border`, `--color-text`, `--color-text-muted` toggle on `.dark` |

### Reusable Components (`src/components/ui/`)

| Component | Props / Variants |
|---|---|
| **Button** | `variant`: primary, secondary, ghost, danger · `size`: sm, md, lg · `loading` spinner |
| **Input** | `label`, `error`, dark-themed bg/text/placeholder |
| **Card** | + `CardHeader`, `CardBody`, `CardFooter` named exports |
| **Modal** | Escape/overlay close, scroll lock, fade-in backdrop, slide-up content |
| **Loader** | `Spinner` (3 sizes), `PageLoader`, `Skeleton` (animated pulse) |

---

## Rules

- Never generate entire project
- One task at a time
- Follow Controller-Service Pattern
- Do not modify unrelated files

---

## Completed Prompts

| Prompt | File(s) | Description |
|---|---|---|
| **PROMPT 09** | `server/src/models/Problem.js` | Mongoose schema with slug auto-generation and text indexes |
| **PROMPT 10** | `server/src/scripts/seedProblems.js` | Seed script — 50 DSA problems across 7 topics |
| **PROMPT 11** | `server/` (controller, service, routes) | Problems API — listing, filtering, pagination |
| **PROMPT 12** | `client/src/pages/ProblemsPage.jsx` + filters, badges, hooks | Problem listing with search, difficulty/topic filters, pagination |
| **PROMPT 13** | `client/src/pages/ProblemDetailPage.jsx` | Full problem view — markdown description, examples, constraints, sidebar |
| **PROMPT 19** | `server/src/services/ai/hint.service.js` + controller, routes | AI hint generation — LCEL chain, 3 levels, Zod validation |
| **PROMPT 20** | `client/src/components/ai/HintPanel.jsx` + AI API | Frontend hint panel — 3 progressive buttons, loading/disabled states, callout |
| **PROMPT 21** | `server/src/middleware/upload.middleware.js` + `server/src/utils/pdfParser.js` | Multer PDF upload (5MB limit, memoryStorage, PDF-only filter) and pdf-parse extraction |
| **PROMPT 22** | `server/src/models/Resume.js` + `server/src/services/ai/resume.service.js` | Resume Mongoose schema (skills, experience, education) and LLM analysis chain with JsonOutputParser |
| **PROMPT 23** | `server/src/controllers/ai.controller.js` + `server/src/routes/ai.routes.js` | Resume upload endpoint — `POST /api/ai/resume/upload` with PDF upload, Multer error handling, LLM analysis, MongoDB persistence |
| **PROMPT 24** | `server/src/models/InterviewQuestion.js` + `server/src/services/ai/interviewQuestion.service.js` + controller/routes | Interview question generation — `POST /api/ai/resume/:resumeId/questions`, LLM chain with JsonOutputParser, 60/20/20 category split, Zod validation |
| **PROMPT 32** | `client/src/pages/AnalyticsPage.jsx` + `client/src/components/analytics/` (3 chart components) + router update | Analytics dashboard — recharts PieChart (difficulty), BarChart (top 10 topics), LineChart (solved over 30 days), summary stat cards |

---

## Current Task

**TBD**
