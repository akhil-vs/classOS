import {
  castPredictVote,
  getLiveClassByCode,
  toStudentSnapshot,
} from "@classos/class-live";
import { NextResponse } from "next/server";
import { requireApiCapability } from "../../../../../lib/auth";

export async function POST(
  request: Request,
  context: { params: Promise<{ code: string }> },
) {
  const auth = requireApiCapability(request, "join_live");
  if (!auth.ok) return auth.response;

  const { code } = await context.params;
  const body = (await request.json()) as { choice?: string };
  if (!body.choice) {
    return NextResponse.json({ error: "choice required" }, { status: 400 });
  }

  const existing = getLiveClassByCode(code);
  if (!existing) {
    return NextResponse.json({ error: "Join code not found" }, { status: 404 });
  }
  if (
    existing.schoolId &&
    auth.context.user.schoolId &&
    existing.schoolId !== auth.context.user.schoolId
  ) {
    return NextResponse.json({ error: "Wrong school for this class" }, { status: 403 });
  }

  const result = castPredictVote({
    liveClassId: existing.id,
    studentLabel: auth.context.user.name,
    userId: auth.context.user.id,
    choice: body.choice,
    at: Date.now(),
  });
  if ("error" in result) {
    const status = result.error === "Live class not found" ? 404 : 400;
    return NextResponse.json(result, { status });
  }
  return NextResponse.json({
    ok: true,
    session: toStudentSnapshot(result),
  });
}
