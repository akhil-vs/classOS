import { MemoryAuthRepository } from "./memory-store";
import { PostgresAuthRepository } from "./postgres";
import type { AuthRepository } from "./repository";
import { seedDemoTenancy } from "./seed";

let repository: AuthRepository | null = null;
let seedPromise: Promise<void> | null = null;

export function createRepository(
  databaseUrl = process.env.DATABASE_URL,
): AuthRepository {
  if (databaseUrl) {
    return new PostgresAuthRepository(databaseUrl);
  }
  return new MemoryAuthRepository();
}

/** Process singleton — Postgres when DATABASE_URL is set, else memory. */
export function getRepository(): AuthRepository {
  if (!repository) {
    repository = createRepository();
  }
  return repository;
}

export async function ensureAuthReady(): Promise<AuthRepository> {
  const repo = getRepository();
  await repo.ensureReady();
  if (!seedPromise) {
    seedPromise = seedDemoTenancy(repo).then(() => undefined);
  }
  await seedPromise;
  return repo;
}

/** Test helper — swap repository and clear seed cache. */
export function setRepositoryForTests(next: AuthRepository | null) {
  repository = next;
  seedPromise = null;
}

export async function withFreshMemoryRepository(
  run: (repo: MemoryAuthRepository) => Promise<void>,
) {
  const previous = repository;
  const previousSeed = seedPromise;
  const memory = new MemoryAuthRepository();
  repository = memory;
  seedPromise = seedDemoTenancy(memory).then(() => undefined);
  try {
    await seedPromise;
    await run(memory);
  } finally {
    repository = previous;
    seedPromise = previousSeed;
  }
}
