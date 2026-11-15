import { can } from "./capabilities";
import { verifyPassword } from "./password";
import { authStore } from "./store";
import type {
  AuthAction,
  AuthUser,
  Role,
  SessionContext,
} from "./types";

function resolveRole(userId: string): {
  role: Role;
  schoolId: string | null;
  schoolName: string | null;
} | null {
  const platform = authStore.platformGrants.get(userId);
  if (platform) {
    return { role: platform.role, schoolId: null, schoolName: null };
  }
  const membership = authStore.memberships.get(userId);
  if (!membership) return null;
  const school = authStore.schools.get(membership.schoolId);
  return {
    role: membership.role,
    schoolId: membership.schoolId,
    schoolName: school?.name ?? null,
  };
}

export function toAuthUser(userId: string): AuthUser | null {
  const user = authStore.users.get(userId);
  if (!user || user.status !== "active") return null;
  const scoped = resolveRole(userId);
  if (!scoped) return null;
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: scoped.role,
    schoolId: scoped.schoolId,
    schoolName: scoped.schoolName,
  };
}

export function loginWithPassword(
  email: string,
  password: string,
): { ok: true; context: SessionContext } | { ok: false; error: string } {
  const user = authStore.findUserByEmail(email);
  if (!user || user.status !== "active") {
    return { ok: false, error: "Invalid email or password" };
  }
  if (!verifyPassword(password, user.passwordHash)) {
    return { ok: false, error: "Invalid email or password" };
  }
  const authUser = toAuthUser(user.id);
  if (!authUser) {
    return { ok: false, error: "Account has no role" };
  }
  const session = authStore.createSession(user.id);
  return {
    ok: true,
    context: {
      sessionId: session.id,
      user: authUser,
      expiresAt: session.expiresAt,
    },
  };
}

export function getSessionContext(
  sessionId: string | undefined | null,
): SessionContext | null {
  if (!sessionId) return null;
  const session = authStore.getSession(sessionId);
  if (!session) return null;
  const user = toAuthUser(session.userId);
  if (!user) {
    authStore.deleteSession(session.id);
    return null;
  }
  return {
    sessionId: session.id,
    user,
    expiresAt: session.expiresAt,
  };
}

export function logoutSession(sessionId: string | undefined | null) {
  if (sessionId) authStore.deleteSession(sessionId);
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
}> {
  return [
    {
      email: "teacher@demo.classos",
      role: "teacher",
      passwordHint: "demo-teacher",
    },
    {
      email: "asha@demo.classos",
      role: "student",
      passwordHint: "demo-student",
    },
    {
      email: "dev@demo.classos",
      role: "student",
      passwordHint: "demo-student",
    },
    {
      email: "admin@demo.classos",
      role: "school_admin",
      passwordHint: "demo-admin",
    },
    {
      email: "author@classos.dev",
      role: "platform_author",
      passwordHint: "demo-author",
    },
  ];
}
