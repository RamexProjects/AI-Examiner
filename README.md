# AI-Examiner

An AI-powered quiz application that dynamically generates quizzes on any topic using Google Gemini. Built with Next.js 16, React 19, TypeScript, and Tailwind CSS 4.

## Tech Stack

- **Next.js 16** (App Router, Server Actions)
- **React 19** with Server/Client Components
- **TypeScript 5**
- **Tailwind CSS 4**
- **Google Generative AI SDK** (`@google/generative-ai`)
- **ESLint 9** (`eslint-config-next`)

## How It Works

### Quiz Generation

The user configures a quiz (topic, difficulty, question type, mode, language) in `QuizConfig.tsx`. On submit, `page.tsx` calls the `generateQuiz` server action (`app/actions/generateQuiz.ts`), which sends a structured prompt to the Google Gemini API. The AI returns a JSON array of question objects, which is validated for shape before being stored in component state.

### Game Modes

- **Standard** — Configurable difficulty and question type. 10 questions. Wrong answers show correct feedback but the quiz continues. Results show a percentage score (≥70% passes).
- **Survival** — Hard difficulty, mixed question types (7 Multiple Choice + 3 True/False). First wrong answer ends the game immediately (with a 1.5s delay and shake animation). Score is "levels cleared" (number of correct answers).

### Question Types

- **Multiple Choice** — 4 clickable options. Timer applies.
- **True / False** — 2 clickable options. Timer applies.
- **Short Answer** — Free-text input with submit button or Enter key. Untimed.

### Timer System

Easy (15s), Medium (20s), Hard (25s). Harder questions get more thinking time. A color-coded progress bar (green → yellow → red) provides visual feedback. When time expires, an empty answer is submitted (counted as wrong).

### Answer Matching

**Multiple Choice & True/False**: Exact string comparison after basic normalization (trim, lowercase, collapse whitespace). No character stripping — symbols (`%`, `$`, `+`) and all scripts are preserved.

**Short Answer**: Four strategies attempted in order:
1. **Exact match** after normalization.
2. **Levenshtein distance** on the full string (≥80% similarity catches typos like "recieve" vs "receive").
3. **Significant-token matching** — stop words (`the`, `of`, `in`, etc.) are filtered, remaining content words are compared with per-word typo tolerance. ≥70% must match. Handles rephrasing like "JavaScript array methods" vs "methods of array in JS."
4. **Substring containment** (≥4 chars) — catches partial answers like "react" inside "react js."

### Language Support

English and Amharic. The language selector in `QuizConfig.tsx` controls both the UI language (all labels/buttons via the translation map in `lib/translations.ts`) and the quiz content language (the AI prompt instructs Gemini to output in the selected language). Non-Latin scripts are fully supported in answer matching — characters are never stripped.

### State Flow

`page.tsx` acts as a state machine with four screens:
1. **QuizConfig** — setup form → on submit, transitions to generating
2. **QuizSkeleton** — loading pulse while AI generates → on success, transitions to playing
3. **QuizGame** — active quiz → on finish, transitions to grading
4. **ResultSkeleton** — 2-second grading delay → transitions to results
5. **ValuationPage** — results review → "Start New Quiz" resets to config

## Project Structure

```
app/
├── actions/generateQuiz.ts   # Server action — calls Gemini, validates response
├── layout.tsx                # Root layout (fonts, LanguageProvider)
├── page.tsx                  # State machine orchestrator
└── globals.css               # Tailwind + custom shake animation

components/
├── QuizConfig.tsx            # Setup form (topic, difficulty, type, mode, language)
├── QuizGame.tsx              # Active quiz (questions, timer, streak, answer UI)
├── QuizSkeleton.tsx          # Loading skeleton for quiz generation
├── ResultSkeleton.tsx        # Loading skeleton for grading phase
└── ValuationPage.tsx         # Results review (score, per-question feedback)

context/LanguageContext.tsx   # Language state provider + useLanguage hook
lib/
├── translations.ts           # English + Amharic translation map
└── utils.ts                  # Answer matching, constants, validation
types/index.ts                # TypeScript types (Question, QuizSettings, etc.)
```

## Getting Started

```bash
cp .env.example .env.local   # Add GEMINI_API_KEY
npm install
npm run dev                  # opens http://localhost:3000
```
