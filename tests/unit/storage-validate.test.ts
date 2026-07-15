import { describe, expect, it } from "vitest";
import { validateUpload } from "@/lib/documents/storage/validate";
import {
  FileTooLargeError,
  MAX_UPLOAD_BYTES,
  UnsupportedFileError,
} from "@/lib/documents/storage/types";

describe("validateUpload", () => {
  it("accepts an allowed type within the size limit", () => {
    expect(() => validateUpload({ mimeType: "application/pdf", sizeBytes: 1024 })).not.toThrow();
  });

  it("rejects an unsupported mime type", () => {
    expect(() => validateUpload({ mimeType: "application/x-msdownload", sizeBytes: 1024 })).toThrow(
      UnsupportedFileError,
    );
  });

  it("rejects a file over the size limit", () => {
    expect(() =>
      validateUpload({ mimeType: "application/pdf", sizeBytes: MAX_UPLOAD_BYTES + 1 }),
    ).toThrow(FileTooLargeError);
  });
});
