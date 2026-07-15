import { NextRequest, NextResponse } from "next/server";
import { issueToken } from "@/lib/documents/storage/token";

/**
 * Test-only helper: issues upload/download tokens directly so e2e tests can
 * exercise the real /api/storage/upload and /api/storage/download routes
 * without a document-upload UI (that ships in T1.2.1). Gated on an explicit
 * opt-in env var (not NODE_ENV — `next start` always sets NODE_ENV=production
 * even for local/CI e2e runs) so it can never be reached unless a deployment
 * deliberately sets ALLOW_TEST_ROUTES=true, which a real deployment must not.
 */
export async function GET(request: NextRequest) {
  if (process.env.ALLOW_TEST_ROUTES !== "true") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const key = request.nextUrl.searchParams.get("key");
  const mimeType = request.nextUrl.searchParams.get("mimeType") ?? "application/pdf";
  const expired = request.nextUrl.searchParams.get("expired") === "true";
  if (!key) return NextResponse.json({ error: "Missing key" }, { status: 400 });

  const uploadToken = issueToken(
    { storageKey: key, action: "upload", mimeType },
    expired ? -1000 : undefined,
  );
  const downloadToken = issueToken({ storageKey: key, action: "download" });

  return NextResponse.json({
    uploadUrl: `/api/storage/upload?token=${encodeURIComponent(uploadToken)}`,
    downloadUrl: `/api/storage/download?token=${encodeURIComponent(downloadToken)}`,
  });
}
