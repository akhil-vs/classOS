import {
  createLiveClass,
  endLiveClass,
  getLiveClass,
  listSchoolSessionSummaries,
  setPredictOpen,
  toTeacherSnapshot,
} from "@classos/class-live";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    teacherLabel?: string;
    topicId?: string;
    predictPrompt?: string;
    predictChoices?: string[];
  };
  const session = createLiveClass({
    teacherLabel: body.teacherLabel ?? "Teacher",
    topicId: body.topicId,
    predictPrompt: body.predictPrompt,
    predictChoices: body.predictChoices,
  });
  return NextResponse.json(toTeacherSnapshot(session));
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  const list = url.searchParams.get("list");

  if (list === "school") {
    return NextResponse.json({ sessions: listSchoolSessionSummaries() });
  }

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }
  const session = getLiveClass(id);
  if (!session) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(toTeacherSnapshot(session));
}

export async function PATCH(request: Request) {
  const body = (await request.json()) as {
    id?: string;
    predictOpen?: boolean;
    predictPrompt?: string;
    predictChoices?: string[];
    action?: "end";
  };
  if (!body.id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  if (body.action === "end") {
    const ended = endLiveClass(body.id);
    if ("error" in ended) {
      return NextResponse.json(ended, { status: 404 });
    }
    return NextResponse.json(toTeacherSnapshot(ended));
  }

  if (body.predictOpen === undefined) {
    return NextResponse.json(
      { error: "Missing predictOpen or action" },
      { status: 400 },
    );
  }

  const session = setPredictOpen(body.id, body.predictOpen, {
    prompt: body.predictPrompt,
    choices: body.predictChoices,
  });
  if ("error" in session) {
    const status = session.error === "Live class not found" ? 404 : 400;
    return NextResponse.json(session, { status });
  }
  return NextResponse.json(toTeacherSnapshot(session));
}
