/** Embedded so Next.js / vitest do not need to ship schema.sql as an asset. */
export const AUTH_SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS schools (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  locale TEXT NOT NULL DEFAULT 'en-IN',
  guest_join_policy TEXT NOT NULL DEFAULT 'off'
    CHECK (guest_join_policy IN ('off', 'teacher_issued'))
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'disabled'))
);

CREATE TABLE IF NOT EXISTS memberships (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  school_id TEXT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  role TEXT NOT NULL
    CHECK (role IN ('student', 'teacher', 'school_admin'))
);

CREATE TABLE IF NOT EXISTS platform_grants (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role = 'platform_author')
);

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at BIGINT NOT NULL,
  expires_at BIGINT NOT NULL
);

CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON sessions(user_id);
CREATE INDEX IF NOT EXISTS sessions_expires_at_idx ON sessions(expires_at);

CREATE TABLE IF NOT EXISTS invites (
  id TEXT PRIMARY KEY,
  school_id TEXT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL
    CHECK (role IN ('student', 'teacher', 'school_admin')),
  token_hash TEXT NOT NULL UNIQUE,
  invited_by_user_id TEXT NOT NULL REFERENCES users(id),
  created_at BIGINT NOT NULL,
  expires_at BIGINT NOT NULL,
  accepted_at BIGINT
);

CREATE INDEX IF NOT EXISTS invites_school_id_idx ON invites(school_id);
`;
