import type { AuthAction, Role } from "./types";

const MATRIX: Record<Role, ReadonlySet<AuthAction>> = {
  student: new Set(["learn", "board", "progress", "join_live"]),
  teacher: new Set([
    "learn",
    "board",
    "class_live",
    "teacher_equivalence",
    "school_view",
  ]),
  school_admin: new Set([
    "learn",
    "board",
    "school_admin",
    "school_view",
  ]),
  platform_author: new Set(["learn", "board", "author"]),
};

/** Capability check — pure, no I/O. */
export function can(role: Role, action: AuthAction): boolean {
  return MATRIX[role]?.has(action) ?? false;
}

export function rolesForAction(action: AuthAction): Role[] {
  return (Object.keys(MATRIX) as Role[]).filter((role) => can(role, action));
}
