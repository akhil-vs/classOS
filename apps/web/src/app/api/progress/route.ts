import { getLearnerId, learnerDisplayName } from "@/lib/auth";
import { listProgress, mastery } from "@/lib/progressStore";
import { NextResponse } from "next/server";

export async function GET() {
  const learnerId = await getLearnerId();
  const entries = listProgress(learnerId).map((entry) => ({
    ...entry,
    mastery: mastery(entry),
  }));
  return NextResponse.json({
    learner: { id: learnerId, name: learnerDisplayName(learnerId) },
    entries,
  });
}
