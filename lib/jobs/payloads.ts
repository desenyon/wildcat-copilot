import { z } from "zod";

export const documentProcessingPayloadSchema = z.object({
  courseDocumentId: z.string().uuid(),
  checksum: z.string().min(1),
});
export type DocumentProcessingPayload = z.infer<typeof documentProcessingPayloadSchema>;

export const generationPayloadSchema = z.object({
  generationRequestId: z.string().uuid(),
});
export type GenerationPayload = z.infer<typeof generationPayloadSchema>;

export const exportPayloadSchema = z.object({
  artifactVersionId: z.string().uuid(),
  exportType: z.enum(["docx", "pdf", "canvas_html", "copy"]),
});
export type ExportPayload = z.infer<typeof exportPayloadSchema>;
