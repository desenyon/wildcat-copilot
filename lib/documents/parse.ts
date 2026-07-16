import { parseOffice, type SupportedFileType } from "officeparser";

export class UnsupportedFormatForExtractionError extends Error {}

const TEXT_MIME_TYPES = new Set(["text/plain", "text/markdown"]);

const OFFICE_FILE_TYPE_BY_MIME: Record<string, SupportedFileType> = {
  "application/pdf": "pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
};

/**
 * Real (not mocked) text extraction for every format T1.2.2 requires.
 * Plain text/Markdown are decoded directly; PDF/DOCX/PPTX go through
 * `officeparser` (pure-JS zip/PDF parsing, no native deps, OCR disabled —
 * image-only pages/slides yield no text rather than silently hanging on
 * Tesseract). The `fileType` hint is passed explicitly from our already-known
 * mime type rather than relying on officeparser's magic-byte auto-detection,
 * which turned out to be environment-sensitive (worked in a plain Node
 * script, failed under Vitest's test environment). Anything else throws so
 * callers can surface it honestly rather than pretending extraction succeeded.
 */
export async function extractText(mimeType: string, buffer: Buffer): Promise<string> {
  if (TEXT_MIME_TYPES.has(mimeType)) {
    return buffer.toString("utf-8");
  }

  const fileType = OFFICE_FILE_TYPE_BY_MIME[mimeType];
  if (fileType) {
    const ast = await parseOffice(buffer, { fileType, ocr: false, includeRawContent: false });
    return ast.toText();
  }

  throw new UnsupportedFormatForExtractionError(
    `Text extraction for "${mimeType}" is not implemented yet`,
  );
}

export interface TextChunk {
  sequenceNumber: number;
  text: string;
}

const CHUNK_SIZE = 2000;
const CHUNK_OVERLAP = 200;

/** Simple fixed-size overlapping chunker. Good enough until retrieval (M1.2/M1.5) needs something smarter. */
export function chunkText(text: string): TextChunk[] {
  const trimmed = text.trim();
  if (!trimmed) return [];

  const chunks: TextChunk[] = [];
  let start = 0;
  let sequenceNumber = 0;

  while (start < trimmed.length) {
    const end = Math.min(start + CHUNK_SIZE, trimmed.length);
    chunks.push({ sequenceNumber, text: trimmed.slice(start, end) });
    sequenceNumber += 1;
    if (end >= trimmed.length) break;
    start = end - CHUNK_OVERLAP;
  }

  return chunks;
}
