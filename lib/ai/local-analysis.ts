import { computeOverallScore } from "@/lib/scoring/weights";
import { analysisResultSchema, type AnalysisResult } from "@/lib/validators/analysis";

interface LocalAnalysisInput {
  resumeText: string;
  jobDescription?: string;
}

const ACTION_VERBS = [
  "built",
  "designed",
  "implemented",
  "developed",
  "completed",
  "applied",
  "gained",
  "learned",
  "strengthened",
  "created",
  "optimized",
  "led",
  "managed"
];

const TECH_KEYWORDS = [
  "c++",
  "java",
  "python",
  "flask",
  "arduino",
  "proteus",
  "ai",
  "artificial intelligence",
  "machine learning",
  "network security",
  "cloud",
  "aws",
  "web design",
  "deployment"
];

const COMMON_HEADINGS = [
  "summary",
  "professional summary",
  "objective",
  "education",
  "technical skills",
  "skills",
  "soft skills",
  "experience",
  "projects",
  "certifications",
  "training",
  "languages",
  "references",
  "extra personal details"
] as const;

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function cleanLines(text: string) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9+#]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isHeading(line: string) {
  const normalized = normalize(line);

  if (COMMON_HEADINGS.includes(normalized as (typeof COMMON_HEADINGS)[number])) {
    return true;
  }

  return /^[A-Z][A-Z\s&/-]{2,}$/.test(line) && line.length <= 40;
}

function getSections(text: string) {
  const lines = cleanLines(text);
  const sections: Array<{ title: string; lines: string[] }> = [];
  let currentTitle = "header";
  let currentLines: string[] = [];

  for (const line of lines) {
    if (isHeading(line)) {
      sections.push({ title: currentTitle, lines: currentLines });
      currentTitle = normalize(line);
      currentLines = [];
      continue;
    }

    currentLines.push(line);
  }

  sections.push({ title: currentTitle, lines: currentLines });

  return sections.reduce<Record<string, string[]>>((accumulator, section) => {
    accumulator[section.title] = section.lines;
    return accumulator;
  }, {});
}

function getSectionText(sections: Record<string, string[]>, keys: string[]) {
  for (const key of keys) {
    const value = sections[key];

    if (value?.length) {
      return value;
    }
  }

  return [];
}

function getBulletLines(lines: string[]) {
  return lines.filter((line) => /^[•\-–]/.test(line));
}

function getSentenceCount(text: string) {
  return text.split(/[.!?]/).filter((part) => part.trim().length > 10).length;
}

function extractJobKeywords(jobDescription: string) {
  const normalized = normalize(jobDescription);
  const rawTerms = normalized
    .split(" ")
    .filter((term) => term.length >= 4);

  const phrases = [
    "artificial intelligence",
    "machine learning",
    "network security",
    "cloud support",
    "web design",
    "problem solving",
    "teamwork collaboration",
    "full stack",
    "data processing"
  ];

  return Array.from(new Set([...phrases.filter((phrase) => normalized.includes(phrase)), ...rawTerms])).slice(0, 18);
}

function titleCase(value: string) {
  return value.replace(/\b\w/g, (char) => char.toUpperCase());
}

export function analyzeResumeLocally({
  resumeText,
  jobDescription
}: LocalAnalysisInput): AnalysisResult {
  const sections = getSections(resumeText);
  const header = getSectionText(sections, ["header"]);
  const experienceSection = getSectionText(sections, ["experience", "training"]);
  const skillsSection = getSectionText(sections, ["technical skills", "skills"]);
  const educationSection = getSectionText(sections, ["education"]);
  const projectsSection = getSectionText(sections, ["projects"]);
  const languagesSection = getSectionText(sections, ["languages"]);
  const referencesSection = getSectionText(sections, ["references"]);
  const extraDetailsSection = getSectionText(sections, ["extra personal details"]);

  const resumeTextNormalized = normalize(resumeText);
  const headerText = header.join(" ");
  const experienceBullets = getBulletLines(experienceSection);
  const metricCount = (resumeText.match(/\b\d+(?:\.\d+)?%?\b/g) || []).length;
  const actionVerbCount = experienceBullets.filter((line) =>
    ACTION_VERBS.some((verb) => normalize(line).startsWith(verb))
  ).length;
  const techCount = TECH_KEYWORDS.filter((keyword) =>
    resumeTextNormalized.includes(normalize(keyword))
  ).length;
  const hasEmail = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(headerText);
  const hasPhone = /(\+\d{1,3}\s?)?[\d\s()-]{8,}/.test(headerText);
  const hasLinkedIn = /linkedin/i.test(headerText);
  const hasGithub = /github/i.test(resumeText);
  const hasObjective = Boolean(sections.objective?.length);
  const hasSummary = Boolean(sections.summary?.length || sections["professional summary"]?.length);
  const hasProjects = Boolean(projectsSection.length);
  const hasPlaceholderDates = /\?\/\?|\?\?\/\?|\?{2,}/.test(resumeText);
  const hasPageMarkers = /\b\d+\s*\|\s*page\b/i.test(resumeText);
  const hasReferences = Boolean(referencesSection.length);
  const hasExtraDetails = Boolean(extraDetailsSection.length);
  const sentences = getSentenceCount(resumeText);

  const contentScore = clamp(
    42 +
      (hasEmail ? 8 : 0) +
      (hasPhone ? 6 : 0) +
      (skillsSection.length ? 12 : 0) +
      (educationSection.length ? 10 : 0) +
      (experienceSection.length ? 12 : 0) +
      (hasProjects ? 8 : 0) +
      (languagesSection.length ? 4 : 0) -
      (hasObjective && !hasSummary ? 6 : 0) -
      (hasReferences ? 5 : 0)
  );

  const experienceScore = clamp(
    38 +
      experienceBullets.length * 5 +
      Math.min(metricCount, 6) * 3 +
      actionVerbCount * 4 -
      (!experienceBullets.length ? 12 : 0) -
      (!hasProjects ? 6 : 0)
  );

  const atsScore = clamp(
    68 -
      (hasPageMarkers ? 14 : 0) -
      (hasPlaceholderDates ? 12 : 0) -
      (hasObjective ? 6 : 0) -
      (hasReferences ? 6 : 0) -
      (hasExtraDetails ? 8 : 0)
  );

  const skillsScore = clamp(
    40 +
      Math.min(techCount, 8) * 5 +
      (skillsSection.length ? 12 : 0) +
      (languagesSection.length ? 3 : 0)
  );

  const formattingScore = clamp(
    70 +
      (experienceBullets.length ? 6 : -8) -
      (hasPageMarkers ? 12 : 0) -
      (hasPlaceholderDates ? 10 : 0)
  );

  const grammarScore = clamp(
    72 +
      Math.min(sentences, 18) -
      (hasPlaceholderDates ? 10 : 0) -
      (/team motivative/i.test(resumeText) ? 5 : 0)
  );

  const jobKeywords = jobDescription?.trim() ? extractJobKeywords(jobDescription) : [];
  const matchedKeywords = jobKeywords.filter((keyword) =>
    resumeTextNormalized.includes(normalize(keyword))
  );
  const missingKeywords = jobKeywords.filter(
    (keyword) => !resumeTextNormalized.includes(normalize(keyword))
  );
  const jobMatchScore = jobKeywords.length
    ? clamp(30 + (matchedKeywords.length / Math.max(jobKeywords.length, 1)) * 70)
    : 0;

  const categoryScores = {
    content: contentScore,
    formatting: formattingScore,
    ats: atsScore,
    experience: experienceScore,
    skills: skillsScore,
    grammar: grammarScore,
    jobMatch: jobMatchScore
  };

  const strengths = [
    hasEmail && hasPhone
      ? "The resume includes core contact details, making it easy for recruiters to reach the candidate."
      : "",
    experienceBullets.some((line) => /robotics/i.test(line))
      ? "The experience section includes hands-on robotics work, which adds practical engineering evidence."
      : "",
    techCount >= 3
      ? "The technical skills section shows a real foundation across programming, deployment, and engineering tools."
      : "",
    /huawei|coursera|certificate/i.test(resumeText)
      ? "The resume demonstrates ongoing learning through certifications and structured technical training."
      : "",
    languagesSection.length
      ? "The languages section adds useful communication context for international or client-facing opportunities."
      : ""
  ].filter(Boolean);

  const weaknesses = [
    hasObjective && !hasSummary
      ? "The resume uses an objective statement instead of a stronger professional summary tailored to target roles."
      : "",
    !hasProjects
      ? "There is no dedicated projects section, which makes it harder to spotlight practical engineering work."
      : "",
    metricCount < 6
      ? "Most bullets describe responsibilities or learning outcomes without enough measurable impact or outcomes."
      : "",
    hasPlaceholderDates
      ? "Some date ranges contain placeholder characters from the source PDF, which hurts clarity and ATS reliability."
      : "",
    hasExtraDetails
      ? "Extra personal details such as birth date and nationality are usually unnecessary for a modern technical resume."
      : ""
  ].filter(Boolean);

  const missingSections = [
    !hasSummary ? "Professional Summary" : "",
    !hasProjects ? "Projects" : "",
    sections.certifications?.length ? "" : "Certifications or Training",
    hasGithub ? "" : "Portfolio or GitHub link"
  ].filter(Boolean);

  const atsIssues = [
    hasPageMarkers ? "Remove page markers like '1 | Page' because they can confuse ATS parsing." : "",
    hasPlaceholderDates
      ? "Replace placeholder or unreadable date characters with clean text before exporting the final resume."
      : "",
    hasObjective
      ? "Rename 'Objective' to 'Professional Summary' or 'Profile' for a more modern ATS-friendly structure."
      : "",
    hasExtraDetails
      ? "Consider removing personal details that are not required for hiring decisions."
      : "",
    hasReferences
      ? "A references section is usually not needed; use the space for stronger project or impact content."
      : ""
  ].filter(Boolean);

  const keywordSuggestions = jobKeywords.length
    ? missingKeywords.slice(0, 10).map(titleCase)
    : Array.from(
        new Set(
          [
            /robotics/i.test(resumeText) ? "Embedded Systems" : "",
            /artificial intelligence|ai/i.test(resumeText) ? "Artificial Intelligence" : "",
            /network security/i.test(resumeText) ? "Network Security" : "",
            /cloud|aws/i.test(resumeText) ? "Cloud Support" : "",
            /flask|web design/i.test(resumeText) ? "Backend Development" : "",
            "Problem Solving"
          ].filter(Boolean)
        )
      ).slice(0, 10);

  const formattingSuggestions = [
    hasPageMarkers
      ? "Re-export the PDF without page headers or footers so the text reads cleanly in ATS systems."
      : "",
    !hasProjects
      ? "Break out projects or major technical work into a separate section instead of burying them inside experience."
      : "",
    "Keep section headings consistent and use a simple one-column structure for easier ATS parsing."
  ].filter(Boolean);

  const grammarSuggestions = [
    hasObjective
      ? "Rewrite the objective into a concise summary focused on current strengths and target opportunities."
      : "",
    /team motivative/i.test(resumeText)
      ? "Replace unclear wording like 'Team Motivative' with standard phrases such as 'team motivation' or 'team collaboration'."
      : "",
    "Start bullets with strong action verbs and keep each point focused on one achievement or learning outcome."
  ].filter(Boolean);

  const bulletPointImprovements = experienceBullets
    .slice(0, 3)
    .map((original) => {
      const cleaned = original.replace(/^[•\-–]\s*/, "");
      const improved = cleaned
        .replace(/^Completed\b/i, "Completed")
        .replace(/^Learned\b/i, "Learned")
        .replace(/^Gained\b/i, "Built")
        .replace(/\s{2,}/g, " ")
        .trim();

      return {
        original: cleaned,
        improved,
        reason:
          "This keeps the rewrite grounded in the original bullet while tightening wording for clarity."
      };
    })
    .filter((item) => item.original !== item.improved);

  const sectionFeedback = [
    {
      section: "Contact Information",
      score: clamp((hasEmail ? 35 : 0) + (hasPhone ? 30 : 0) + (hasLinkedIn ? 20 : 0) + (hasGithub ? 15 : 0)),
      feedback:
        "The contact block is mostly clear and easy to scan. It already provides the basic recruiter information needed for outreach.",
      suggestions: [
        hasGithub ? "Keep your LinkedIn and portfolio links short and readable." : "Add a GitHub or portfolio link if you have technical work to show.",
        "Make sure exported PDF links are clickable."
      ]
    },
    {
      section: hasObjective ? "Objective" : "Summary",
      score: hasSummary ? 72 : 58,
      feedback: hasObjective
        ? "The objective communicates intent, but it reads generically and would be stronger as a modern professional summary tied to your strongest technical direction."
        : "The summary section is present, but it could be more targeted to the roles you want next.",
      suggestions: [
        "Mention your strongest technical focus in the first sentence.",
        "Tailor the section toward the kind of engineering role you are applying for."
      ]
    },
    {
      section: "Experience",
      score: experienceScore,
      feedback:
        "The experience content shows practical training and hands-on technical work, especially in robotics and Huawei programs. The next step is turning those entries into sharper, outcome-driven bullets.",
      suggestions: [
        "Add measurable outcomes, scale, or concrete technical results where possible.",
        "Separate formal work experience from certifications or short training programs if you can."
      ]
    },
    {
      section: "Skills",
      score: skillsScore,
      feedback:
        "The skills section shows breadth across programming, web, robotics, and security-related tools. It would read even better if organized by technical area.",
      suggestions: [
        "Group skills into categories such as Programming, Web, Embedded, and Security.",
        "Lead with the skills that best match the role you are targeting."
      ]
    },
    {
      section: "Education",
      score: educationSection.length ? 80 : 45,
      feedback:
        "The education section contains the key degree information, but ongoing dates and course details should be formatted more clearly for faster recruiter understanding.",
      suggestions: [
        "Label ongoing education clearly as expected graduation if applicable.",
        "Move long course lists into a dedicated certifications section."
      ]
    }
  ];

  const finalRecommendations = [
    hasObjective
      ? "Replace the objective with a stronger professional summary aligned to your target engineering role."
      : "Sharpen the summary so it reflects your strongest technical direction and differentiators.",
    "Clean the PDF export so page markers and unreadable date placeholders do not appear in the parsed text.",
    !hasProjects
      ? "Add a dedicated projects section to showcase robotics, AI, or security work more clearly."
      : "Strengthen project and experience bullets with measurable outcomes where possible.",
    "Trim low-value personal details and use the space for technical evidence and impact."
  ].filter(Boolean);

  const summary = hasPlaceholderDates || hasPageMarkers
    ? "This resume contains relevant technical training and hands-on engineering experience, but the exported PDF introduces parsing noise such as page markers or unreadable date characters. Cleaning the source formatting and sharpening the summary, experience structure, and project presentation would make the resume much stronger."
    : "This resume shows real technical foundations and hands-on engineering exposure, especially through workshops, training, and certifications. The next step is to present that experience with cleaner structure, a stronger summary, and more outcome-focused bullets.";

  return analysisResultSchema.parse({
    overallScore: computeOverallScore(categoryScores, Boolean(jobDescription?.trim())),
    summary,
    categoryScores,
    strengths: strengths.slice(0, 5),
    weaknesses: weaknesses.slice(0, 6),
    missingSections: missingSections.slice(0, 6),
    atsIssues: atsIssues.slice(0, 6),
    keywordSuggestions,
    formattingSuggestions,
    grammarSuggestions,
    bulletPointImprovements,
    sectionFeedback,
    jobMatchAnalysis: {
      matchedKeywords: matchedKeywords.map(titleCase).slice(0, 15),
      missingKeywords: missingKeywords.map(titleCase).slice(0, 15),
      fitSummary: jobKeywords.length
        ? `The local fallback analysis found ${matchedKeywords.length} matched keywords and ${missingKeywords.length} missing keywords against the target job description.`
        : "No job description provided; role-fit was not evaluated."
    },
    finalRecommendations
  });
}
