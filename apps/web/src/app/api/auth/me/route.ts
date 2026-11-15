import { NextResponse } from "next/server";
import { readSessionFromRequest } from "../../../../lib/auth";

export async function GET(request: Request) {
  const context = readSessionFromRequest(request);
  if (!context) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
  return NextResponse.json({ user: context.user });
}
