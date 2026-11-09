import {
  createLiveClass,
  getLiveClass,
  setPredictOpen,
  voteSummary,
} from "@classos/class-live";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    teacherLabel?: string;
    topicId?: string;
  };
  const session = createLiveClass({
    teacherLabel: body.teacherLabel ?? "Teacher",
    topicId: body.topicId,
  });
  return NextResponse.json(session);
}

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }
  const session = getLiveClass(id);
  if (!session) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({
    ...session,
    voteSummary: voteSummary(session),
  });
}

export async function PATCH(request: Request) {
  const body = (await request.json()) as {
    id?: string;
    predictOpen?: boolean;
  };
  if (!body.id || body.predictOpen === undefined) {
    return NextResponse.json({ error: "Missing id/predictOpen" }, { status: 400 });
  }
  const session = setPredictOpen(body.id, body.predictOpen);
  if (!session) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({
    ...session,
    voteSummary: voteSummary(session),
  });
}
