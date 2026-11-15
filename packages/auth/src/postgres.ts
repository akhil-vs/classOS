import pg from "pg";
import type {
  AuthRepository,
  CreateInviteInput,
  CreateUserInput,
} from "./repository";
import { AUTH_SCHEMA_SQL } from "./schema";
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
import { uid } from "./uid";

function mapSchool(row: {
  id: string;
  name: string;
  locale: string;
  guest_join_policy: string;
}): School {
  return {
    id: row.id,
    name: row.name,
    locale: row.locale,
    guestJoinPolicy: row.guest_join_policy as School["guestJoinPolicy"],
  };
}

function mapUser(row: {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  status: string;
}): User {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    passwordHash: row.password_hash,
    status: row.status as User["status"],
  };
}

function mapInvite(row: {
  id: string;
  school_id: string;
  email: string;
  role: string;
  token_hash: string;
  invited_by_user_id: string;
  created_at: string | number;
  expires_at: string | number;
  accepted_at: string | number | null;
}): Invite {
  return {
    id: row.id,
    schoolId: row.school_id,
    email: row.email,
    role: row.role as SchoolRole,
    tokenHash: row.token_hash,
    invitedByUserId: row.invited_by_user_id,
    createdAt: Number(row.created_at),
    expiresAt: Number(row.expires_at),
    acceptedAt: row.accepted_at === null ? null : Number(row.accepted_at),
  };
}

export class PostgresAuthRepository implements AuthRepository {
  private pool: pg.Pool;
  private ready: Promise<void> | null = null;

  constructor(databaseUrl: string) {
    this.pool = new pg.Pool({ connectionString: databaseUrl });
  }

  async ensureReady() {
    if (!this.ready) {
      this.ready = this.migrate();
    }
    await this.ready;
  }

  private async migrate() {
    await this.pool.query(AUTH_SCHEMA_SQL);
  }

  async createSchool(input: {
    id?: string;
    name: string;
    locale?: string;
    guestJoinPolicy?: School["guestJoinPolicy"];
  }): Promise<School> {
    await this.ensureReady();
    const school: School = {
      id: input.id ?? uid("school"),
      name: input.name.trim(),
      locale: input.locale ?? "en-IN",
      guestJoinPolicy: input.guestJoinPolicy ?? "off",
    };
    await this.pool.query(
      `INSERT INTO schools (id, name, locale, guest_join_policy)
       VALUES ($1, $2, $3, $4)`,
      [school.id, school.name, school.locale, school.guestJoinPolicy],
    );
    return school;
  }

  async getSchool(id: string) {
    await this.ensureReady();
    const result = await this.pool.query(
      `SELECT id, name, locale, guest_join_policy FROM schools WHERE id = $1`,
      [id],
    );
    const row = result.rows[0];
    return row ? mapSchool(row) : null;
  }

  async listSchools() {
    await this.ensureReady();
    const result = await this.pool.query(
      `SELECT id, name, locale, guest_join_policy FROM schools ORDER BY name`,
    );
    return result.rows.map(mapSchool);
  }

  async createUser(input: CreateUserInput): Promise<User> {
    await this.ensureReady();
    const user: User = {
      id: uid("user"),
      email: input.email.trim().toLowerCase(),
      name: input.name.trim(),
      passwordHash: input.passwordHash,
      status: input.status ?? "active",
    };
    await this.pool.query(
      `INSERT INTO users (id, email, name, password_hash, status)
       VALUES ($1, $2, $3, $4, $5)`,
      [user.id, user.email, user.name, user.passwordHash, user.status],
    );
    return user;
  }

  async getUser(id: string) {
    await this.ensureReady();
    const result = await this.pool.query(
      `SELECT id, email, name, password_hash, status FROM users WHERE id = $1`,
      [id],
    );
    const row = result.rows[0];
    return row ? mapUser(row) : null;
  }

  async findUserByEmail(email: string) {
    await this.ensureReady();
    const result = await this.pool.query(
      `SELECT id, email, name, password_hash, status FROM users WHERE email = $1`,
      [email.trim().toLowerCase()],
    );
    const row = result.rows[0];
    return row ? mapUser(row) : null;
  }

  async setMembership(membership: Membership) {
    await this.ensureReady();
    await this.pool.query(
      `INSERT INTO memberships (user_id, school_id, role)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id) DO UPDATE SET school_id = EXCLUDED.school_id, role = EXCLUDED.role`,
      [membership.userId, membership.schoolId, membership.role],
    );
  }

  async getMembership(userId: string) {
    await this.ensureReady();
    const result = await this.pool.query(
      `SELECT user_id, school_id, role FROM memberships WHERE user_id = $1`,
      [userId],
    );
    const row = result.rows[0];
    if (!row) return null;
    return {
      userId: row.user_id as string,
      schoolId: row.school_id as string,
      role: row.role as SchoolRole,
    };
  }

  async listMembers(schoolId: string): Promise<SchoolMemberView[]> {
    await this.ensureReady();
    const result = await this.pool.query(
      `SELECT u.id, u.email, u.name, u.status, m.role
       FROM memberships m
       JOIN users u ON u.id = m.user_id
       WHERE m.school_id = $1
       ORDER BY u.email`,
      [schoolId],
    );
    return result.rows.map((row) => ({
      userId: row.id as string,
      email: row.email as string,
      name: row.name as string,
      role: row.role as SchoolRole,
      status: row.status as User["status"],
    }));
  }

  async setPlatformGrant(grant: PlatformGrant) {
    await this.ensureReady();
    await this.pool.query(
      `INSERT INTO platform_grants (user_id, role) VALUES ($1, $2)
       ON CONFLICT (user_id) DO UPDATE SET role = EXCLUDED.role`,
      [grant.userId, grant.role],
    );
  }

  async getPlatformGrant(userId: string) {
    await this.ensureReady();
    const result = await this.pool.query(
      `SELECT user_id, role FROM platform_grants WHERE user_id = $1`,
      [userId],
    );
    const row = result.rows[0];
    if (!row) return null;
    return {
      userId: row.user_id as string,
      role: "platform_author" as const,
    };
  }

  async createSession(userId: string, ttlMs: number): Promise<Session> {
    await this.ensureReady();
    const now = Date.now();
    const session: Session = {
      id: uid("sess"),
      userId,
      createdAt: now,
      expiresAt: now + ttlMs,
    };
    await this.pool.query(
      `INSERT INTO sessions (id, user_id, created_at, expires_at)
       VALUES ($1, $2, $3, $4)`,
      [session.id, session.userId, session.createdAt, session.expiresAt],
    );
    return session;
  }

  async getSession(sessionId: string) {
    await this.ensureReady();
    const result = await this.pool.query(
      `SELECT id, user_id, created_at, expires_at FROM sessions WHERE id = $1`,
      [sessionId],
    );
    const row = result.rows[0];
    if (!row) return null;
    const expiresAt = Number(row.expires_at);
    if (expiresAt <= Date.now()) {
      await this.deleteSession(sessionId);
      return null;
    }
    return {
      id: row.id as string,
      userId: row.user_id as string,
      createdAt: Number(row.created_at),
      expiresAt,
    };
  }

  async deleteSession(sessionId: string) {
    await this.ensureReady();
    await this.pool.query(`DELETE FROM sessions WHERE id = $1`, [sessionId]);
  }

  async createInvite(input: CreateInviteInput): Promise<Invite> {
    await this.ensureReady();
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
    await this.pool.query(
      `INSERT INTO invites
        (id, school_id, email, role, token_hash, invited_by_user_id, created_at, expires_at, accepted_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,NULL)`,
      [
        invite.id,
        invite.schoolId,
        invite.email,
        invite.role,
        invite.tokenHash,
        invite.invitedByUserId,
        invite.createdAt,
        invite.expiresAt,
      ],
    );
    return invite;
  }

  async findInviteByTokenHash(tokenHash: string) {
    await this.ensureReady();
    const result = await this.pool.query(
      `SELECT id, school_id, email, role, token_hash, invited_by_user_id,
              created_at, expires_at, accepted_at
       FROM invites WHERE token_hash = $1`,
      [tokenHash],
    );
    const row = result.rows[0];
    return row ? mapInvite(row) : null;
  }

  async markInviteAccepted(inviteId: string, at = Date.now()) {
    await this.ensureReady();
    await this.pool.query(
      `UPDATE invites SET accepted_at = $2 WHERE id = $1`,
      [inviteId, at],
    );
  }

  async listPendingInvites(schoolId: string) {
    await this.ensureReady();
    const result = await this.pool.query(
      `SELECT id, school_id, email, role, token_hash, invited_by_user_id,
              created_at, expires_at, accepted_at
       FROM invites
       WHERE school_id = $1 AND accepted_at IS NULL AND expires_at > $2
       ORDER BY created_at DESC`,
      [schoolId, Date.now()],
    );
    return result.rows.map(mapInvite);
  }

  async resetAll() {
    await this.ensureReady();
    await this.pool.query(`
      TRUNCATE invites, sessions, platform_grants, memberships, users, schools
      RESTART IDENTITY CASCADE
    `);
  }

  async close() {
    await this.pool.end();
  }
}
