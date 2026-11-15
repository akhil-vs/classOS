/**
 * LMS L0 identity types — school tenancy fields ready for L1+.
 * Store is in-process for L0; swap to Postgres behind the same shapes.
 */

export type Role =
  | "student"
  | "teacher"
  | "school_admin"
  | "platform_author";

export type AuthAction =
  | "learn"
  | "board"
  | "progress"
  | "class_live"
  | "join_live"
  | "teacher_equivalence"
  | "school_admin"
  | "school_view"
  | "author";

export interface School {
  id: string;
  name: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  /** scrypt hash string */
  passwordHash: string;
  status: "active" | "disabled";
}

export interface Membership {
  userId: string;
  schoolId: string;
  role: Exclude<Role, "platform_author">;
}

/** Platform staff — not school-scoped. */
export interface PlatformGrant {
  userId: string;
  role: "platform_author";
}

export interface Session {
  id: string;
  userId: string;
  createdAt: number;
  expiresAt: number;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  schoolId: string | null;
  schoolName: string | null;
}

export interface SessionContext {
  sessionId: string;
  user: AuthUser;
  expiresAt: number;
}
