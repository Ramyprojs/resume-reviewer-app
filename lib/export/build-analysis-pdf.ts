import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

import type { AnalysisResult } from "@/lib/validators/analysis";

interface BuildAnalysisPdfInput {
  fileName: string;
  createdAt: string;
  analysis: AnalysisResult;
}

const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;
const MARGIN = 48;

function wrapText(text: string, maxChars = 86) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const nextLine = current ? `${current} ${word}` : word;

    if (nextLine.length <= maxChars) {
      current = nextLine;
      continue;
    }

    if (current) {
      lines.push(current);
    }

    current = word;
  }

  if (current) {
    lines.push(current);
  }

  return lines;
}

export async function buildAnalysisPdf({
  fileName,
  createdAt,
  analysis
}: BuildAnalysisPdfInput) {
  const pdfDoc = await PDFDocument.create();
  const regular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = PAGE_HEIGHT - MARGIN;

  const ensureSpace = (needed = 22) => {
    if (y > MARGIN + needed) {
      return;
    }

    page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    y = PAGE_HEIGHT - MARGIN;
  };

  const drawLines = (
    lines: string[],
    options: {
      font?: typeof regular;
      size?: number;
      color?: ReturnType<typeof rgb>;
      bullet?: boolean;
    } = {}
  ) => {
    const font = options.font ?? regular;
    const size = options.size ?? 11;
    const color = options.color ?? rgb(0.15, 0.2, 0.3);

    for (const line of lines) {
      ensureSpace(size + 8);
      page.drawText(options.bullet ? `• ${line}` : line, {
        x: MARGIN,
        y,
        size,
        font,
        color
      });
      y -= size + 6;
    }
  };

  const drawHeading = (heading: string) => {
    ensureSpace(26);
    page.drawText(heading, {
      x: MARGIN,
      y,
      size: 14,
      font: bold,
      color: rgb(0.06, 0.27, 0.38)
    });
    y -= 22;
  };

  page.drawText("AI Resume Reviewer Report", {
    x: MARGIN,
    y,
    size: 20,
    font: bold,
    color: rgb(0.05, 0.1, 0.2)
  });
  y -= 26;

  drawLines(
    [
      `Resume: ${fileName}`,
      `Generated: ${new Date(createdAt).toLocaleString()}`,
      `Overall Score: ${analysis.overallScore}/100`
    ],
    { size: 11, color: rgb(0.33, 0.41, 0.53) }
  );
  y -= 8;

  drawHeading("Summary");
  drawLines(wrapText(analysis.summary));
  y -= 8;

  drawHeading("Category Scores");
  drawLines(
    [
      `Content: ${analysis.categoryScores.content}`,
      `Experience: ${analysis.categoryScores.experience}`,
      `ATS: ${analysis.categoryScores.ats}`,
      `Skills: ${analysis.categoryScores.skills}`,
      `Formatting: ${analysis.categoryScores.formatting}`,
      `Grammar: ${analysis.categoryScores.grammar}`,
      `Job Match: ${analysis.categoryScores.jobMatch}`
    ],
    { bullet: true }
  );
  y -= 8;

  drawHeading("Strengths");
  drawLines(analysis.strengths.flatMap((item) => wrapText(item)), {
    bullet: true
  });
  y -= 8;

  drawHeading("Weaknesses");
  drawLines(analysis.weaknesses.flatMap((item) => wrapText(item)), {
    bullet: true
  });
  y -= 8;

  drawHeading("Top Recommendations");
  drawLines(analysis.finalRecommendations.flatMap((item) => wrapText(item)), {
    bullet: true
  });
  y -= 8;

  drawHeading("Bullet Point Rewrites");
  for (const bullet of analysis.bulletPointImprovements.slice(0, 4)) {
    drawLines(wrapText(`Original: ${bullet.original}`), { bullet: true });
    drawLines(wrapText(`Improved: ${bullet.improved}`));
    drawLines(wrapText(`Reason: ${bullet.reason}`), {
      color: rgb(0.33, 0.41, 0.53)
    });
    y -= 8;
  }

  const bytes = await pdfDoc.save();
  return Buffer.from(bytes);
}

