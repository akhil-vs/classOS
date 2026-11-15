import { afterEach, describe, expect, it } from "vitest";
import { can } from "./capabilities";
import { setRepositoryForTests, withFreshMemoryRepository } from "./db";
import {
  acceptInvite,
  createSchoolInvite,
  previewInvite,
} from "./invites";
import { hashPassword, verifyPassword } from "./password";
import { PostgresAuthRepository } from "./postgres";
import { seedDemoTenancy } from "./seed";
import {
  getSessionContext,
  loginWithPassword,
  logoutSession,
  requireCapability,
} from "./session";
import { assertSameSchool } from "./tenancy";

describe("password hashing", () => {
  it("verifies a matching password", () => {
    const hash = hashPassword("demo-teacher");
    expect(verifyPassword("demo-teacher", hash)).toBe(true);
    expect(verifyPassword("wrong", hash)).toBe(false);
  });
});

describe("capabilities", () => {
  it("allows teachers to run live class and equivalence", () => {
    expect(can("teacher", "class_live")).toBe(true);
    expect(can("teacher", "teacher_equivalence")).toBe(true);
    expect(can("student", "class_live")).toBe(false);
  });

  it("restricts author and school admin surfaces", () => {
    expect(can("platform_author", "author")).toBe(true);
    expect(can("school_admin", "school_admin")).toBe(true);
    expect(can("student", "school_view")).toBe(false);
  });
});

describe("memory tenancy", () => {
  afterEach(() => {
    setRepositoryForTests(null);
  });

  it("logs in demo teacher from school_demo", async () => {
    await withFreshMemoryRepository(async () => {
      const result = await loginWithPassword(
        "teacher@demo.classos",
        "demo-teacher",
      );
      expect(result.ok).toBe(true);
      if (!result.ok) return;
      expect(result.context.user.role).toBe("teacher");
      expect(result.context.user.schoolId).toBe("school_demo");
      expect(requireCapability(result.context, "class_live").ok).toBe(true);
      expect(requireCapability(result.context, "author").ok).toBe(false);
    });
  });

  it("isolates two schools in assertSameSchool", async () => {
    await withFreshMemoryRepository(async () => {
      const demoTeacher = await loginWithPassword(
        "teacher@demo.classos",
        "demo-teacher",
      );
      const northTeacher = await loginWithPassword(
        "teacher@north.classos",
        "demo-teacher",
      );
      expect(demoTeacher.ok && northTeacher.ok).toBe(true);
      if (!demoTeacher.ok || !northTeacher.ok) return;

      expect(assertSameSchool(demoTeacher.context, "school_demo").ok).toBe(
        true,
      );
      expect(assertSameSchool(demoTeacher.context, "school_north").ok).toBe(
        false,
      );
      expect(assertSameSchool(northTeacher.context, "school_demo").ok).toBe(
        false,
      );
    });
  });

  it("lets school admin invite and accept into the same school only", async () => {
    await withFreshMemoryRepository(async (repo) => {
      const admin = await loginWithPassword(
        "admin@demo.classos",
        "demo-admin",
      );
      expect(admin.ok).toBe(true);
      if (!admin.ok) return;

      const invited = await createSchoolInvite({
        actor: admin.context,
        email: "new.student@demo.classos",
        role: "student",
      });
      expect(invited.ok).toBe(true);
      if (!invited.ok) return;

      const preview = await previewInvite(invited.token);
      expect(preview.ok).toBe(true);
      if (!preview.ok) return;
      expect(preview.schoolName).toBe("Demo CBSE School");

      const accepted = await acceptInvite({
        token: invited.token,
        name: "New Student",
        password: "demo-student-1",
      });
      expect(accepted.ok).toBe(true);
      if (!accepted.ok) return;
      expect(accepted.context.user.schoolId).toBe("school_demo");
      expect(accepted.context.user.role).toBe("student");

      const members = await repo.listMembers("school_demo");
      expect(members.some((m) => m.email === "new.student@demo.classos")).toBe(
        true,
      );
      expect(
        (await repo.listMembers("school_north")).some(
          (m) => m.email === "new.student@demo.classos",
        ),
      ).toBe(false);
    });
  });

  it("resolves and clears sessions", async () => {
    await withFreshMemoryRepository(async () => {
      const result = await loginWithPassword(
        "admin@demo.classos",
        "demo-admin",
      );
      expect(result.ok).toBe(true);
      if (!result.ok) return;
      expect(
        (await getSessionContext(result.context.sessionId))?.user.role,
      ).toBe("school_admin");
      await logoutSession(result.context.sessionId);
      expect(await getSessionContext(result.context.sessionId)).toBeNull();
    });
  });
});

const postgresUrl =
  process.env.DATABASE_URL_TEST ??
  process.env.DATABASE_URL ??
  "postgres://classos:classos@127.0.0.1:5432/classos_test";

describe("postgres tenancy isolation", () => {
  afterEach(async () => {
    setRepositoryForTests(null);
  });

  it("keeps school member lists isolated", async () => {
    let repo: PostgresAuthRepository | null = null;
    try {
      repo = new PostgresAuthRepository(postgresUrl);
      await repo.ensureReady();
      await repo.resetAll();
      setRepositoryForTests(repo);
      await seedDemoTenancy(repo);
    } catch (error) {
      console.warn("Skipping Postgres tests:", error);
      if (repo) await repo.close();
      return;
    }

    try {
      const demo = await repo.listMembers("school_demo");
      const north = await repo.listMembers("school_north");
      expect(demo.some((m) => m.email.includes("@north.classos"))).toBe(false);
      expect(north.some((m) => m.email.includes("@demo.classos"))).toBe(false);
      expect(north.some((m) => m.email.includes("@north.classos"))).toBe(true);

      const demoLogin = await loginWithPassword(
        "admin@demo.classos",
        "demo-admin",
      );
      const northLogin = await loginWithPassword(
        "admin@north.classos",
        "demo-admin",
      );
      expect(demoLogin.ok && northLogin.ok).toBe(true);
      if (!demoLogin.ok || !northLogin.ok) return;
      expect(assertSameSchool(demoLogin.context, "school_north").ok).toBe(
        false,
      );
      expect(assertSameSchool(northLogin.context, "school_demo").ok).toBe(
        false,
      );
    } finally {
      await repo.close();
    }
  });
});
