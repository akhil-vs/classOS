import { getLiveClassByCode, toStudentSnapshot } from "@classos/class-live";
import { NextResponse } from "next/server";
import { requireApiCapability } from "../../../../lib/auth";

export async function GET(
  request: Request,
  context: { params: Promise<{ code: string }> },
) {
  const auth = requireApiCapability(request, "join_live");
  if (!auth.ok) return auth.response;

  const { code } = await context.params;
  const session = getLiveClassByCode(code);
  if (!session) {
    return NextResponse.json({ error: "Join code not found" }, { status: 404 });
  }
  if (
    session.schoolId &&
    auth.context.user.schoolId &&
    session.schoolId !== auth.context.user.schoolId
  ) {
    return NextResponse.json({ error: "Wrong school for this class" }, { status: 403 });
  }
  return NextResponse.json(toStudentSnapshot(session));
}
