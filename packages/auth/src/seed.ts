import { hashPassword } from "./password";
import type { AuthRepository } from "./repository";

/** Demo passwords — documented on /login for local pilots. */
export const DEMO_PASSWORDS = {
  admin: "demo-admin",
  teacher: "demo-teacher",
  student: "demo-student",
  author: "demo-author",
} as const;

export const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12h
export const COOKIE_NAME = "classos_session";
export const INVITE_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

async function ensureUser(
  repo: AuthRepository,
  input: { email: string; name: string; password: string },
) {
  const existing = await repo.findUserByEmail(input.email);
  if (existing) return existing;
  return repo.createUser({
    email: input.email,
    name: input.name,
    passwordHash: hashPassword(input.password),
  });
}

/** Seeds two isolated schools + platform author. Idempotent. */
export async function seedDemoTenancy(repo: AuthRepository) {
  await repo.ensureReady();

  const demo = (await repo.getSchool("school_demo"))
    ?? (await repo.createSchool({
      id: "school_demo",
      name: "Demo CBSE School",
    }));

  const north = (await repo.getSchool("school_north"))
    ?? (await repo.createSchool({
      id: "school_north",
      name: "North Ridge Public",
    }));

  const admin = await ensureUser(repo, {
    email: "admin@demo.classos",
    name: "School Admin",
    password: DEMO_PASSWORDS.admin,
  });
  const teacher = await ensureUser(repo, {
    email: "teacher@demo.classos",
    name: "Ms. Rao",
    password: DEMO_PASSWORDS.teacher,
  });
  const asha = await ensureUser(repo, {
    email: "asha@demo.classos",
    name: "Asha",
    password: DEMO_PASSWORDS.student,
  });
  const dev = await ensureUser(repo, {
    email: "dev@demo.classos",
    name: "Dev",
    password: DEMO_PASSWORDS.student,
  });

  const northAdmin = await ensureUser(repo, {
    email: "admin@north.classos",
    name: "North Admin",
    password: DEMO_PASSWORDS.admin,
  });
  const northTeacher = await ensureUser(repo, {
    email: "teacher@north.classos",
    name: "Mr. Iyer",
    password: DEMO_PASSWORDS.teacher,
  });
  const northStudent = await ensureUser(repo, {
    email: "ria@north.classos",
    name: "Ria",
    password: DEMO_PASSWORDS.student,
  });

  const author = await ensureUser(repo, {
    email: "author@classos.dev",
    name: "Platform Author",
    password: DEMO_PASSWORDS.author,
  });

  await repo.setMembership({
    userId: admin.id,
    schoolId: demo.id,
    role: "school_admin",
  });
  await repo.setMembership({
    userId: teacher.id,
    schoolId: demo.id,
    role: "teacher",
  });
  await repo.setMembership({
    userId: asha.id,
    schoolId: demo.id,
    role: "student",
  });
  await repo.setMembership({
    userId: dev.id,
    schoolId: demo.id,
    role: "student",
  });

  await repo.setMembership({
    userId: northAdmin.id,
    schoolId: north.id,
    role: "school_admin",
  });
  await repo.setMembership({
    userId: northTeacher.id,
    schoolId: north.id,
    role: "teacher",
  });
  await repo.setMembership({
    userId: northStudent.id,
    schoolId: north.id,
    role: "student",
  });

  await repo.setPlatformGrant({
    userId: author.id,
    role: "platform_author",
  });

  return { demo, north };
}
