"use client";

import {
  buildOfflineStatus,
  type OfflineBannerKind,
} from "@classos/curriculum";
import { useEffect, useState } from "react";
import { cachedManifestCount } from "../lib/manifestCache";

/**
 * Phase 4 offline banner behaviour:
 * - no flash before hydration
 * - real cached-manifest count from localStorage
 * - dismissible while offline
 * - brief "back online" acknowledgement, then clears
 */
export function OfflineBanner() {
  const [ready, setReady] = useState(false);
  const [online, setOnline] = useState(true);
  const [cached, setCached] = useState(0);
  const [kind, setKind] = useState<OfflineBannerKind>("hidden");
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const sync = () => {
      const nextOnline = navigator.onLine;
      setOnline(nextOnline);
      setCached(cachedManifestCount());
      if (!nextOnline) {
        setDismissed(false);
        setKind("offline");
        return;
      }
      setKind((prev) => (prev === "offline" ? "back-online" : "hidden"));
    };

    setReady(true);
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  useEffect(() => {
    if (kind !== "back-online") return;
    const timer = window.setTimeout(() => setKind("hidden"), 2800);
    return () => window.clearTimeout(timer);
  }, [kind]);

  if (!ready) return null;

  const status = buildOfflineStatus(online, cached, kind);
  if (!status.banner || dismissed) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        padding: "10px 16px",
        display: "flex",
        gap: 12,
        alignItems: "center",
        justifyContent: "space-between",
        background:
          kind === "back-online"
            ? "rgba(198, 242, 109, 0.14)"
            : "rgba(240, 180, 41, 0.16)",
        borderBottom:
          kind === "back-online"
            ? "1px solid rgba(198, 242, 109, 0.35)"
            : "1px solid rgba(240, 180, 41, 0.35)",
        color: kind === "back-online" ? "var(--co-accent)" : "var(--co-warn)",
        fontSize: 13,
      }}
    >
      <span style={{ lineHeight: 1.4 }}>{status.banner}</span>
      {kind === "offline" && (
        <button
          type="button"
          aria-label="Dismiss offline banner"
          onClick={() => setDismissed(true)}
          style={{
            minHeight: 36,
            minWidth: 36,
            borderRadius: 8,
            border: "1px solid rgba(240, 180, 41, 0.45)",
            background: "transparent",
            color: "inherit",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          ×
        </button>
      )}
    </div>
  );
}
