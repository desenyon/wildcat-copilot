// @vitest-environment node
//
// officeparser's PDF path (pdfjs-dist) auto-selects a browser build when it
// detects a DOM-like global, which jsdom provides just enough of to trip
// that detection without actually implementing DOMMatrix — a jsdom test
// artifact, not a real runtime concern (Next.js server code, including this
// worker, always runs in Node, never jsdom).
import { describe, expect, it } from "vitest";
import { chunkText, extractText, UnsupportedFormatForExtractionError } from "@/lib/documents/parse";
import { buildMinimalDocx, buildMinimalPdf, buildMinimalPptx } from "../fixtures/office-documents";

describe("extractText", () => {
  it("extracts plain text as-is", async () => {
    expect(await extractText("text/plain", Buffer.from("hello world"))).toBe("hello world");
  });

  it("extracts markdown as-is", async () => {
    expect(await extractText("text/markdown", Buffer.from("# Title\n\nBody"))).toBe(
      "# Title\n\nBody",
    );
  });

  it("extracts text from a real PDF", async () => {
    const text = await extractText("application/pdf", buildMinimalPdf("Hello Wildcat"));
    expect(text).toContain("Hello Wildcat");
  });

  it("extracts text from a real DOCX", async () => {
    const text = await extractText(
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      await buildMinimalDocx("Hello DOCX Wildcat"),
    );
    expect(text).toContain("Hello DOCX Wildcat");
  });

  it("extracts text from a real PPTX", async () => {
    const text = await extractText(
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      await buildMinimalPptx("Hello PPTX Wildcat"),
    );
    expect(text).toContain("Hello PPTX Wildcat");
  });

  it("throws for formats without a parser implemented", async () => {
    await expect(extractText("application/zip", Buffer.from("PK"))).rejects.toThrow(
      UnsupportedFormatForExtractionError,
    );
  });
});

describe("chunkText", () => {
  it("returns no chunks for empty text", () => {
    expect(chunkText("   ")).toEqual([]);
  });

  it("returns a single chunk for short text", () => {
    const chunks = chunkText("A short syllabus.");
    expect(chunks).toHaveLength(1);
    expect(chunks[0]).toEqual({ sequenceNumber: 0, text: "A short syllabus." });
  });

  it("splits long text into overlapping sequential chunks that cover the whole text", () => {
    const text = "a".repeat(5000);
    const chunks = chunkText(text);
    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks.map((c) => c.sequenceNumber)).toEqual(chunks.map((_, i) => i));
    expect(chunks[chunks.length - 1].text.endsWith("a")).toBe(true);
    expect(chunks.every((c) => c.text.length <= 2000)).toBe(true);
  });
});
