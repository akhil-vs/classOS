import { beforeEach, describe, expect, it } from "vitest";
import { can } from "./capabilities";
import { hashPassword, verifyPassword } from "./password";
import {
  getSessionContext,
  loginWithPassword,
  logoutSession,
  requireCapability,
} from "./session";
import { authStore } from "./store";

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
    expect(can("student", "teacher_equivalence")).toBe(false);
  });

  it("restricts author and school admin surfaces", () => {
    expect(can("platform_author", "author")).toBe(true);
    expect(can("teacher", "author")).toBe(false);
    expect(can("school_admin", "school_admin")).toBe(true);
    expect(can("student", "school_view")).toBe(false);
  });
});

describe("login and sessions", () => {
  beforeEach(() => {
    authStore.reset();
    authStore.seedDemo();
  });

  it("logs in demo teacher and requires capability", () => {
    const result = loginWithPassword("teacher@demo.classos", "demo-teacher");
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.context.user.role).toBe("teacher");
    expect(result.context.user.schoolId).toBe("school_demo");

    const allowed = requireCapability(result.context, "class_live");
    expect(allowed.ok).toBe(true);

    const denied = requireCapability(result.context, "author");
    expect(denied.ok).toBe(false);
    if (!denied.ok) expect(denied.status).toBe(403);
  });

  it("rejects bad passwords and students hitting teacher APIs", () => {
    expect(loginWithPassword("teacher@demo.classos", "nope").ok).toBe(false);
    const student = loginWithPassword("asha@demo.classos", "demo-student");
    expect(student.ok).toBe(true);
    if (!student.ok) return;
    const denied = requireCapability(student.context, "teacher_equivalence");
    expect(denied.ok).toBe(false);
    if (!denied.ok) expect(denied.status).toBe(403);
  });

  it("resolves and clears sessions", () => {
    const result = loginWithPassword("admin@demo.classos", "demo-admin");
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(getSessionContext(result.context.sessionId)?.user.role).toBe(
      "school_admin",
    );
    logoutSession(result.context.sessionId);
    expect(getSessionContext(result.context.sessionId)).toBeNull();
  });
});
