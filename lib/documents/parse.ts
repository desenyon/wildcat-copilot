export class UnsupportedFormatForExtractionError extends Error {}

const TEXT_MIME_TYPES = new Set(["text/plain", "text/markdown"]);

/**
 * Real (not mocked) text extraction — but only for formats that don't need
 * a parsing library we haven't added yet. PDF/DOCX/PPTX extraction is
 * genuinely unimplemented; callers must surface that honestly (a `failed`
 * processing status with a clear error code) rather than pretending it
 * succeeded. Revisit when pdf-parse/mammoth/similar are added.
 */
export function extractText(mimeType: string, buffer: Buffer): string {
  if (!TEXT_MIME_TYPES.has(mimeType)) {
    throw new UnsupportedFormatForExtractionError(
      `Text extraction for "${mimeType}" is not implemented yet`,
    );
  }
  return buffer.toString("utf-8");
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
