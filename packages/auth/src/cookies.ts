import { COOKIE_NAME, SESSION_TTL_MS } from "./store";

export { COOKIE_NAME };

export function parseSessionIdFromCookieHeader(
  cookieHeader: string | null | undefined,
): string | null {
  if (!cookieHeader) return null;
  const parts = cookieHeader.split(";");
  for (const part of parts) {
    const [rawName, ...rest] = part.trim().split("=");
    if (rawName === COOKIE_NAME) {
      const value = rest.join("=").trim();
      return value || null;
    }
  }
  return null;
}

export function serializeSessionCookie(
  sessionId: string,
  options?: { expiresAt?: number; secure?: boolean },
): string {
  const maxAge = Math.max(
    1,
    Math.floor(
      ((options?.expiresAt ?? Date.now() + SESSION_TTL_MS) - Date.now()) / 1000,
    ),
  );
  const secure = options?.secure ?? process.env.NODE_ENV === "production";
  const pieces = [
    `${COOKIE_NAME}=${sessionId}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${maxAge}`,
  ];
  if (secure) pieces.push("Secure");
  return pieces.join("; ");
}

export function serializeClearSessionCookie(options?: {
  secure?: boolean;
}): string {
  const secure = options?.secure ?? process.env.NODE_ENV === "production";
  const pieces = [
    `${COOKIE_NAME}=`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    "Max-Age=0",
  ];
  if (secure) pieces.push("Secure");
  return pieces.join("; ");
}
