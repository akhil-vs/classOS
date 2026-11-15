import {
  COOKIE_NAME,
  getSessionContext,
  parseSessionIdFromCookieHeader,
  requireCapability,
  serializeClearSessionCookie,
  serializeSessionCookie,
  type AuthAction,
  type SessionContext,
} from "@classos/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";

export async function readSessionFromCookies(): Promise<SessionContext | null> {
  const jar = await cookies();
  const sessionId = jar.get(COOKIE_NAME)?.value;
  return getSessionContext(sessionId);
}

export function readSessionFromRequest(
  request: Request,
): SessionContext | null {
  const sessionId = parseSessionIdFromCookieHeader(
    request.headers.get("cookie"),
  );
  return getSessionContext(sessionId);
}

export async function requirePageSession(
  action?: AuthAction,
  options?: { next?: string },
): Promise<SessionContext> {
  const context = await readSessionFromCookies();
  if (!context) {
    const next = options?.next ? `?next=${encodeURIComponent(options.next)}` : "";
    redirect(`/login${next}`);
  }
  if (action) {
    const check = requireCapability(context, action);
    if (!check.ok) {
      redirect("/");
    }
  }
  return context;
}

export function requireApiCapability(
  request: Request,
  action: AuthAction,
):
  | { ok: true; context: SessionContext }
  | { ok: false; response: NextResponse } {
  const context = readSessionFromRequest(request);
  const check = requireCapability(context, action);
  if (!check.ok) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: check.error },
        { status: check.status },
      ),
    };
  }
  return check;
}

export function sessionCookieHeaders(
  sessionId: string,
  expiresAt: number,
): HeadersInit {
  return {
    "Set-Cookie": serializeSessionCookie(sessionId, { expiresAt }),
  };
}

export function clearSessionCookieHeaders(): HeadersInit {
  return {
    "Set-Cookie": serializeClearSessionCookie(),
  };
}

export { COOKIE_NAME };
