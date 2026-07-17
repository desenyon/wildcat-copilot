/**
 * Rule-based course profile synthesis (T1.2.6). No LLM/embedding provider has
 * been chosen yet (see docs/DECISIONS.md), so extraction here is entirely
 * heuristic — keyword/regex pattern matching and basic text statistics over
 * already-extracted document text, not semantic understanding. Every field
 * value is a `FieldObservation` carrying a confidence score and the source
 * document ids it came from, per AGENTS.md's "source backed observations"
 * acceptance criterion. Revisit with real LLM-based extraction once a
 * provider is wired up; this is a real, useful baseline in the meantime, not
 * a stub.
 */

export interface DocumentInput {
  id: string;
  documentType: string;
  text: string;
}

export interface FieldObservation<T> {
  value: T;
  confidence: number;
  sourceDocumentIds: string[];
}

export interface InstructionStyle {
  vocabulary: string[];
  pointOfView: "first" | "second" | "third" | "mixed" | "unknown";
}

export interface AssignmentPatterns {
  commonSections: string[];
  averageWordCount: number;
  documentCount: number;
}

export interface RubricPatterns {
  scaleLabels: string[];
  averageCriteriaCount: number;
  documentCount: number;
}

export interface CommunicationTone {
  formality: "formal" | "casual" | "mixed" | "unknown";
  averageSentenceLength: number;
}

export interface DifficultyProfile {
  fleschReadingEase: number;
  label: "easy" | "moderate" | "difficult" | "unknown";
}

export interface FormatPreferences {
  usesBulletLists: boolean;
  usesNumberedLists: boolean;
  usesHeadings: boolean;
}

export interface SynthesizedProfile {
  learningObjectives: FieldObservation<string[]>;
  instructionStyle: FieldObservation<InstructionStyle>;
  assignmentPatterns: FieldObservation<AssignmentPatterns>;
  rubricPatterns: FieldObservation<RubricPatterns>;
  communicationTone: FieldObservation<CommunicationTone>;
  difficultyProfile: FieldObservation<DifficultyProfile>;
  formatPreferences: FieldObservation<FormatPreferences>;
}

const STOPWORDS = new Set([
  "the",
  "and",
  "for",
  "are",
  "but",
  "not",
  "you",
  "your",
  "with",
  "this",
  "that",
  "will",
  "from",
  "have",
  "has",
  "had",
  "was",
  "were",
  "been",
  "being",
  "each",
  "all",
  "any",
  "can",
  "could",
  "should",
  "would",
  "may",
  "might",
  "must",
  "shall",
  "into",
  "onto",
  "than",
  "then",
  "them",
  "they",
  "their",
  "there",
  "here",
  "what",
  "when",
  "where",
  "which",
  "who",
  "whom",
  "why",
  "how",
  "about",
  "above",
  "after",
  "again",
  "against",
  "below",
  "between",
  "both",
  "during",
  "further",
  "over",
  "under",
  "these",
  "those",
  "some",
  "such",
  "only",
  "own",
  "same",
  "out",
  "off",
  "once",
  "also",
  "class",
  "students",
  "student",
  "please",
  "make",
  "sure",
  "use",
  "one",
  "two",
  "three",
  "week",
  "day",
  "days",
  "due",
  "date",
]);

function tokenizeWords(text: string): string[] {
  return text.toLowerCase().match(/[a-z']+/g) ?? [];
}

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

function splitLines(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
}

function countSyllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!w) return 0;
  const groups = w.match(/[aeiouy]+/g) ?? [];
  let count = groups.length;
  if (w.endsWith("e") && count > 1) count -= 1;
  return Math.max(1, count);
}

function confidenceForCount(count: number, max = 0.85): number {
  if (count === 0) return 0;
  return Math.min(max, 0.3 + count * 0.15);
}

const OBJECTIVE_PATTERN =
  /\b(students will|swbat|objective[s]?:|by the end of (?:this|the) (?:lesson|unit|class)|learning goal[s]?:)/i;

export function extractLearningObjectives(docs: DocumentInput[]): FieldObservation<string[]> {
  const found: { text: string; docId: string }[] = [];
  for (const doc of docs) {
    for (const sentence of splitSentences(doc.text)) {
      if (sentence.length <= 240 && OBJECTIVE_PATTERN.test(sentence)) {
        found.push({ text: sentence, docId: doc.id });
      }
    }
  }
  const seen = new Set<string>();
  const unique = found.filter((f) => {
    const key = f.text.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  const top = unique.slice(0, 10);
  return {
    value: top.map((u) => u.text),
    confidence: confidenceForCount(top.length),
    sourceDocumentIds: [...new Set(top.map((u) => u.docId))],
  };
}

export function extractInstructionStyle(docs: DocumentInput[]): FieldObservation<InstructionStyle> {
  const wordDocCounts = new Map<string, Set<string>>();
  let first = 0;
  let second = 0;
  let third = 0;

  for (const doc of docs) {
    const words = tokenizeWords(doc.text);
    for (const word of words) {
      if (word === "you" || word === "your" || word === "you're") second += 1;
      else if (word === "i" || word === "we" || word === "our" || word === "my") first += 1;
      else if (word === "students" || word === "student" || word === "they" || word === "their")
        third += 1;

      if (word.length < 4 || STOPWORDS.has(word)) continue;
      if (!wordDocCounts.has(word)) wordDocCounts.set(word, new Set());
      wordDocCounts.get(word)!.add(doc.id);
    }
  }

  const vocabulary = [...wordDocCounts.entries()]
    .filter(([, docIds]) => docIds.size >= Math.min(2, docs.length))
    .sort((a, b) => b[1].size - a[1].size || a[0].localeCompare(b[0]))
    .slice(0, 20)
    .map(([word]) => word);

  const total = first + second + third;
  let pointOfView: InstructionStyle["pointOfView"] = "unknown";
  if (total > 0) {
    const max = Math.max(first, second, third);
    const dominant = max / total;
    if (dominant < 0.5) pointOfView = "mixed";
    else if (max === second) pointOfView = "second";
    else if (max === first) pointOfView = "first";
    else pointOfView = "third";
  }

  const sourceDocumentIds = [
    ...new Set(vocabulary.flatMap((word) => [...(wordDocCounts.get(word) ?? [])])),
  ];

  return {
    value: { vocabulary, pointOfView },
    confidence: confidenceForCount(vocabulary.length > 0 ? docs.length : 0),
    sourceDocumentIds,
  };
}

const SECTION_MARKERS = [
  "instructions",
  "objective",
  "due date",
  "materials",
  "submission",
  "requirements",
  "grading",
];

export function extractAssignmentPatterns(
  docs: DocumentInput[],
): FieldObservation<AssignmentPatterns> {
  const assignments = docs.filter((d) => d.documentType === "assignment");
  if (assignments.length === 0) {
    return {
      value: { commonSections: [], averageWordCount: 0, documentCount: 0 },
      confidence: 0,
      sourceDocumentIds: [],
    };
  }

  const marketPresence = new Map<string, number>();
  let totalWords = 0;
  for (const doc of assignments) {
    const lower = doc.text.toLowerCase();
    totalWords += tokenizeWords(doc.text).length;
    for (const marker of SECTION_MARKERS) {
      if (lower.includes(marker)) {
        marketPresence.set(marker, (marketPresence.get(marker) ?? 0) + 1);
      }
    }
  }

  const commonSections = [...marketPresence.entries()]
    .filter(([, count]) => count > assignments.length / 2)
    .map(([marker]) => marker);

  return {
    value: {
      commonSections,
      averageWordCount: Math.round(totalWords / assignments.length),
      documentCount: assignments.length,
    },
    confidence: confidenceForCount(assignments.length),
    sourceDocumentIds: assignments.map((d) => d.id),
  };
}

const SCALE_SETS: string[][] = [
  ["excellent", "good", "fair", "poor"],
  ["exceeds", "meets", "approaching", "below"],
  ["exemplary", "proficient", "developing", "beginning"],
  ["advanced", "proficient", "basic", "below basic"],
];

export function extractRubricPatterns(docs: DocumentInput[]): FieldObservation<RubricPatterns> {
  const rubrics = docs.filter((d) => d.documentType === "rubric");
  if (rubrics.length === 0) {
    return {
      value: { scaleLabels: [], averageCriteriaCount: 0, documentCount: 0 },
      confidence: 0,
      sourceDocumentIds: [],
    };
  }

  let detectedScale: string[] = [];
  let totalCriteriaLines = 0;
  for (const doc of rubrics) {
    const lower = doc.text.toLowerCase();
    for (const scale of SCALE_SETS) {
      if (scale.every((label) => lower.includes(label))) {
        detectedScale = scale;
        break;
      }
    }
    const lines = splitLines(doc.text);
    totalCriteriaLines += lines.filter(
      (line) => /^[-*\d]/.test(line) || /\d\s*(points?|pts)/i.test(line),
    ).length;
  }

  return {
    value: {
      scaleLabels: detectedScale,
      averageCriteriaCount: Math.round(totalCriteriaLines / rubrics.length),
      documentCount: rubrics.length,
    },
    confidence: confidenceForCount(rubrics.length),
    sourceDocumentIds: rubrics.map((d) => d.id),
  };
}

const CONTRACTION_PATTERN = /\b\w+'(s|re|ve|ll|d|t)\b/i;
const FORMAL_MARKERS = /\b(shall|therefore|henceforth|pursuant|hereby)\b/i;

export function extractCommunicationTone(
  docs: DocumentInput[],
): FieldObservation<CommunicationTone> {
  if (docs.length === 0) {
    return {
      value: { formality: "unknown", averageSentenceLength: 0 },
      confidence: 0,
      sourceDocumentIds: [],
    };
  }

  let totalWords = 0;
  let totalSentences = 0;
  let casualSignals = 0;
  let formalSignals = 0;

  for (const doc of docs) {
    const sentences = splitSentences(doc.text);
    totalSentences += sentences.length;
    totalWords += tokenizeWords(doc.text).length;
    if (CONTRACTION_PATTERN.test(doc.text)) casualSignals += 1;
    if (FORMAL_MARKERS.test(doc.text)) formalSignals += 1;
  }

  let formality: CommunicationTone["formality"] = "unknown";
  if (casualSignals > 0 && formalSignals === 0) formality = "casual";
  else if (formalSignals > 0 && casualSignals === 0) formality = "formal";
  else if (casualSignals > 0 && formalSignals > 0) formality = "mixed";

  return {
    value: {
      formality,
      averageSentenceLength:
        totalSentences > 0 ? Math.round((totalWords / totalSentences) * 10) / 10 : 0,
    },
    confidence: confidenceForCount(docs.length),
    sourceDocumentIds: docs.map((d) => d.id),
  };
}

export function extractDifficultyProfile(
  docs: DocumentInput[],
): FieldObservation<DifficultyProfile> {
  if (docs.length === 0) {
    return {
      value: { fleschReadingEase: 0, label: "unknown" },
      confidence: 0,
      sourceDocumentIds: [],
    };
  }

  let totalWords = 0;
  let totalSentences = 0;
  let totalSyllables = 0;

  for (const doc of docs) {
    const words = tokenizeWords(doc.text);
    totalWords += words.length;
    totalSentences += splitSentences(doc.text).length;
    totalSyllables += words.reduce((sum, w) => sum + countSyllables(w), 0);
  }

  if (totalWords === 0 || totalSentences === 0) {
    return {
      value: { fleschReadingEase: 0, label: "unknown" },
      confidence: 0,
      sourceDocumentIds: [],
    };
  }

  const fleschReadingEase =
    206.835 - 1.015 * (totalWords / totalSentences) - 84.6 * (totalSyllables / totalWords);
  const rounded = Math.round(fleschReadingEase * 10) / 10;

  let label: DifficultyProfile["label"] = "moderate";
  if (rounded >= 60) label = "easy";
  else if (rounded < 30) label = "difficult";

  return {
    value: { fleschReadingEase: rounded, label },
    confidence: confidenceForCount(docs.length),
    sourceDocumentIds: docs.map((d) => d.id),
  };
}

export function extractFormatPreferences(
  docs: DocumentInput[],
): FieldObservation<FormatPreferences> {
  if (docs.length === 0) {
    return {
      value: { usesBulletLists: false, usesNumberedLists: false, usesHeadings: false },
      confidence: 0,
      sourceDocumentIds: [],
    };
  }

  let bulletLines = 0;
  let numberedLines = 0;
  let headingLines = 0;

  for (const doc of docs) {
    for (const line of splitLines(doc.text)) {
      if (/^[-*•]\s+/.test(line)) bulletLines += 1;
      else if (/^\d+[.)]\s+/.test(line)) numberedLines += 1;
      else if (
        /^#{1,6}\s+/.test(line) ||
        (line.length < 60 && /^[A-Z][A-Za-z0-9 ,'-]*$/.test(line) && !/[.!?]$/.test(line))
      ) {
        headingLines += 1;
      }
    }
  }

  return {
    value: {
      usesBulletLists: bulletLines >= 2,
      usesNumberedLists: numberedLines >= 2,
      usesHeadings: headingLines >= 2,
    },
    confidence: confidenceForCount(docs.length),
    sourceDocumentIds: docs.map((d) => d.id),
  };
}

export function synthesizeCourseProfile(docs: DocumentInput[]): SynthesizedProfile {
  return {
    learningObjectives: extractLearningObjectives(docs),
    instructionStyle: extractInstructionStyle(docs),
    assignmentPatterns: extractAssignmentPatterns(docs),
    rubricPatterns: extractRubricPatterns(docs),
    communicationTone: extractCommunicationTone(docs),
    difficultyProfile: extractDifficultyProfile(docs),
    formatPreferences: extractFormatPreferences(docs),
  };
}
