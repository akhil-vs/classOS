import type {
  Invite,
  Membership,
  PlatformGrant,
  School,
  SchoolMemberView,
  SchoolRole,
  Session,
  User,
} from "./types";

export interface CreateUserInput {
  email: string;
  name: string;
  passwordHash: string;
  status?: User["status"];
}

export interface CreateInviteInput {
  schoolId: string;
  email: string;
  role: SchoolRole;
  invitedByUserId: string;
  tokenHash: string;
  expiresAt: number;
}

export interface AuthRepository {
  ensureReady(): Promise<void>;

  createSchool(input: {
    id?: string;
    name: string;
    locale?: string;
    guestJoinPolicy?: School["guestJoinPolicy"];
  }): Promise<School>;
  getSchool(id: string): Promise<School | null>;
  listSchools(): Promise<School[]>;

  createUser(input: CreateUserInput): Promise<User>;
  getUser(id: string): Promise<User | null>;
  findUserByEmail(email: string): Promise<User | null>;

  setMembership(membership: Membership): Promise<void>;
  getMembership(userId: string): Promise<Membership | null>;
  listMembers(schoolId: string): Promise<SchoolMemberView[]>;

  setPlatformGrant(grant: PlatformGrant): Promise<void>;
  getPlatformGrant(userId: string): Promise<PlatformGrant | null>;

  createSession(userId: string, ttlMs: number): Promise<Session>;
  getSession(sessionId: string): Promise<Session | null>;
  deleteSession(sessionId: string): Promise<void>;

  createInvite(input: CreateInviteInput): Promise<Invite>;
  findInviteByTokenHash(tokenHash: string): Promise<Invite | null>;
  markInviteAccepted(inviteId: string, at?: number): Promise<void>;
  listPendingInvites(schoolId: string): Promise<Invite[]>;

  /** Test helper */
  resetAll(): Promise<void>;
}
