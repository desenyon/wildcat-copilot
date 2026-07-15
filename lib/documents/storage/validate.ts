import {
  ALLOWED_UPLOAD_MIME_TYPES,
  FileTooLargeError,
  MAX_UPLOAD_BYTES,
  UnsupportedFileError,
} from "./types";

export function validateUpload(params: { mimeType: string; sizeBytes: number }): void {
  if (
    !ALLOWED_UPLOAD_MIME_TYPES.includes(
      params.mimeType as (typeof ALLOWED_UPLOAD_MIME_TYPES)[number],
    )
  ) {
    throw new UnsupportedFileError(
      `Unsupported file type "${params.mimeType}". Allowed: ${ALLOWED_UPLOAD_MIME_TYPES.join(", ")}`,
    );
  }
  if (params.sizeBytes > MAX_UPLOAD_BYTES) {
    throw new FileTooLargeError(
      `File is ${params.sizeBytes} bytes, which exceeds the ${MAX_UPLOAD_BYTES} byte limit`,
    );
  }
}
