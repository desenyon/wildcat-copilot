import { mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { getEnv } from "@/lib/validation/env";
import { issueToken } from "./token";
import type { DownloadTicket, StorageProvider, UploadTicket } from "./types";

/**
 * Filesystem-backed StorageProvider for local dev/CI (see docs/DECISIONS.md:
 * cloud vendor deliberately not chosen yet). Files live under
 * OBJECT_STORAGE_BUCKET as a local directory. "Signed URLs" are our own
 * API routes (app/api/storage/*) gated by a short-lived HMAC token, which
 * mirrors the shape of real presigned URLs closely enough that swapping in
 * S3/GCS later only changes this file plus the two route handlers.
 */
export class LocalStorageProvider implements StorageProvider {
  private root(): string {
    return path.resolve(/* turbopackIgnore: true */ process.cwd(), getEnv().OBJECT_STORAGE_BUCKET);
  }

  resolvePath(storageKey: string): string {
    const root = this.root();
    const resolved = path.resolve(root, storageKey);
    if (!resolved.startsWith(root + path.sep) && resolved !== root) {
      throw new Error(`Refusing to resolve storage key outside bucket root: ${storageKey}`);
    }
    return resolved;
  }

  async ensureRoot(): Promise<void> {
    await mkdir(this.root(), { recursive: true });
  }

  async createUploadTicket(params: {
    storageKey: string;
    mimeType: string;
    documentId?: string;
  }): Promise<UploadTicket> {
    const token = issueToken({
      storageKey: params.storageKey,
      action: "upload",
      mimeType: params.mimeType,
      documentId: params.documentId,
    });
    return {
      storageKey: params.storageKey,
      uploadUrl: `/api/storage/upload?token=${encodeURIComponent(token)}`,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    };
  }

  async createDownloadTicket(storageKey: string): Promise<DownloadTicket> {
    const token = issueToken({ storageKey, action: "download" });
    return {
      downloadUrl: `/api/storage/download?token=${encodeURIComponent(token)}`,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    };
  }

  async deleteObject(storageKey: string): Promise<void> {
    await rm(this.resolvePath(storageKey), { force: true });
  }
}

let provider: StorageProvider | undefined;

export function getStorageProvider(): StorageProvider {
  if (!provider) provider = new LocalStorageProvider();
  return provider;
}
