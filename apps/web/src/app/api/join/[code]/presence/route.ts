import {
  getLiveClassByCode,
  registerPresence,
  toStudentSnapshot,
} from "@classos/class-live";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  context: { params: Promise<{ code: string }> },
) {
  const { code } = await context.params;
  const body = (await request.json()) as { studentLabel?: string };
  if (!body.studentLabel) {
    return NextResponse.json(
      { error: "studentLabel required" },
      { status: 400 },
    );
  }
  const existing = getLiveClassByCode(code);
  if (!existing) {
    return NextResponse.json({ error: "Join code not found" }, { status: 404 });
  }
  const presence = registerPresence({
    liveClassId: existing.id,
    studentLabel: body.studentLabel,
  });
  if ("error" in presence) {
    return NextResponse.json(presence, { status: 400 });
  }
  return NextResponse.json({
    ok: true,
    presence,
    session: toStudentSnapshot(existing),
  });
}
