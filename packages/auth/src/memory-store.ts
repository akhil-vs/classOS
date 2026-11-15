import { uid } from "./uid";
import type {
  CreateInviteInput,
  CreateUserInput,
  AuthRepository,
} from "./repository";
import type {
  Invite,
  Membership,
  PlatformGrant,
  School,
  SchoolMemberView,
  Session,
  User,
} from "./types";

export class MemoryAuthRepository implements AuthRepository {
  schools = new Map<string, School>();
  users = new Map<string, User>();
  usersByEmail = new Map<string, string>();
  memberships = new Map<string, Membership>();
  platformGrants = new Map<string, PlatformGrant>();
  sessions = new Map<string, Session>();
  invites = new Map<string, Invite>();
  invitesByHash = new Map<string, string>();

  async ensureReady() {}

  async createSchool(input: {
    id?: string;
    name: string;
    locale?: string;
    guestJoinPolicy?: School["guestJoinPolicy"];
  }): Promise<School> {
    const school: School = {
      id: input.id ?? uid("school"),
      name: input.name.trim(),
      locale: input.locale ?? "en-IN",
      guestJoinPolicy: input.guestJoinPolicy ?? "off",
    };
    this.schools.set(school.id, school);
    return school;
  }

  async getSchool(id: string) {
    return this.schools.get(id) ?? null;
  }

  async listSchools() {
    return [...this.schools.values()];
  }

  async createUser(input: CreateUserInput): Promise<User> {
    const email = input.email.trim().toLowerCase();
    if (this.usersByEmail.has(email)) {
      throw new Error(`User already exists: ${email}`);
    }
    const user: User = {
      id: uid("user"),
      email,
      name: input.name.trim(),
      passwordHash: input.passwordHash,
      status: input.status ?? "active",
    };
    this.users.set(user.id, user);
    this.usersByEmail.set(email, user.id);
    return user;
  }

  async getUser(id: string) {
    return this.users.get(id) ?? null;
  }

  async findUserByEmail(email: string) {
    const id = this.usersByEmail.get(email.trim().toLowerCase());
    return id ? (this.users.get(id) ?? null) : null;
  }

  async setMembership(membership: Membership) {
    this.memberships.set(membership.userId, membership);
  }

  async getMembership(userId: string) {
    return this.memberships.get(userId) ?? null;
  }

  async listMembers(schoolId: string): Promise<SchoolMemberView[]> {
    const rows: SchoolMemberView[] = [];
    for (const membership of this.memberships.values()) {
      if (membership.schoolId !== schoolId) continue;
      const user = this.users.get(membership.userId);
      if (!user) continue;
      rows.push({
        userId: user.id,
        email: user.email,
        name: user.name,
        role: membership.role,
        status: user.status,
      });
    }
    return rows.sort((a, b) => a.email.localeCompare(b.email));
  }

  async setPlatformGrant(grant: PlatformGrant) {
    this.platformGrants.set(grant.userId, grant);
  }

  async getPlatformGrant(userId: string) {
    return this.platformGrants.get(userId) ?? null;
  }

  async createSession(userId: string, ttlMs: number): Promise<Session> {
    const now = Date.now();
    const session: Session = {
      id: uid("sess"),
      userId,
      createdAt: now,
      expiresAt: now + ttlMs,
    };
    this.sessions.set(session.id, session);
    return session;
  }

  async getSession(sessionId: string) {
    const session = this.sessions.get(sessionId);
    if (!session) return null;
    if (session.expiresAt <= Date.now()) {
      this.sessions.delete(sessionId);
      return null;
    }
    return session;
  }

  async deleteSession(sessionId: string) {
    this.sessions.delete(sessionId);
  }

  async createInvite(input: CreateInviteInput): Promise<Invite> {
    const invite: Invite = {
      id: uid("inv"),
      schoolId: input.schoolId,
      email: input.email.trim().toLowerCase(),
      role: input.role,
      tokenHash: input.tokenHash,
      invitedByUserId: input.invitedByUserId,
      createdAt: Date.now(),
      expiresAt: input.expiresAt,
      acceptedAt: null,
    };
    this.invites.set(invite.id, invite);
    this.invitesByHash.set(invite.tokenHash, invite.id);
    return invite;
  }

  async findInviteByTokenHash(tokenHash: string) {
    const id = this.invitesByHash.get(tokenHash);
    return id ? (this.invites.get(id) ?? null) : null;
  }

  async markInviteAccepted(inviteId: string, at = Date.now()) {
    const invite = this.invites.get(inviteId);
    if (invite) invite.acceptedAt = at;
  }

  async listPendingInvites(schoolId: string) {
    return [...this.invites.values()]
      .filter(
        (invite) =>
          invite.schoolId === schoolId &&
          invite.acceptedAt === null &&
          invite.expiresAt > Date.now(),
      )
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  async resetAll() {
    this.schools.clear();
    this.users.clear();
    this.usersByEmail.clear();
    this.memberships.clear();
    this.platformGrants.clear();
    this.sessions.clear();
    this.invites.clear();
    this.invitesByHash.clear();
  }
}
