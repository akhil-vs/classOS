import {
  generatePracticeItems,
  gradePracticeAnswer,
  getTopicById,
} from "@classos/curriculum";
import { getLearnerId } from "@/lib/auth";
import { recordAttempt } from "@/lib/progressStore";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const topicId = searchParams.get("topicId");
  if (!topicId || !getTopicById(topicId)) {
    return NextResponse.json({ error: "Unknown topicId" }, { status: 404 });
  }
  const seed = Number(searchParams.get("seed") ?? 1);
  const count = Number(searchParams.get("count") ?? 3);
  return NextResponse.json({
    topicId,
    items: generatePracticeItems(topicId, seed, count),
  });
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    topicId?: string;
    itemId?: string;
    response?: string;
    seed?: number;
  };
  if (!body.topicId || !body.itemId || body.response === undefined) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const items = generatePracticeItems(body.topicId, body.seed ?? 1, 8);
  const item = items.find((entry) => entry.id === body.itemId);
  if (!item) {
    return NextResponse.json({ error: "Unknown item" }, { status: 404 });
  }
  const grade = gradePracticeAnswer(item, body.response);
  const learnerId = await getLearnerId();
  const progress = recordAttempt(learnerId, body.topicId, grade.ok);
  return NextResponse.json({ ...grade, progress });
}
