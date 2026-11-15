import {
  acceptInvite,
  serializeSessionCookie,
} from "@classos/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    token?: string;
    name?: string;
    password?: string;
  };
  if (!body.token || !body.name || !body.password) {
    return NextResponse.json(
      { error: "token, name, and password required" },
      { status: 400 },
    );
  }

  const result = await acceptInvite({
    token: body.token,
    name: body.name,
    password: body.password,
  });
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const response = NextResponse.json({ user: result.context.user });
  response.headers.set(
    "Set-Cookie",
    serializeSessionCookie(result.context.sessionId, {
      expiresAt: result.context.expiresAt,
    }),
  );
  return response;
}
