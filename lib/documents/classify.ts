import type { documentTypeEnum } from "@/lib/db/schema";

export type DocumentType = (typeof documentTypeEnum.enumValues)[number];

export interface DocumentTypeSuggestion {
  documentType: DocumentType;
  confidence: number;
}

/**
 * Filename-based type suggestion (T1.2.3). Deliberately simple — keyword
 * matching on the filename only, no content analysis (that would need the
 * document to already be extracted, which happens async after upload). The
 * teacher can always override; overriding sets confidence to 1.0 elsewhere
 * (see requestDocumentUpload), matching how the rest of the product treats
 * explicit teacher corrections vs. inferred values (e.g. T1.6.3).
 */
const KEYWORD_RULES: Array<{ pattern: RegExp; documentType: DocumentType; confidence: number }> = [
  { pattern: /syllabus/i, documentType: "syllabus", confidence: 0.9 },
  { pattern: /rubric/i, documentType: "rubric", confidence: 0.9 },
  { pattern: /lesson[-_ ]?plan/i, documentType: "lesson_plan", confidence: 0.85 },
  { pattern: /slide|deck|presentation/i, documentType: "slide_deck", confidence: 0.75 },
  { pattern: /quiz|exam|test|assessment/i, documentType: "assessment", confidence: 0.8 },
  {
    pattern: /assignment|homework|hw[-_ ]?\d|worksheet/i,
    documentType: "assignment",
    confidence: 0.75,
  },
  { pattern: /reading|article|chapter/i, documentType: "reading", confidence: 0.7 },
  { pattern: /standard/i, documentType: "department_standard", confidence: 0.7 },
];

const EXTENSION_RULES: Array<{ pattern: RegExp; documentType: DocumentType; confidence: number }> =
  [{ pattern: /\.pptx$/i, documentType: "slide_deck", confidence: 0.5 }];

export function suggestDocumentType(filename: string): DocumentTypeSuggestion {
  for (const rule of KEYWORD_RULES) {
    if (rule.pattern.test(filename))
      return { documentType: rule.documentType, confidence: rule.confidence };
  }
  for (const rule of EXTENSION_RULES) {
    if (rule.pattern.test(filename))
      return { documentType: rule.documentType, confidence: rule.confidence };
  }
  return { documentType: "other", confidence: 0.3 };
}
