import { describe, expect, it } from "vitest";
import {
  extractAssignmentPatterns,
  extractCommunicationTone,
  extractDifficultyProfile,
  extractFormatPreferences,
  extractInstructionStyle,
  extractLearningObjectives,
  extractRubricPatterns,
  synthesizeCourseProfile,
  type DocumentInput,
} from "@/lib/course-profile/synthesize";

describe("extractLearningObjectives", () => {
  it("finds sentences matching objective patterns and dedupes them", () => {
    const docs: DocumentInput[] = [
      {
        id: "doc-1",
        documentType: "syllabus",
        text: "Welcome to class. Students will analyze primary sources. Students will analyze primary sources. We meet on Tuesdays.",
      },
      {
        id: "doc-2",
        documentType: "lesson_plan",
        text: "By the end of this lesson, students can identify tone shifts in a text.",
      },
    ];
    const result = extractLearningObjectives(docs);
    expect(result.value).toHaveLength(2);
    expect(result.value[0]).toMatch(/students will analyze primary sources/i);
    expect(result.sourceDocumentIds.sort()).toEqual(["doc-1", "doc-2"]);
    expect(result.confidence).toBeGreaterThan(0);
    expect(result.confidence).toBeLessThan(1);
  });

  it("returns zero confidence and empty value when nothing matches", () => {
    const result = extractLearningObjectives([
      { id: "doc-1", documentType: "other", text: "No objectives here." },
    ]);
    expect(result.value).toEqual([]);
    expect(result.confidence).toBe(0);
    expect(result.sourceDocumentIds).toEqual([]);
  });
});

describe("extractInstructionStyle", () => {
  it("detects second-person point of view and recurring vocabulary", () => {
    const docs: DocumentInput[] = [
      {
        id: "doc-1",
        documentType: "assignment",
        text: "Your photosynthesis lab report is due Friday. Bring your photosynthesis notes.",
      },
      {
        id: "doc-2",
        documentType: "assignment",
        text: "Your photosynthesis diagram should label each stage clearly for your report.",
      },
    ];
    const result = extractInstructionStyle(docs);
    expect(result.value.pointOfView).toBe("second");
    expect(result.value.vocabulary).toContain("photosynthesis");
  });
});

describe("extractAssignmentPatterns", () => {
  it("ignores non-assignment documents and detects common sections", () => {
    const docs: DocumentInput[] = [
      {
        id: "doc-1",
        documentType: "assignment",
        text: "Instructions: complete the worksheet. Due Date: Friday. Materials: pencil.",
      },
      {
        id: "doc-2",
        documentType: "assignment",
        text: "Instructions: read chapter 3. Due Date: Monday.",
      },
      { id: "doc-3", documentType: "syllabus", text: "This is the syllabus, not an assignment." },
    ];
    const result = extractAssignmentPatterns(docs);
    expect(result.value.documentCount).toBe(2);
    expect(result.value.commonSections).toContain("instructions");
    expect(result.value.commonSections).toContain("due date");
    expect(result.value.commonSections).not.toContain("materials");
    expect(result.sourceDocumentIds).toEqual(["doc-1", "doc-2"]);
  });

  it("returns zero confidence when there are no assignment documents", () => {
    const result = extractAssignmentPatterns([
      { id: "doc-1", documentType: "syllabus", text: "hello" },
    ]);
    expect(result.value.documentCount).toBe(0);
    expect(result.confidence).toBe(0);
  });
});

describe("extractRubricPatterns", () => {
  it("detects a known scale label set", () => {
    const docs: DocumentInput[] = [
      {
        id: "doc-1",
        documentType: "rubric",
        text: "Criteria: Thesis (25 points)\nException: Excellent Good Fair Poor scale used throughout.\n- Clarity: 10 points\n- Evidence: 15 points",
      },
    ];
    const result = extractRubricPatterns(docs);
    expect(result.value.scaleLabels).toEqual(["excellent", "good", "fair", "poor"]);
    expect(result.value.documentCount).toBe(1);
    expect(result.value.averageCriteriaCount).toBeGreaterThan(0);
  });
});

describe("extractCommunicationTone", () => {
  it("detects casual tone from contractions", () => {
    const docs: DocumentInput[] = [
      {
        id: "doc-1",
        documentType: "announcement",
        text: "Don't forget it's due Friday! We'll review it in class.",
      },
    ];
    const result = extractCommunicationTone(docs);
    expect(result.value.formality).toBe("casual");
  });

  it("detects formal tone from formal markers with no contractions", () => {
    const docs: DocumentInput[] = [
      {
        id: "doc-1",
        documentType: "syllabus",
        text: "Students shall submit assignments therefore adhering to the stated deadline.",
      },
    ];
    const result = extractCommunicationTone(docs);
    expect(result.value.formality).toBe("formal");
  });
});

describe("extractDifficultyProfile", () => {
  it("computes a Flesch reading ease score and buckets it", () => {
    const docs: DocumentInput[] = [
      {
        id: "doc-1",
        documentType: "reading",
        text: "The cat sat on the mat. The dog ran in the sun. It was a good day.",
      },
    ];
    const result = extractDifficultyProfile(docs);
    expect(result.value.label).toBe("easy");
    expect(result.value.fleschReadingEase).toBeGreaterThan(60);
  });
});

describe("extractFormatPreferences", () => {
  it("detects bullet and numbered list usage", () => {
    const docs: DocumentInput[] = [
      {
        id: "doc-1",
        documentType: "lesson_plan",
        text: "- First point\n- Second point\n1. Step one\n2. Step two",
      },
    ];
    const result = extractFormatPreferences(docs);
    expect(result.value.usesBulletLists).toBe(true);
    expect(result.value.usesNumberedLists).toBe(true);
  });
});

describe("synthesizeCourseProfile", () => {
  it("returns all seven fields", () => {
    const result = synthesizeCourseProfile([
      { id: "doc-1", documentType: "syllabus", text: "Students will learn things." },
    ]);
    expect(Object.keys(result).sort()).toEqual(
      [
        "assignmentPatterns",
        "communicationTone",
        "difficultyProfile",
        "formatPreferences",
        "instructionStyle",
        "learningObjectives",
        "rubricPatterns",
      ].sort(),
    );
  });
});
