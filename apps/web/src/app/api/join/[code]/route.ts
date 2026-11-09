import { getLiveClassByCode, toStudentSnapshot } from "@classos/class-live";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  context: { params: Promise<{ code: string }> },
) {
  const { code } = await context.params;
  const session = getLiveClassByCode(code);
  if (!session) {
    return NextResponse.json({ error: "Join code not found" }, { status: 404 });
  }
  return NextResponse.json(toStudentSnapshot(session));
}
