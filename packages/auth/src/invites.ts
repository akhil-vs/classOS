import { ensureAuthReady } from "./db";
import { hashPassword } from "./password";
import { INVITE_TTL_MS } from "./seed";
import { loginWithPassword } from "./session";
import type { SchoolRole, SessionContext } from "./types";
import { createInviteToken, hashToken } from "./uid";

export async function createSchoolInvite(input: {
  actor: SessionContext;
  email: string;
  role: SchoolRole;
}): Promise<
  | {
      ok: true;
      inviteId: string;
      token: string;
      email: string;
      role: SchoolRole;
      expiresAt: number;
    }
  | { ok: false; status: 400 | 403; error: string }
> {
  if (input.actor.user.role !== "school_admin" || !input.actor.user.schoolId) {
    return { ok: false, status: 403, error: "Only school admins can invite" };
  }
  const email = input.email.trim().toLowerCase();
  if (!email.includes("@")) {
    return { ok: false, status: 400, error: "Valid email required" };
  }
  if (!["student", "teacher", "school_admin"].includes(input.role)) {
    return { ok: false, status: 400, error: "Invalid role" };
  }

  const repo = await ensureAuthReady();
  if (await repo.findUserByEmail(email)) {
    return {
      ok: false,
      status: 400,
      error: "Email already registered — L1 invites are for new accounts only",
    };
  }

  const { token, tokenHash } = createInviteToken();
  const invite = await repo.createInvite({
    schoolId: input.actor.user.schoolId,
    email,
    role: input.role,
    invitedByUserId: input.actor.user.id,
    tokenHash,
    expiresAt: Date.now() + INVITE_TTL_MS,
  });

  return {
    ok: true,
    inviteId: invite.id,
    token,
    email: invite.email,
    role: invite.role,
    expiresAt: invite.expiresAt,
  };
}

export async function previewInvite(token: string) {
  const repo = await ensureAuthReady();
  const invite = await repo.findInviteByTokenHash(hashToken(token));
  if (!invite) return { ok: false as const, error: "Invite not found" };
  if (invite.acceptedAt) {
    return { ok: false as const, error: "Invite already used" };
  }
  if (invite.expiresAt <= Date.now()) {
    return { ok: false as const, error: "Invite expired" };
  }
  const school = await repo.getSchool(invite.schoolId);
  return {
    ok: true as const,
    email: invite.email,
    role: invite.role,
    schoolName: school?.name ?? "School",
    expiresAt: invite.expiresAt,
  };
}

export async function acceptInvite(input: {
  token: string;
  name: string;
  password: string;
}) {
  const name = input.name.trim();
  const password = input.password;
  if (name.length < 2) return { ok: false as const, error: "Name required" };
  if (password.length < 8) {
    return {
      ok: false as const,
      error: "Password must be at least 8 characters",
    };
  }

  const repo = await ensureAuthReady();
  const invite = await repo.findInviteByTokenHash(hashToken(input.token));
  if (!invite) return { ok: false as const, error: "Invite not found" };
  if (invite.acceptedAt) {
    return { ok: false as const, error: "Invite already used" };
  }
  if (invite.expiresAt <= Date.now()) {
    return { ok: false as const, error: "Invite expired" };
  }
  if (await repo.findUserByEmail(invite.email)) {
    return { ok: false as const, error: "Email already registered" };
  }

  const user = await repo.createUser({
    email: invite.email,
    name,
    passwordHash: hashPassword(password),
  });
  await repo.setMembership({
    userId: user.id,
    schoolId: invite.schoolId,
    role: invite.role,
  });
  await repo.markInviteAccepted(invite.id);

  return loginWithPassword(invite.email, password);
}
