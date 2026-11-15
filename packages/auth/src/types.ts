/**
 * LMS identity + school tenancy (L0/L1).
 * Memory store for unit tests; Postgres when DATABASE_URL is set.
 */

export type Role =
  | "student"
  | "teacher"
  | "school_admin"
  | "platform_author";

export type SchoolRole = Exclude<Role, "platform_author">;

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
  locale: string;
  guestJoinPolicy: "off" | "teacher_issued";
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
  role: SchoolRole;
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

export interface Invite {
  id: string;
  schoolId: string;
  email: string;
  role: SchoolRole;
  /** sha256 hex of the raw token */
  tokenHash: string;
  invitedByUserId: string;
  createdAt: number;
  expiresAt: number;
  acceptedAt: number | null;
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

export interface SchoolMemberView {
  userId: string;
  email: string;
  name: string;
  role: SchoolRole;
  status: User["status"];
}
