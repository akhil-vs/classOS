import { assertSameSchool } from "@classos/auth";
import {
  getLiveClassByCode,
  registerPresence,
  toStudentSnapshot,
} from "@classos/class-live";
import { NextResponse } from "next/server";
import { requireApiCapability } from "../../../../../lib/auth";

export async function POST(
  request: Request,
  context: { params: Promise<{ code: string }> },
) {
  const auth = await requireApiCapability(request, "join_live");
  if (!auth.ok) return auth.response;

  const { code } = await context.params;
  const existing = getLiveClassByCode(code);
  if (!existing) {
    return NextResponse.json({ error: "Join code not found" }, { status: 404 });
  }
  const schoolGate = assertSameSchool(auth.context, existing.schoolId);
  if (!schoolGate.ok) {
    return NextResponse.json(
      { error: schoolGate.error },
      { status: schoolGate.status },
    );
  }

  const presence = registerPresence({
    liveClassId: existing.id,
    studentLabel: auth.context.user.name,
    userId: auth.context.user.id,
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
