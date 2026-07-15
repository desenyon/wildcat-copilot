import { createHmac, timingSafeEqual } from "node:crypto";
import { getEnv } from "@/lib/validation/env";
import { ExpiredTokenError, InvalidTokenError } from "./types";

const DEFAULT_TTL_MS = 5 * 60 * 1000; // 5 minutes, matches AGENTS.md "short-lived signed URLs"

export interface TokenPayload {
  storageKey: string;
  action: "upload" | "download";
  mimeType?: string;
  expiresAt: number;
}

function sign(data: string): string {
  return createHmac("sha256", getEnv().AUTH_SECRET).update(data).digest("base64url");
}

export function issueToken(
  payload: Omit<TokenPayload, "expiresAt">,
  ttlMs = DEFAULT_TTL_MS,
): string {
  const full: TokenPayload = { ...payload, expiresAt: Date.now() + ttlMs };
  const body = Buffer.from(JSON.stringify(full)).toString("base64url");
  const signature = sign(body);
  return `${body}.${signature}`;
}

export function verifyToken(token: string): TokenPayload {
  const [body, signature] = token.split(".");
  if (!body || !signature) throw new InvalidTokenError("Malformed token");

  const expected = sign(body);
  const signatureBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expected);
  if (signatureBuf.length !== expectedBuf.length || !timingSafeEqual(signatureBuf, expectedBuf)) {
    throw new InvalidTokenError("Signature mismatch");
  }

  const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf-8")) as TokenPayload;
  if (Date.now() > payload.expiresAt) throw new ExpiredTokenError("Token expired");

  return payload;
}
