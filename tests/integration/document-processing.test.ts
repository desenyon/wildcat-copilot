// @vitest-environment node
//
// officeparser's PDF path needs Node's pdfjs-dist build; jsdom trips its
// browser-build auto-detection without implementing DOMMatrix. See the same
// note in tests/unit/document-parse.test.ts.
import { describe, expect, it, afterAll } from "vitest";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { organizations, users, courses, courseDocuments, documentChunks } from "@/lib/db/schema";
import { getJobClient, stopJobClient } from "@/lib/jobs/client";
import { registerDocumentProcessingWorker } from "@/workers/document-processing";
import { LocalStorageProvider } from "@/lib/documents/storage/local";
import { issueToken } from "@/lib/documents/storage/token";
import { buildMinimalPdf } from "../fixtures/office-documents";

async function waitFor(check: () => Promise<boolean>, timeoutMs = 8000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (await check()) return;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error("Timed out waiting for condition");
}

describe("document processing pipeline", () => {
  afterAll(async () => {
    await stopJobClient();
  });

  it("real end-to-end: upload route writes the file, worker extracts text and chunks it", async () => {
    const db = getDb();
    const suffix = Date.now();

    const [org] = await db
      .insert(organizations)
      .values({ name: "LGHS", slug: `lghs-docproc-${suffix}` })
      .returning();

    try {
      const [teacher] = await db
        .insert(users)
        .values({
          organizationId: org.id,
          clerkUserId: `user_test_docproc_${suffix}`,
          email: `teacher-docproc-${suffix}@example.com`,
          displayName: "Teacher",
        })
        .returning();
      const [course] = await db
        .insert(courses)
        .values({
          organizationId: org.id,
          ownerUserId: teacher.id,
          name: "Course",
          subject: "Science",
          gradeBand: "9-10",
          academicTerm: "Fall 2026",
        })
        .returning();

      const storageKey = `${course.id}/${suffix}-syllabus.txt`;
      const [document] = await db
        .insert(courseDocuments)
        .values({
          courseId: course.id,
          uploadedByUserId: teacher.id,
          title: "syllabus.txt",
          mimeType: "text/plain",
          storageKey,
          checksum: "pending",
          processingStatus: "pending",
        })
        .returning();

      // Write the file directly via the storage provider, exactly like the
      // upload route does, so this test exercises real extraction/chunking
      // against a real file on disk — not a mocked document.
      const provider = new LocalStorageProvider();
      await provider.ensureRoot();
      const fs = await import("node:fs/promises");
      const path = await import("node:path");
      const destination = provider.resolvePath(storageKey);
      await fs.mkdir(path.dirname(destination), { recursive: true });
      await fs.writeFile(destination, "Course syllabus.\n\nWeek 1: Introduction.");

      await registerDocumentProcessingWorker();
      const boss = await getJobClient();
      await boss.send(
        "document-processing",
        { courseDocumentId: document.id, checksum: "test-checksum" },
        { singletonKey: `test-${suffix}` },
      );

      await waitFor(async () => {
        const updated = await db.query.courseDocuments.findFirst({
          where: eq(courseDocuments.id, document.id),
        });
        return updated?.processingStatus === "processed";
      });

      const chunks = await db
        .select()
        .from(documentChunks)
        .where(eq(documentChunks.courseDocumentId, document.id));

      expect(chunks).toHaveLength(1);
      expect(chunks[0].text).toContain("Week 1: Introduction.");

      await fs.rm(destination, { force: true });
    } finally {
      await db.delete(organizations).where(eq(organizations.id, org.id));
    }
  }, 15000);

  it("real end-to-end: a real PDF is extracted and chunked through the actual worker", async () => {
    const db = getDb();
    const suffix = Date.now();

    const [org] = await db
      .insert(organizations)
      .values({ name: "LGHS", slug: `lghs-docproc-pdf-${suffix}` })
      .returning();

    try {
      const [teacher] = await db
        .insert(users)
        .values({
          organizationId: org.id,
          clerkUserId: `user_test_docproc_pdf_${suffix}`,
          email: `teacher-docproc-pdf-${suffix}@example.com`,
          displayName: "Teacher",
        })
        .returning();
      const [course] = await db
        .insert(courses)
        .values({
          organizationId: org.id,
          ownerUserId: teacher.id,
          name: "Course",
          subject: "Science",
          gradeBand: "9-10",
          academicTerm: "Fall 2026",
        })
        .returning();

      const storageKey = `${course.id}/${suffix}-rubric.pdf`;
      const [document] = await db
        .insert(courseDocuments)
        .values({
          courseId: course.id,
          uploadedByUserId: teacher.id,
          title: "rubric.pdf",
          mimeType: "application/pdf",
          storageKey,
          checksum: "pending",
          processingStatus: "pending",
        })
        .returning();

      const provider = new LocalStorageProvider();
      await provider.ensureRoot();
      const fs = await import("node:fs/promises");
      const path = await import("node:path");
      const destination = provider.resolvePath(storageKey);
      await fs.mkdir(path.dirname(destination), { recursive: true });
      await fs.writeFile(destination, buildMinimalPdf("Rubric criteria for lab reports"));

      await registerDocumentProcessingWorker();
      const boss = await getJobClient();
      await boss.send(
        "document-processing",
        { courseDocumentId: document.id, checksum: `test-pdf-checksum-${suffix}` },
        { singletonKey: `test-pdf-${suffix}` },
      );

      await waitFor(async () => {
        const updated = await db.query.courseDocuments.findFirst({
          where: eq(courseDocuments.id, document.id),
        });
        return updated?.processingStatus === "processed";
      });

      const chunks = await db
        .select()
        .from(documentChunks)
        .where(eq(documentChunks.courseDocumentId, document.id));

      expect(chunks).toHaveLength(1);
      expect(chunks[0].text).toContain("Rubric criteria for lab reports");

      await fs.rm(destination, { force: true });
    } finally {
      await db.delete(organizations).where(eq(organizations.id, org.id));
    }
  }, 15000);

  it("issueToken/verifyToken round-trips a documentId for upload tickets", async () => {
    const { verifyToken } = await import("@/lib/documents/storage/token");
    const token = issueToken({
      storageKey: "course/doc.pdf",
      action: "upload",
      mimeType: "application/pdf",
      documentId: "00000000-0000-0000-0000-000000000001",
    });
    const payload = verifyToken(token);
    expect(payload.documentId).toBe("00000000-0000-0000-0000-000000000001");
  });
});
