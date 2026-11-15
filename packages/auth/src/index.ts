export { can, rolesForAction } from "./capabilities";
export {
  COOKIE_NAME,
  parseSessionIdFromCookieHeader,
  serializeClearSessionCookie,
  serializeSessionCookie,
} from "./cookies";
export {
  createRepository,
  ensureAuthReady,
  getRepository,
  setRepositoryForTests,
  withFreshMemoryRepository,
} from "./db";
export {
  acceptInvite,
  createSchoolInvite,
  previewInvite,
} from "./invites";
export { MemoryAuthRepository } from "./memory-store";
export { hashPassword, verifyPassword } from "./password";
export { PostgresAuthRepository } from "./postgres";
export type { AuthRepository } from "./repository";
export {
  DEMO_PASSWORDS,
  INVITE_TTL_MS,
  SESSION_TTL_MS,
  seedDemoTenancy,
} from "./seed";
export {
  getSessionContext,
  listDemoAccounts,
  loginWithPassword,
  logoutSession,
  requireCapability,
  toAuthUser,
} from "./session";
export { assertSameSchool } from "./tenancy";
export type {
  AuthAction,
  AuthUser,
  Invite,
  Membership,
  PlatformGrant,
  Role,
  School,
  SchoolMemberView,
  SchoolRole,
  Session,
  SessionContext,
  User,
} from "./types";
