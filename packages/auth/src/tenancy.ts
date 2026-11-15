import type { SessionContext } from "./types";

export function assertSameSchool(
  context: SessionContext,
  resourceSchoolId: string | null | undefined,
): { ok: true } | { ok: false; status: 403; error: string } {
  if (!resourceSchoolId) {
    return { ok: false, status: 403, error: "Resource is not school-scoped" };
  }
  if (!context.user.schoolId) {
    return { ok: false, status: 403, error: "Account is not school-scoped" };
  }
  if (context.user.schoolId !== resourceSchoolId) {
    return { ok: false, status: 403, error: "Cross-school access denied" };
  }
  return { ok: true };
}
