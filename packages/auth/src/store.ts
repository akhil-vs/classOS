import { hashPassword } from "./password";
import type {
  Membership,
  PlatformGrant,
  School,
  Session,
  User,
} from "./types";

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

/** Demo passwords — documented on /login for local pilots. */
export const DEMO_PASSWORDS = {
  admin: "demo-admin",
  teacher: "demo-teacher",
  student: "demo-student",
  author: "demo-author",
} as const;

export const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12h
export const COOKIE_NAME = "classos_session";

export class AuthStore {
  schools = new Map<string, School>();
  users = new Map<string, User>();
  usersByEmail = new Map<string, string>();
  memberships = new Map<string, Membership>(); // userId → membership
  platformGrants = new Map<string, PlatformGrant>();
  sessions = new Map<string, Session>();

  seedDemo() {
    if (this.schools.size > 0) return;

    const school: School = {
      id: "school_demo",
      name: "Demo CBSE School",
    };
    this.schools.set(school.id, school);

    const admin = this.createUser({
      email: "admin@demo.classos",
      name: "School Admin",
      password: DEMO_PASSWORDS.admin,
    });
    const teacher = this.createUser({
      email: "teacher@demo.classos",
      name: "Ms. Rao",
      password: DEMO_PASSWORDS.teacher,
    });
    const asha = this.createUser({
      email: "asha@demo.classos",
      name: "Asha",
      password: DEMO_PASSWORDS.student,
    });
    const dev = this.createUser({
      email: "dev@demo.classos",
      name: "Dev",
      password: DEMO_PASSWORDS.student,
    });
    const author = this.createUser({
      email: "author@classos.dev",
      name: "Platform Author",
      password: DEMO_PASSWORDS.author,
    });

    this.memberships.set(admin.id, {
      userId: admin.id,
      schoolId: school.id,
      role: "school_admin",
    });
    this.memberships.set(teacher.id, {
      userId: teacher.id,
      schoolId: school.id,
      role: "teacher",
    });
    this.memberships.set(asha.id, {
      userId: asha.id,
      schoolId: school.id,
      role: "student",
    });
    this.memberships.set(dev.id, {
      userId: dev.id,
      schoolId: school.id,
      role: "student",
    });
    this.platformGrants.set(author.id, {
      userId: author.id,
      role: "platform_author",
    });
  }

  createUser(input: {
    email: string;
    name: string;
    password: string;
  }): User {
    const email = input.email.trim().toLowerCase();
    if (this.usersByEmail.has(email)) {
      throw new Error(`User already exists: ${email}`);
    }
    const user: User = {
      id: uid("user"),
      email,
      name: input.name.trim(),
      passwordHash: hashPassword(input.password),
      status: "active",
    };
    this.users.set(user.id, user);
    this.usersByEmail.set(email, user.id);
    return user;
  }

  findUserByEmail(email: string): User | undefined {
    const id = this.usersByEmail.get(email.trim().toLowerCase());
    return id ? this.users.get(id) : undefined;
  }

  createSession(userId: string, now = Date.now()): Session {
    const session: Session = {
      id: uid("sess"),
      userId,
      createdAt: now,
      expiresAt: now + SESSION_TTL_MS,
    };
    this.sessions.set(session.id, session);
    return session;
  }

  getSession(sessionId: string, now = Date.now()): Session | undefined {
    const session = this.sessions.get(sessionId);
    if (!session) return undefined;
    if (session.expiresAt <= now) {
      this.sessions.delete(sessionId);
      return undefined;
    }
    return session;
  }

  deleteSession(sessionId: string) {
    this.sessions.delete(sessionId);
  }

  deleteUserSessions(userId: string) {
    for (const [id, session] of this.sessions) {
      if (session.userId === userId) this.sessions.delete(id);
    }
  }

  /** Test helper */
  reset() {
    this.schools.clear();
    this.users.clear();
    this.usersByEmail.clear();
    this.memberships.clear();
    this.platformGrants.clear();
    this.sessions.clear();
  }
}

/** Process-local store for L0. Seeded once per process. */
export const authStore = new AuthStore();
authStore.seedDemo();
