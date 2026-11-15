import {
  logoutSession,
  parseSessionIdFromCookieHeader,
  serializeClearSessionCookie,
} from "@classos/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const sessionId = parseSessionIdFromCookieHeader(
    request.headers.get("cookie"),
  );
  await logoutSession(sessionId);
  const response = NextResponse.json({ ok: true });
  response.headers.set("Set-Cookie", serializeClearSessionCookie());
  return response;
}
