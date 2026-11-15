import { can } from "./capabilities";
import { ensureAuthReady } from "./db";
import { verifyPassword } from "./password";
import { SESSION_TTL_MS } from "./seed";
import type {
  AuthAction,
  AuthUser,
  Role,
  SessionContext,
} from "./types";

export async function toAuthUser(userId: string): Promise<AuthUser | null> {
  const repo = await ensureAuthReady();
  const user = await repo.getUser(userId);
  if (!user || user.status !== "active") return null;

  const platform = await repo.getPlatformGrant(userId);
  if (platform) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: platform.role,
      schoolId: null,
      schoolName: null,
    };
  }

  const membership = await repo.getMembership(userId);
  if (!membership) return null;
  const school = await repo.getSchool(membership.schoolId);
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: membership.role,
    schoolId: membership.schoolId,
    schoolName: school?.name ?? null,
  };
}

export async function loginWithPassword(
  email: string,
  password: string,
): Promise<{ ok: true; context: SessionContext } | { ok: false; error: string }> {
  const repo = await ensureAuthReady();
  const user = await repo.findUserByEmail(email);
  if (!user || user.status !== "active") {
    return { ok: false, error: "Invalid email or password" };
  }
  if (!verifyPassword(password, user.passwordHash)) {
    return { ok: false, error: "Invalid email or password" };
  }
  const authUser = await toAuthUser(user.id);
  if (!authUser) {
    return { ok: false, error: "Account has no role" };
  }
  const session = await repo.createSession(user.id, SESSION_TTL_MS);
  return {
    ok: true,
    context: {
      sessionId: session.id,
      user: authUser,
      expiresAt: session.expiresAt,
    },
  };
}

export async function getSessionContext(
  sessionId: string | undefined | null,
): Promise<SessionContext | null> {
  if (!sessionId) return null;
  const repo = await ensureAuthReady();
  const session = await repo.getSession(sessionId);
  if (!session) return null;
  const user = await toAuthUser(session.userId);
  if (!user) {
    await repo.deleteSession(session.id);
    return null;
  }
  return {
    sessionId: session.id,
    user,
    expiresAt: session.expiresAt,
  };
}

export async function logoutSession(sessionId: string | undefined | null) {
  if (!sessionId) return;
  const repo = await ensureAuthReady();
  await repo.deleteSession(sessionId);
}

export function requireCapability(
  context: SessionContext | null,
  action: AuthAction,
):
  | { ok: true; context: SessionContext }
  | { ok: false; status: 401 | 403; error: string } {
  if (!context) {
    return { ok: false, status: 401, error: "Authentication required" };
  }
  if (!can(context.user.role, action)) {
    return { ok: false, status: 403, error: "Forbidden for this role" };
  }
  return { ok: true, context };
}

export function listDemoAccounts(): Array<{
  email: string;
  role: Role;
  passwordHint: string;
  school: string;
}> {
  return [
    {
      email: "teacher@demo.classos",
      role: "teacher",
      passwordHint: "demo-teacher",
      school: "Demo CBSE School",
    },
    {
      email: "asha@demo.classos",
      role: "student",
      passwordHint: "demo-student",
      school: "Demo CBSE School",
    },
    {
      email: "admin@demo.classos",
      role: "school_admin",
      passwordHint: "demo-admin",
      school: "Demo CBSE School",
    },
    {
      email: "teacher@north.classos",
      role: "teacher",
      passwordHint: "demo-teacher",
      school: "North Ridge Public",
    },
    {
      email: "ria@north.classos",
      role: "student",
      passwordHint: "demo-student",
      school: "North Ridge Public",
    },
    {
      email: "admin@north.classos",
      role: "school_admin",
      passwordHint: "demo-admin",
      school: "North Ridge Public",
    },
    {
      email: "author@classos.dev",
      role: "platform_author",
      passwordHint: "demo-author",
      school: "—",
    },
  ];
}
