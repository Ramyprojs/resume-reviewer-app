import type { AnalysisResult } from "@/lib/validators/analysis";

export const DEMO_RESUME_TEXT = `Maya Hassan
San Francisco, CA | maya.hassan@gmail.com | (555) 111-2044 | linkedin.com/in/mayahassan | github.com/mayahassan

SUMMARY
Product-minded software engineer with 3+ years of experience building customer-facing web applications, internal analytics tools, and automation workflows. Strong in TypeScript, React, Node.js, and SQL. Known for improving performance, cleaning up legacy UI systems, and partnering closely with design and product teams to ship measurable improvements.

SKILLS
TypeScript, JavaScript, React, Next.js, Node.js, Express, PostgreSQL, Prisma, REST APIs, Tailwind CSS, Testing Library, Jest, GitHub Actions, Docker, AWS, Figma

EXPERIENCE
Frontend Engineer | BrightPath Labs | Jan 2024 - Present
- Built a new self-service onboarding dashboard in React and Next.js used by 2,500+ customers.
- Improved Lighthouse performance score from 61 to 90 by reducing bundle size and deferring non-critical widgets.
- Partnered with product and design to redesign the reporting page, increasing weekly active usage by 18%.
- Created reusable Tailwind and component patterns that cut new page build time for the team.

Software Engineer | Nova Metrics | Jun 2022 - Dec 2023
- Developed internal analytics tools with React, Node.js, and PostgreSQL for operations and sales teams.
- Added automated CSV import validation that reduced manual cleanup work.
- Wrote API endpoints and dashboard components for subscription reporting and customer health metrics.
- Helped migrate UI screens from ad hoc CSS to a shared design system.

PROJECTS
Interview Coach App
- Built a full-stack interview practice app with Next.js, Gemini API, and PostgreSQL.
- Added feedback history, prompt templates, and exportable coaching summaries.

Education Dashboard
- Created a role-based dashboard for instructors and students using React and Express.
- Designed charts and performance filters for assignment completion data.

EDUCATION
B.S. in Computer Systems Engineering
Alexandria University | 2022`;

export const DEMO_JOB_DESCRIPTION = `We are hiring a Frontend Software Engineer to build modern web experiences for a B2B SaaS analytics platform. You will work in React, TypeScript, and Next.js, collaborate with product and design, improve performance and accessibility, and help shape a reusable design system. Candidates should be comfortable with REST APIs, dashboards, experimentation, metrics, and writing clean, maintainable code. Experience with testing, CI/CD, and data visualization is a plus.`;

export const DEMO_ANALYSIS_RESULT: AnalysisResult = {
  overallScore: 85,
  summary:
    "This resume presents a strong early-career frontend engineer profile with relevant technologies, clear ownership, and visible product impact. The experience is credible and aligned with SaaS frontend roles, but several bullet points could be sharper by adding metrics, clearer action verbs, and stronger alignment to accessibility, testing, and data visualization keywords from the target role.",
  categoryScores: {
    content: 86,
    formatting: 84,
    ats: 82,
    experience: 85,
    skills: 81,
    grammar: 90,
    jobMatch: 82
  },
  strengths: [
    "The summary quickly establishes role focus, years of experience, and core technologies.",
    "Work experience includes measurable outcomes such as a performance jump from 61 to 90 and an 18% usage increase.",
    "The resume shows collaboration with design and product, which is valuable for frontend SaaS roles.",
    "Projects reinforce full-stack initiative and hands-on Gemini API experience."
  ],
  weaknesses: [
    "Some experience bullets describe responsibilities but stop short of showing full business impact.",
    "Testing, accessibility, and data visualization are implied but not strongly surfaced for the target role.",
    "The skills list is broad, but it could be grouped to highlight frontend depth more clearly.",
    "Project bullets would be stronger with user counts, performance outcomes, or adoption metrics."
  ],
  missingSections: [
    "A dedicated certifications section is not required, but an achievements or leadership section could add signal.",
    "There is no explicit accessibility or testing subsection even though those themes matter for the target job."
  ],
  atsIssues: [
    "Important target-role terms like accessibility, component library, and experimentation are not stated directly.",
    "The summary could include the exact job-aligned phrase 'frontend software engineer' for stronger keyword match."
  ],
  keywordSuggestions: [
    "Accessibility",
    "Component library",
    "Design system",
    "Data visualization",
    "Experimentation",
    "CI/CD"
  ],
  formattingSuggestions: [
    "Group skills into categories such as Frontend, Backend, Data, and Delivery to improve scan speed.",
    "Keep all bullet points to one or two lines where possible for cleaner recruiter review.",
    "Add consistent spacing between section headers and content blocks to improve readability."
  ],
  grammarSuggestions: [
    "Start each experience bullet with a stronger action verb such as 'launched,' 'optimized,' or 'implemented.'",
    "Replace vague phrases like 'cut new page build time' with specific percentages or time savings when available."
  ],
  bulletPointImprovements: [
    {
      original:
        "Created reusable Tailwind and component patterns that cut new page build time for the team.",
      improved:
        "Built a reusable Tailwind-based component library that reduced new page implementation time for the frontend team and improved UI consistency across releases.",
      reason:
        "The rewrite clarifies what was built, who benefited, and why it mattered."
    },
    {
      original:
        "Added automated CSV import validation that reduced manual cleanup work.",
      improved:
        "Implemented automated CSV validation checks in the ingestion workflow, reducing manual data-cleanup effort and improving reporting accuracy for operations teams.",
      reason:
        "This version gives the bullet clearer ownership and ties the work to a measurable business outcome."
    },
    {
      original:
        "Built a full-stack interview practice app with Next.js, Gemini API, and PostgreSQL.",
      improved:
        "Built a full-stack interview coaching app with Next.js, Gemini API, and PostgreSQL that generated structured feedback, stored review history, and exported personalized practice summaries.",
      reason:
        "The improved version highlights product value and specific functionality instead of only listing technologies."
    }
  ],
  sectionFeedback: [
    {
      section: "Contact Information",
      score: 92,
      feedback:
        "The contact block is complete and ATS-friendly, with clear links to LinkedIn and GitHub. It already meets recruiter expectations.",
      suggestions: [
        "Keep links short and clickable.",
        "If available, add a portfolio URL for stronger product presentation."
      ]
    },
    {
      section: "Summary",
      score: 84,
      feedback:
        "The summary is concise and relevant, but it can be tuned more directly to the target role by naming frontend ownership, accessibility, and design-system work more explicitly.",
      suggestions: [
        "Add the phrase 'Frontend Software Engineer.'",
        "Mention accessibility, performance, and reusable component systems."
      ]
    },
    {
      section: "Experience",
      score: 86,
      feedback:
        "The experience section has strong technical alignment and some concrete impact metrics. It would become much more compelling with one additional quantified result in the second role and more explicit emphasis on testing and maintainability.",
      suggestions: [
        "Add metrics for the CSV validation and reporting work.",
        "Mention testing, QA ownership, or CI/CD contributions if they were part of the role."
      ]
    },
    {
      section: "Projects",
      score: 81,
      feedback:
        "The projects are relevant and modern, especially the Gemini-powered app. They need one stronger outcome or usage signal each to feel more portfolio-ready.",
      suggestions: [
        "Add scale, adoption, or performance outcomes.",
        "Highlight UX decisions or tradeoffs solved in each project."
      ]
    },
    {
      section: "Skills",
      score: 79,
      feedback:
        "The skills list is credible but could do more work by grouping related tools and surfacing job-aligned strengths first.",
      suggestions: [
        "Split skills into Frontend, Backend, Data, and Delivery categories.",
        "Move React, TypeScript, Next.js, and Tailwind to the front."
      ]
    }
  ],
  jobMatchAnalysis: {
    matchedKeywords: [
      "React",
      "TypeScript",
      "Next.js",
      "Performance",
      "Design system",
      "REST APIs",
      "Dashboards"
    ],
    missingKeywords: [
      "Accessibility",
      "Data visualization",
      "Experimentation",
      "CI/CD"
    ],
    fitSummary:
      "This candidate is a strong fit for a frontend SaaS role focused on React and Next.js. The biggest gap is not technical capability but keyword coverage around accessibility, experimentation, and data visualization, which should be surfaced more explicitly in the resume."
  },
  finalRecommendations: [
    "Rewrite two to three bullets to emphasize measurable business impact, not just implementation work.",
    "Tailor the summary and skills section to include accessibility, design-system ownership, and data-visualization keywords from the job description.",
    "Add one testing or CI/CD example if you have it, because the target role values maintainable engineering practices.",
    "Strengthen project bullets with adoption, usage, or output metrics so they read like portfolio evidence instead of side notes."
  ]
};
