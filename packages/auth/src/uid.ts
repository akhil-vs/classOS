import { createHash, randomBytes } from "node:crypto";

export function uid(prefix: string) {
  return `${prefix}_${randomBytes(5).toString("hex")}`;
}

export function createInviteToken(): { token: string; tokenHash: string } {
  const token = randomBytes(24).toString("hex");
  return { token, tokenHash: hashToken(token) };
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
