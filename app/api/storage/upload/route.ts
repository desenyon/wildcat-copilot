import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { requireActor } from "@/lib/auth/authorization";
import { getDb } from "@/lib/db/client";
import { courseDocuments } from "@/lib/db/schema";
import { LocalStorageProvider } from "@/lib/documents/storage/local";
import { verifyToken } from "@/lib/documents/storage/token";
import { validateUpload } from "@/lib/documents/storage/validate";
import {
  ExpiredTokenError,
  FileTooLargeError,
  InvalidTokenError,
  UnsupportedFileError,
} from "@/lib/documents/storage/types";
import { publishJob } from "@/lib/jobs/publish";
import { QUEUES } from "@/lib/jobs/queues";

export async function POST(request: NextRequest) {
  try {
    await requireActor();
  } catch {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const token = request.nextUrl.searchParams.get("token");
  if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 });

  let payload;
  try {
    payload = verifyToken(token);
  } catch (error) {
    if (error instanceof ExpiredTokenError) {
      return NextResponse.json({ error: "Upload link expired" }, { status: 410 });
    }
    if (error instanceof InvalidTokenError) {
      return NextResponse.json({ error: "Invalid upload link" }, { status: 400 });
    }
    throw error;
  }
  if (payload.action !== "upload") {
    return NextResponse.json({ error: "Wrong token type for upload" }, { status: 400 });
  }

  const body = await request.arrayBuffer();
  try {
    validateUpload({ mimeType: payload.mimeType ?? "", sizeBytes: body.byteLength });
  } catch (error) {
    if (error instanceof UnsupportedFileError) {
      return NextResponse.json({ error: error.message }, { status: 415 });
    }
    if (error instanceof FileTooLargeError) {
      return NextResponse.json({ error: error.message }, { status: 413 });
    }
    throw error;
  }

  const provider = new LocalStorageProvider();
  await provider.ensureRoot();
  const destination = provider.resolvePath(payload.storageKey);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, Buffer.from(body));

  const checksum = createHash("sha256").update(Buffer.from(body)).digest("hex");

  if (payload.documentId) {
    const db = getDb();
    await db
      .update(courseDocuments)
      .set({ checksum, processingStatus: "processing" })
      .where(eq(courseDocuments.id, payload.documentId));

    await publishJob(
      QUEUES.documentProcessing,
      { courseDocumentId: payload.documentId, checksum },
      checksum,
    );
  }

  return NextResponse.json({
    storageKey: payload.storageKey,
    sizeBytes: body.byteLength,
    checksum,
  });
}
