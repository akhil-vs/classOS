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

export type OfflineBannerKind = "hidden" | "offline" | "back-online";

export function offlineBanner(
  online: boolean,
  manifestsCached: number,
  kind: OfflineBannerKind = online ? "hidden" : "offline",
): string {
  if (kind === "back-online") {
    return "Back online — Explain is available again. Cached pilot topics stay ready.";
  }
  if (kind === "hidden" || online) return "";
  if (manifestsCached > 0) {
    return `Offline — using ${manifestsCached} cached pilot topic(s). Explain is unavailable; Quadratic and Reactions engines still run on-device.`;
  }
  return "Offline — open a Quadratic or Reactions Learn topic once while online to cache it. Explain is unavailable.";
}

export function buildOfflineStatus(
  online: boolean,
  manifestsCached: number,
  kind: OfflineBannerKind = online ? "hidden" : "offline",
): OfflineDegradeStatus {
  return {
    online,
    manifestsCached,
    explainAvailable: online,
    banner: offlineBanner(online, manifestsCached, kind),
  };
}
