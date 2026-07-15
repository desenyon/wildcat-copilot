import { readFile, stat } from "node:fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { requireActor } from "@/lib/auth/authorization";
import { LocalStorageProvider } from "@/lib/documents/storage/local";
import { verifyToken } from "@/lib/documents/storage/token";
import { ExpiredTokenError, InvalidTokenError } from "@/lib/documents/storage/types";

export async function GET(request: NextRequest) {
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
      return NextResponse.json({ error: "Download link expired" }, { status: 410 });
    }
    if (error instanceof InvalidTokenError) {
      return NextResponse.json({ error: "Invalid download link" }, { status: 400 });
    }
    throw error;
  }
  if (payload.action !== "download") {
    return NextResponse.json({ error: "Wrong token type for download" }, { status: 400 });
  }

  const provider = new LocalStorageProvider();
  const filePath = provider.resolvePath(payload.storageKey);

  try {
    await stat(filePath);
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const data = await readFile(filePath);
  return new NextResponse(new Uint8Array(data), {
    headers: { "content-disposition": "attachment" },
  });
}
