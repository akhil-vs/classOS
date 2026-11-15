import { assertSameSchool } from "@classos/auth";
import {
  createLiveClass,
  endLiveClass,
  getLiveClass,
  listSchoolSessionSummaries,
  setPredictOpen,
  toTeacherSnapshot,
} from "@classos/class-live";
import { NextResponse } from "next/server";
import { requireApiCapability } from "../../../../lib/auth";

export async function POST(request: Request) {
  const auth = await requireApiCapability(request, "class_live");
  if (!auth.ok) return auth.response;
  if (!auth.context.user.schoolId) {
    return NextResponse.json(
      { error: "Teacher must belong to a school" },
      { status: 403 },
    );
  }

  const body = (await request.json()) as {
    topicId?: string;
    predictPrompt?: string;
    predictChoices?: string[];
  };
  const session = createLiveClass({
    teacherLabel: auth.context.user.name,
    teacherId: auth.context.user.id,
    schoolId: auth.context.user.schoolId,
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
    const admin = await requireApiCapability(request, "school_admin");
    if (admin.ok) {
      return NextResponse.json({
        sessions: listSchoolSessionSummaries({
          schoolId: admin.context.user.schoolId ?? undefined,
        }),
      });
    }
    const teacher = await requireApiCapability(request, "school_view");
    if (!teacher.ok) return teacher.response;
    return NextResponse.json({
      sessions: listSchoolSessionSummaries({
        schoolId: teacher.context.user.schoolId ?? undefined,
        teacherId: teacher.context.user.id,
      }),
    });
  }

  const auth = await requireApiCapability(request, "class_live");
  if (!auth.ok) return auth.response;

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }
  const session = getLiveClass(id);
  if (!session) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const schoolGate = assertSameSchool(auth.context, session.schoolId);
  if (!schoolGate.ok) {
    return NextResponse.json(
      { error: schoolGate.error },
      { status: schoolGate.status },
    );
  }
  if (
    session.teacherId &&
    session.teacherId !== auth.context.user.id &&
    auth.context.user.role !== "school_admin"
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return NextResponse.json(toTeacherSnapshot(session));
}

export async function PATCH(request: Request) {
  const auth = await requireApiCapability(request, "class_live");
  if (!auth.ok) return auth.response;

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

  const existing = getLiveClass(body.id);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const schoolGate = assertSameSchool(auth.context, existing.schoolId);
  if (!schoolGate.ok) {
    return NextResponse.json(
      { error: schoolGate.error },
      { status: schoolGate.status },
    );
  }
  if (
    existing.teacherId &&
    existing.teacherId !== auth.context.user.id &&
    auth.context.user.role !== "school_admin"
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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
