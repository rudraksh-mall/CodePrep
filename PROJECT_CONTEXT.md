# CodePrep AI

Tech Stack

Frontend:

- React
- Vite
- Tailwind CSS
- React Query

Backend:

Completed:

- Backend Setup
- MongoDB Connection
- User Model
- JWT Authentication
- Register API
- Login API
- Protected Route
- Problem Model (PROMPT 09)
- Problems Seed Script (PROMPT 10)
- Problems API (PROMPT 11)

Design System:

- Dark theme (class-based with `darkMode: 'class'`)
- Extended Tailwind config with semantic colors (surface, primary), custom font families (Inter, JetBrains Mono), animation tokens (fade-in, slide-up)
- Global CSS with CSS custom properties for bg/surface/border/text colors
- ThemeContext for dark/light toggle with localStorage persistence
- Reusable components: Button (variants: primary/secondary/ghost/danger, sizes: sm/md/lg, loading), Input (dark-themed, error state), Card (+ CardHeader/CardBody/CardFooter), Modal (Escape/overlay close, animated), Loader (Spinner/PageLoader/Skeleton)

AI:

- LangChain
- Gemini
- ChromaDB

Architecture:

- Controller-Service Pattern
- JWT Authentication
- REST APIs

Rules:

- Never generate entire project
- Generate one task at a time
- Follow Controller-Service Pattern

Completed:

- PROMPT 09 - Problem Model (Mongoose schema with slug auto-generation and text indexes)
- PROMPT 10 - Problems Seed Script (50 DSA problems across 7 topics)
- PROMPT 11 - Problems API (Backend listing, filtering, pagination endpoints)
- PROMPT 12 - Problems Page (Frontend listing, filters, search, pagination, difficulty badge)
- PROMPT 13 - Problem Detail Page (Full problem view with markdown description, examples, constraints, right sidebar with progress/hints/notes)
- PROMPT 19 - Hint Generation Service & API (AI-powered LCEL chain with ChatPromptTemplate, 3-level hints via POST /api/ai/hint, Zod validation)
- Global Design System (Tailwind dark theme, reusable Button/Card/Input/Modal/Loader, ThemeContext)


Current Task:

- TBD
