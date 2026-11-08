import { AUTH_COOKIE } from "@/lib/auth";
import { NextResponse } from "next/server";

/** Mint or clear the demo learner cookie (auth stub). */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    action?: "signin" | "signout";
    name?: string;
  };
  const response = NextResponse.json({
    ok: true,
    action: body.action ?? "signin",
  });

  if (body.action === "signout") {
    response.cookies.set(AUTH_COOKIE, "", { path: "/", maxAge: 0 });
    return response;
  }

  const id = `learner_${(body.name ?? "demo")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .slice(0, 24)}`;
  response.cookies.set(AUTH_COOKIE, id, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}
