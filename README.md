# AI Resume Reviewer

A production-style full-stack web app that reviews resumes with AI, scores them with transparent weights, and presents ATS-focused feedback in a polished dashboard.

**Live app:** [resume-reviewer-app-kohl.vercel.app](https://resume-reviewer-app-kohl.vercel.app)  
**GitHub repo:** [Ramyprojs/resume-reviewer-app](https://github.com/Ramyprojs/resume-reviewer-app)

## Overview

AI Resume Reviewer lets users upload a PDF or DOCX resume, extract the text server-side, analyze it with Google Gemini, and review the results in a structured UI. The app supports job description matching, score breakdowns, rewrite suggestions, PDF export, local scan history, and a grounded fallback analysis when live AI is unavailable.

This project was built to feel like a real SaaS product, not a toy demo. It focuses on:

- clean UX and responsive UI
- reliable file parsing
- structured AI output with schema validation
- transparent scoring logic
- safe error handling and graceful fallbacks
- simple Vercel deployment

## Features

- Upload resumes in `PDF` or `DOCX`
- Manual resume text fallback
- Optional job description matching
- Overall score out of 100
- Category scores for content, experience, ATS, skills, formatting, grammar, and job match
- Strengths, weaknesses, missing sections, ATS issues, keyword suggestions, and formatting suggestions
- Suggested rewritten bullet points
- Downloadable PDF report
- Local history of previous analyses
- Demo mode with built-in sample content
- Dark mode
- Grounded local fallback analysis if Gemini is unavailable

## Tech Stack

- **Framework:** Next.js App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **AI:** Google Gemini API via `@google/genai`
- **Validation:** Zod
- **PDF parsing:** `pdf-parse`
- **DOCX parsing:** `mammoth`
- **PDF export:** `pdf-lib`
- **State:** React hooks
- **Persistence:** browser local storage for history

## Project Structure

```text
.
├── app
│   ├── analyze
│   ├── api
│   │   ├── analyze-resume
│   │   └── export-pdf
│   ├── history
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components
│   ├── dashboard
│   ├── effects
│   ├── forms
│   ├── layout
│   ├── providers
│   └── ui
├── lib
│   ├── ai
│   ├── export
│   ├── history
│   ├── parsers
│   ├── scoring
│   ├── utils
│   └── validators
├── public
│   └── demo
└── types
```

## Key Files

- API route: [`app/api/analyze-resume/route.ts`](./app/api/analyze-resume/route.ts)
- Export route: [`app/api/export-pdf/route.ts`](./app/api/export-pdf/route.ts)
- Landing page: [`app/page.tsx`](./app/page.tsx)
- Analyzer page: [`app/analyze/page.tsx`](./app/analyze/page.tsx)
- Main analyzer form: [`components/forms/analyzer-form.tsx`](./components/forms/analyzer-form.tsx)
- Results dashboard: [`components/dashboard/results-dashboard.tsx`](./components/dashboard/results-dashboard.tsx)
- Gemini integration: [`lib/ai/gemini.ts`](./lib/ai/gemini.ts)
- Local fallback analysis: [`lib/ai/local-analysis.ts`](./lib/ai/local-analysis.ts)
- Prompt template: [`lib/ai/prompt.ts`](./lib/ai/prompt.ts)
- Resume parser: [`lib/parsers/resume-parser.ts`](./lib/parsers/resume-parser.ts)
- Scoring logic: [`lib/scoring/weights.ts`](./lib/scoring/weights.ts)
- Response schema: [`lib/validators/analysis.ts`](./lib/validators/analysis.ts)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Create your local environment file

```bash
cp .env.example .env.local
```

### 3. Add environment variables

```bash
GEMINI_API_KEY=your_gemini_api_key_here
GOOGLE_MODEL=gemini-2.5-flash
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Start the app

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Available Scripts

- `npm run dev` - start the local development server
- `npm run build` - build the app for production
- `npm run start` - run the production build locally
- `npm run lint` - run ESLint
- `npm run typecheck` - run TypeScript checks

## How It Works

### Resume Parsing

The file parsing flow is handled in [`lib/parsers/resume-parser.ts`](./lib/parsers/resume-parser.ts).

1. The app accepts `multipart/form-data` in [`app/api/analyze-resume/route.ts`](./app/api/analyze-resume/route.ts).
2. Uploaded files are validated by size and type.
3. PDF files are parsed with `pdf-parse`.
4. DOCX files are parsed with `mammoth.extractRawText`.
5. Extracted text is cleaned in [`lib/parsers/text-cleaner.ts`](./lib/parsers/text-cleaner.ts).

### AI Analysis

The AI analysis flow is split across:

- [`lib/ai/prompt.ts`](./lib/ai/prompt.ts)
- [`lib/ai/gemini.ts`](./lib/ai/gemini.ts)
- [`lib/validators/analysis.ts`](./lib/validators/analysis.ts)

The pipeline:

1. The cleaned resume text and optional job description are sent to Gemini.
2. The model is instructed to return JSON only.
3. The response is validated with Zod before it reaches the UI.
4. If Gemini fails or returns invalid structured output, the app falls back to a grounded local analysis in [`lib/ai/local-analysis.ts`](./lib/ai/local-analysis.ts).

### Scoring

Weighted scoring is computed on the server in [`lib/scoring/weights.ts`](./lib/scoring/weights.ts).

When a job description is provided:

- Content: `25%`
- Experience: `20%`
- ATS: `15%`
- Skills: `10%`
- Formatting: `10%`
- Grammar: `10%`
- Job match: `10%`

When no job description is provided:

- Content: `28%`
- Experience: `23%`
- ATS: `17%`
- Skills: `12%`
- Formatting: `10%`
- Grammar: `10%`
- Job match: `0%`

## API Endpoints

### `POST /api/analyze-resume`

Accepts:

- `resumeFile`
- `resumeText`
- `jobDescription`
- `tailorMode`
- `demoMode`

Returns:

- validated structured analysis JSON
- parsing metadata
- resume text used for analysis
- score weights
- optional warnings when fallback analysis is used

### `POST /api/export-pdf`

Accepts an analysis payload and returns a downloadable PDF report.

## Demo Mode

Demo content lives here:

- [`public/demo/demo-resume.txt`](./public/demo/demo-resume.txt)
- [`public/demo/demo-job-description.txt`](./public/demo/demo-job-description.txt)
- [`lib/utils/demo-content.ts`](./lib/utils/demo-content.ts)

If no Gemini API key is configured and demo mode is enabled, the app can still return a portfolio-friendly demo analysis.

## Security and Robustness

- file uploads limited to 5 MB
- PDF and DOCX only
- server-side validation with Zod
- API keys remain server-side
- schema validation protects the frontend from malformed AI output
- local fallback analysis prevents total failure when Gemini is unavailable
- lightweight in-memory rate limiting on the analysis endpoint

## Deployment

### Deploy to Vercel

1. Push the repo to GitHub.
2. Import the repository into Vercel.
3. Add these environment variables in Vercel:

```bash
GEMINI_API_KEY=your_real_key
GOOGLE_MODEL=gemini-2.5-flash
NEXT_PUBLIC_APP_URL=https://your-project-name.vercel.app
```

4. Deploy.

### Recommended Vercel Settings

- Framework preset: `Next.js`
- Install command: `npm install`
- Build command: `npm run build`

### Production Checklist

- verify `NEXT_PUBLIC_APP_URL` uses the real deployed domain
- confirm Gemini quota and billing are active
- test PDF upload, DOCX upload, demo mode, and PDF export
- run `npm run build` before pushing major changes

## Local Verification

Recommended checks before committing:

```bash
npm run typecheck
npm run lint
npm run build
```

## Future Improvements

- OCR support for image-based resumes
- side-by-side resume comparison
- recruiter share links
- authentication and cloud-saved reports
- analytics for common resume issues
- additional export formats such as Markdown or DOCX

## Author

Built by **Ramy Abdelmalak**

- LinkedIn: [ramy-abdelmalak-aa2507177](https://www.linkedin.com/in/ramy-abdelmalak-aa2507177/)
- GitHub: [Ramyprojs](https://github.com/Ramyprojs)
