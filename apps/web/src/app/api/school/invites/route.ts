import { createSchoolInvite, type SchoolRole } from "@classos/auth";
import { NextResponse } from "next/server";
import { requireApiCapability } from "../../../../lib/auth";

export async function POST(request: Request) {
  const auth = await requireApiCapability(request, "school_admin");
  if (!auth.ok) return auth.response;

  const body = (await request.json()) as {
    email?: string;
    role?: SchoolRole;
  };
  if (!body.email || !body.role) {
    return NextResponse.json(
      { error: "email and role required" },
      { status: 400 },
    );
  }

  const result = await createSchoolInvite({
    actor: auth.context,
    email: body.email,
    role: body.role,
  });
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  const origin = new URL(request.url).origin;
  return NextResponse.json({
    inviteId: result.inviteId,
    email: result.email,
    role: result.role,
    expiresAt: result.expiresAt,
    acceptUrl: `${origin}/login/invite/${result.token}`,
  });
}
