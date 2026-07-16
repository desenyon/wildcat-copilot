export const ALLOWED_UPLOAD_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "text/plain",
  "text/markdown",
] as const;

export type AllowedUploadMimeType = (typeof ALLOWED_UPLOAD_MIME_TYPES)[number];

export const MAX_UPLOAD_BYTES = 25 * 1024 * 1024; // 25 MB

export interface UploadTicket {
  storageKey: string;
  uploadUrl: string;
  expiresAt: Date;
}

export interface DownloadTicket {
  downloadUrl: string;
  expiresAt: Date;
}

export class UnsupportedFileError extends Error {}
export class FileTooLargeError extends Error {}
export class ExpiredTokenError extends Error {}
export class InvalidTokenError extends Error {}

/**
 * Provider-agnostic interface (AGENTS.md §4.1 "provider abstraction" rule).
 * `local.ts` is the only implementation for now (see docs/DECISIONS.md);
 * a cloud adapter (S3/GCS/R2) implements the same interface later without
 * touching call sites.
 */
export interface StorageProvider {
  createUploadTicket(params: {
    storageKey: string;
    mimeType: string;
    documentId?: string;
  }): Promise<UploadTicket>;
  createDownloadTicket(storageKey: string): Promise<DownloadTicket>;
  deleteObject(storageKey: string): Promise<void>;
}
