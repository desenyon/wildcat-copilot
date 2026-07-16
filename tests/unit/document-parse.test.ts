import { describe, expect, it } from "vitest";
import { chunkText, extractText, UnsupportedFormatForExtractionError } from "@/lib/documents/parse";

describe("extractText", () => {
  it("extracts plain text as-is", () => {
    expect(extractText("text/plain", Buffer.from("hello world"))).toBe("hello world");
  });

  it("extracts markdown as-is", () => {
    expect(extractText("text/markdown", Buffer.from("# Title\n\nBody"))).toBe("# Title\n\nBody");
  });

  it("throws for formats without a parser implemented yet", () => {
    expect(() => extractText("application/pdf", Buffer.from("%PDF-"))).toThrow(
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
