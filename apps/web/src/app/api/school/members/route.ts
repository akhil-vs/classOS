import { ensureAuthReady } from "@classos/auth";
import { NextResponse } from "next/server";
import { requireApiCapability } from "../../../../lib/auth";

export async function GET(request: Request) {
  const auth = await requireApiCapability(request, "school_admin");
  if (!auth.ok) return auth.response;
  if (!auth.context.user.schoolId) {
    return NextResponse.json({ error: "No school" }, { status: 403 });
  }

  const repo = await ensureAuthReady();
  const members = await repo.listMembers(auth.context.user.schoolId);
  const invites = await repo.listPendingInvites(auth.context.user.schoolId);
  return NextResponse.json({
    schoolId: auth.context.user.schoolId,
    schoolName: auth.context.user.schoolName,
    members,
    pendingInvites: invites.map((invite) => ({
      id: invite.id,
      email: invite.email,
      role: invite.role,
      expiresAt: invite.expiresAt,
    })),
  });
}
