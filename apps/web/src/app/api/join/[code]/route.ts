import { assertSameSchool } from "@classos/auth";
import { getLiveClassByCode, toStudentSnapshot } from "@classos/class-live";
import { NextResponse } from "next/server";
import { requireApiCapability } from "../../../../lib/auth";

export async function GET(
  request: Request,
  context: { params: Promise<{ code: string }> },
) {
  const auth = await requireApiCapability(request, "join_live");
  if (!auth.ok) return auth.response;

  const { code } = await context.params;
  const session = getLiveClassByCode(code);
  if (!session) {
    return NextResponse.json({ error: "Join code not found" }, { status: 404 });
  }
  const schoolGate = assertSameSchool(auth.context, session.schoolId);
  if (!schoolGate.ok) {
    return NextResponse.json(
      { error: schoolGate.error },
      { status: schoolGate.status },
    );
  }
  return NextResponse.json(toStudentSnapshot(session));
}
