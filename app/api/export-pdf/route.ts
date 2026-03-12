import { z } from "zod";

import { buildAnalysisPdf } from "@/lib/export/build-analysis-pdf";
import { jsonErrorResponse } from "@/lib/utils/http";
import { analysisResultSchema } from "@/lib/validators/analysis";

export const runtime = "nodejs";

const exportPdfPayloadSchema = z
  .object({
    fileName: z.string().trim().min(1).max(120).default("resume-review"),
    createdAt: z.string().datetime().default(() => new Date().toISOString()),
    analysis: analysisResultSchema
  })
  .strict();

function createDownloadName(fileName: string) {
  return `${fileName.replace(/\.[^.]+$/, "")}-analysis.pdf`;
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const payload = exportPdfPayloadSchema.parse(json);
    const pdfBytes = await buildAnalysisPdf(payload);
    const downloadName = createDownloadName(payload.fileName);

    return new Response(pdfBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${downloadName}"`
      }
    });
  } catch (error) {
    return jsonErrorResponse(error);
  }
}
