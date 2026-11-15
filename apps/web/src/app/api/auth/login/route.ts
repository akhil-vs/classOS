import {
  listDemoAccounts,
  loginWithPassword,
  serializeSessionCookie,
} from "@classos/auth";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    demoAccounts: listDemoAccounts(),
  });
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    email?: string;
    password?: string;
  };
  if (!body.email || !body.password) {
    return NextResponse.json(
      { error: "Email and password required" },
      { status: 400 },
    );
  }

  const result = await loginWithPassword(body.email, body.password);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 401 });
  }

  const response = NextResponse.json({
    user: result.context.user,
  });
  response.headers.set(
    "Set-Cookie",
    serializeSessionCookie(result.context.sessionId, {
      expiresAt: result.context.expiresAt,
    }),
  );
  return response;
}
