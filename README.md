# AI Resume Reviewer

A production-style full-stack web application that lets users upload a resume in PDF or DOCX format, extract the text server-side, analyze it with Google Gemini, score it with deterministic weights, and review the results in a polished SaaS-style dashboard.

The project is built with Next.js, TypeScript, Tailwind CSS, Zod, `pdf-parse`, `mammoth`, and the official Google Gen AI SDK using strict JSON schema output.

## Features

- Resume upload with drag-and-drop support
- PDF and DOCX text extraction
- Manual resume text fallback
- Optional job description matching and tailoring mode
- Weighted overall score out of 100
- Category scores for content, experience, ATS, skills, formatting, grammar, and job match
- Strengths, weaknesses, missing sections, ATS issues, grammar suggestions, and formatting suggestions
- Suggested rewritten bullet points with one-click copy
- Export analysis as a PDF report
- Dark mode toggle
- Local history of previous scans
- Demo mode with built-in sample resume and job description
- Server-side validation, file size limits, MIME checks, and lightweight rate limiting

## Tech Stack

- Frontend: Next.js App Router, React 19, TypeScript
- Styling: Tailwind CSS
- AI: Google Gemini API with structured JSON output
- Parsing: `pdf-parse` for PDF, `mammoth` for DOCX
- Validation: Zod
- Export: `pdf-lib`
- Persistence: Local browser storage for scan history

## Project Structure

```text
.
├── app
│   ├── analyze
│   │   └── page.tsx
│   ├── api
│   │   ├── analyze-resume
│   │   │   └── route.ts
│   │   └── export-pdf
│   │       └── route.ts
│   ├── history
│   │   └── page.tsx
│   ├── error.tsx
│   ├── globals.css
│   ├── icon.svg
│   ├── layout.tsx
│   ├── loading.tsx
│   ├── not-found.tsx
│   └── page.tsx
├── components
│   ├── dashboard
│   │   ├── bullet-improvement-card.tsx
│   │   ├── category-grid.tsx
│   │   ├── feedback-list-card.tsx
│   │   ├── history-list.tsx
│   │   ├── job-match-card.tsx
│   │   └── results-dashboard.tsx
│   ├── forms
│   │   ├── analyzer-form.tsx
│   │   └── dropzone.tsx
│   ├── layout
│   │   ├── footer.tsx
│   │   └── navbar.tsx
│   ├── providers
│   │   └── theme-provider.tsx
│   └── ui
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── empty-state.tsx
│       ├── progress-bar.tsx
│       ├── score-ring.tsx
│       ├── section-heading.tsx
│       └── theme-toggle.tsx
├── lib
│   ├── ai
│   │   ├── gemini.ts
│   │   └── prompt.ts
│   ├── export
│   │   └── build-analysis-pdf.ts
│   ├── history
│   │   └── storage.ts
│   ├── parsers
│   │   ├── resume-parser.ts
│   │   └── text-cleaner.ts
│   ├── scoring
│   │   └── weights.ts
│   ├── utils
│   │   ├── cn.ts
│   │   ├── demo-content.ts
│   │   ├── file.ts
│   │   ├── http.ts
│   │   └── rate-limit.ts
│   └── validators
│       ├── analysis.ts
│       └── resume.ts
├── public
│   └── demo
│       ├── demo-job-description.txt
│       └── demo-resume.txt
├── types
│   ├── history.ts
│   └── pdf-parse.d.ts
├── .env.example
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── README.md
├── tailwind.config.ts
└── tsconfig.json
```

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the environment template:

   ```bash
   cp .env.example .env.local
   ```

3. Add your Gemini API key to `.env.local`:

   ```bash
   GEMINI_API_KEY=your_gemini_api_key_here
   GOOGLE_MODEL=gemini-2.5-flash
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

- `npm run dev` starts the Next.js dev server
- `npm run build` builds the production app
- `npm run start` runs the production build locally
- `npm run lint` runs ESLint
- `npm run typecheck` runs TypeScript checks

## Resume Parsing Flow

The parsing pipeline lives in [lib/parsers/resume-parser.ts](/Users/e3tsamy/Documents/Programming/test_codex/lib/parsers/resume-parser.ts).

1. The backend accepts `multipart/form-data` in [app/api/analyze-resume/route.ts](/Users/e3tsamy/Documents/Programming/test_codex/app/api/analyze-resume/route.ts).
2. The route validates file size and ensures the file extension is `pdf` or `docx`.
3. PDF files are parsed with `pdf-parse`.
4. DOCX files are parsed with `mammoth.extractRawText`.
5. Extracted text is normalized in [lib/parsers/text-cleaner.ts](/Users/e3tsamy/Documents/Programming/test_codex/lib/parsers/text-cleaner.ts).
6. If parsing fails and the user pasted resume text manually, the route falls back to the pasted text instead of failing hard.

## AI Analysis Flow

The AI pipeline is split into a few focused files:

- Prompt template: [lib/ai/prompt.ts](/Users/e3tsamy/Documents/Programming/test_codex/lib/ai/prompt.ts)
- Gemini call and fallback repair logic: [lib/ai/gemini.ts](/Users/e3tsamy/Documents/Programming/test_codex/lib/ai/gemini.ts)
- Zod schema plus JSON schema contract: [lib/validators/analysis.ts](/Users/e3tsamy/Documents/Programming/test_codex/lib/validators/analysis.ts)

The request flow is:

1. Extracted resume text and optional job description are sent to Google Gemini.
2. The model is instructed to behave like an expert resume reviewer, ATS specialist, recruiter assistant, and career coach.
3. The model must return JSON only, matching the strict schema used by the frontend.
4. The backend validates the JSON with Zod.
5. If the model returns malformed JSON, the backend triggers a second repair pass that converts the raw output into schema-safe JSON.
6. The backend recalculates the overall score with deterministic server-side weights before returning the final payload.

## Exact Prompt Template

The exact prompt used by the backend lives in [lib/ai/prompt.ts](/Users/e3tsamy/Documents/Programming/test_codex/lib/ai/prompt.ts). The important design goals are:

- never fabricate resume content
- call out missing information explicitly
- prefer tactical rewrites over vague advice
- return JSON only
- set `jobMatch` to `0` when no job description exists

## Scoring System

The score weights are defined in [lib/scoring/weights.ts](/Users/e3tsamy/Documents/Programming/test_codex/lib/scoring/weights.ts).

When a job description is provided:

- Content quality: 25%
- Work experience impact: 20%
- ATS compatibility: 15%
- Skills relevance: 10%
- Formatting/readability: 10%
- Grammar/style: 10%
- Job match: 10%

When no job description is provided:

- Content quality: 28%
- Work experience impact: 23%
- ATS compatibility: 17%
- Skills relevance: 12%
- Formatting/readability: 10%
- Grammar/style: 10%
- Job match: 0%

This makes the final score transparent and non-random. The model supplies category scores, and the server computes the overall score.

## API Endpoints

- `POST /api/analyze-resume`
  - Accepts `resumeFile`, `resumeText`, `jobDescription`, `tailorMode`, and `demoMode`
  - Returns the structured analysis JSON used by the UI

- `POST /api/export-pdf`
  - Accepts a JSON payload with `fileName`, `createdAt`, and `analysis`
  - Returns a downloadable PDF report

## Demo Mode

The app includes built-in demo content in:

- [public/demo/demo-resume.txt](/Users/e3tsamy/Documents/Programming/test_codex/public/demo/demo-resume.txt)
- [public/demo/demo-job-description.txt](/Users/e3tsamy/Documents/Programming/test_codex/public/demo/demo-job-description.txt)
- [lib/utils/demo-content.ts](/Users/e3tsamy/Documents/Programming/test_codex/lib/utils/demo-content.ts)

If no Gemini API key is configured and the user clicks “Try demo mode,” the backend returns a baked-in demo analysis so the app is still usable for portfolio demos.

## Security and Robustness Notes

- File uploads are limited to 5 MB
- Only PDF and DOCX resumes are accepted
- Text extraction failures surface clear user-facing errors
- API keys stay server-side only
- Resume history is stored locally in the browser, not in a remote database
- A lightweight in-memory rate limiter protects the analysis endpoint
- Schema validation guards the UI from malformed AI output

## Deployment to Vercel

The easiest production path is Vercel because the app already uses the Next.js App Router and server routes.

### Before You Deploy

1. Make sure the project builds locally:

   ```bash
   npm run typecheck
   npm run lint
   npm run build
   ```

2. Push the repository to GitHub.

3. Keep your Gemini key private. Only add it in Vercel project environment settings, never in client-side code.

### Deploy Steps

1. Sign in to Vercel and choose **Add New Project**.
2. Import your GitHub repository.
3. Let Vercel detect the framework as **Next.js**.
4. Add these environment variables in the Vercel project settings:

   ```bash
   GEMINI_API_KEY=your_real_gemini_api_key
   GOOGLE_MODEL=gemini-2.5-flash
   NEXT_PUBLIC_APP_URL=https://your-deployed-domain.vercel.app
   ```

5. Click **Deploy**.
6. After the first deployment, open the site and test:
   - PDF upload
   - DOCX upload
   - demo mode
   - export PDF
   - job description matching

### Recommended Vercel Settings

- Framework preset: `Next.js`
- Install command: `npm install`
- Build command: `npm run build`
- Output setting: default Next.js output

### Production Checklist

- Add the final production URL to `NEXT_PUBLIC_APP_URL`
- Confirm Gemini quota and billing are active
- Test the live `/api/analyze-resume` route with a real resume
- Make sure the site no longer references localhost anywhere
- Re-run one final `npm run build` before pushing

### Optional Domain Upgrade

Once the Vercel deployment works, you can attach a custom domain from the Vercel project dashboard so the portfolio link looks more professional on your resume.

## Local Verification

The project was checked with:

```bash
npm run typecheck
npm run lint
```

## Future Improvements

- Add authentication and private saved reports with a database
- Add OCR support for image-based PDF resumes
- Introduce side-by-side resume version comparison
- Add analytics around most common resume issues
- Support multiple export formats such as DOCX or Markdown
- Add recruiter-facing share links for final reports
