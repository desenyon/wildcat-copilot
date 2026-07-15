import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

describe("storage upload/download tokens", () => {
  beforeEach(() => {
    vi.stubEnv("AUTH_SECRET", "test-secret-value-that-is-long-enough-000000");
    vi.stubEnv("DATABASE_URL", "postgres://user:pass@localhost:5432/db");
    vi.stubEnv("GOOGLE_OAUTH_CLIENT_ID", "id");
    vi.stubEnv("GOOGLE_OAUTH_CLIENT_SECRET", "secret");
    vi.stubEnv("OBJECT_STORAGE_BUCKET", ".data/uploads");
    vi.stubEnv("OBJECT_STORAGE_REGION", "local");
    vi.stubEnv("OBJECT_STORAGE_ACCESS_KEY_ID", "local");
    vi.stubEnv("OBJECT_STORAGE_SECRET_ACCESS_KEY", "local");
    vi.stubEnv("LLM_PROVIDER_API_KEY", "key");
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("round-trips a valid token", async () => {
    const { issueToken, verifyToken } = await import("@/lib/documents/storage/token");
    const token = issueToken({
      storageKey: "course/doc.pdf",
      action: "upload",
      mimeType: "application/pdf",
    });
    const payload = verifyToken(token);
    expect(payload.storageKey).toBe("course/doc.pdf");
    expect(payload.action).toBe("upload");
  });

  it("rejects an expired token", async () => {
    const { issueToken, verifyToken } = await import("@/lib/documents/storage/token");
    const { ExpiredTokenError } = await import("@/lib/documents/storage/types");
    const token = issueToken({ storageKey: "course/doc.pdf", action: "download" }, -1000);
    expect(() => verifyToken(token)).toThrow(ExpiredTokenError);
  });

  it("rejects a tampered token", async () => {
    const { issueToken, verifyToken } = await import("@/lib/documents/storage/token");
    const { InvalidTokenError } = await import("@/lib/documents/storage/types");
    const token = issueToken({ storageKey: "course/doc.pdf", action: "download" });
    const [body] = token.split(".");
    const tampered = `${body}.deadbeef`;
    expect(() => verifyToken(tampered)).toThrow(InvalidTokenError);
  });
});
