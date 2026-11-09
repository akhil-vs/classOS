import {
  castPredictVote,
  getLiveClassByCode,
  toStudentSnapshot,
  voteSummary,
} from "@classos/class-live";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  context: { params: Promise<{ code: string }> },
) {
  const { code } = await context.params;
  const body = (await request.json()) as {
    studentLabel?: string;
    choice?: string;
  };
  if (!body.studentLabel || !body.choice) {
    return NextResponse.json(
      { error: "studentLabel and choice required" },
      { status: 400 },
    );
  }
  const existing = getLiveClassByCode(code);
  if (!existing) {
    return NextResponse.json({ error: "Join code not found" }, { status: 404 });
  }
  const result = castPredictVote({
    liveClassId: existing.id,
    studentLabel: body.studentLabel,
    choice: body.choice,
    at: Date.now(),
  });
  if ("error" in result) {
    return NextResponse.json(result, { status: 400 });
  }
  return NextResponse.json({
    ok: true,
    voteSummary: voteSummary(result),
    session: toStudentSnapshot(result),
  });
}
