/**
 * Phase 0 offline-degrade helper (manifest cache contract).
 * Browser IndexedDB wiring lives in the web app; this module defines the shape.
 */

import type { TopicModule } from "./types";

export interface ManifestCacheEntry {
  id: string;
  module: TopicModule;
  cachedAt: number;
}

export interface OfflineDegradeStatus {
  online: boolean;
  manifestsCached: number;
  explainAvailable: boolean;
  banner: string;
}

export function offlineBanner(online: boolean, manifestsCached: number): string {
  if (online) return "";
  if (manifestsCached > 0) {
    return `Offline — using ${manifestsCached} cached topic manifest(s). Explain is unavailable; on-device engines still run.`;
  }
  return "Offline — open a topic once while online to cache its manifest. Explain is unavailable.";
}

export function buildOfflineStatus(
  online: boolean,
  manifestsCached: number,
): OfflineDegradeStatus {
  return {
    online,
    manifestsCached,
    explainAvailable: online,
    banner: offlineBanner(online, manifestsCached),
  };
}
