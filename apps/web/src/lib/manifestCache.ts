"use client";

import type { ManifestCacheEntry, TopicModule } from "@classos/curriculum";

const KEY = "classos.manifests.v1";

function readAll(): ManifestCacheEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ManifestCacheEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(entries: ManifestCacheEntry[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(entries));
}

/** Cache a topic manifest after a successful online Learn visit (Phase 4 pilot). */
export function cacheTopicManifest(module: TopicModule): void {
  const entries = readAll().filter((entry) => entry.id !== module.id);
  entries.push({
    id: module.id,
    module,
    cachedAt: Date.now(),
  });
  writeAll(entries);
}

export function listCachedManifests(): ManifestCacheEntry[] {
  return readAll();
}

export function cachedManifestCount(): number {
  return readAll().length;
}
