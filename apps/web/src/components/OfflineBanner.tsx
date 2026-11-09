"use client";

import { buildOfflineStatus } from "@classos/curriculum";
import { useEffect, useState } from "react";

export function OfflineBanner() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const sync = () => setOnline(navigator.onLine);
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);

  const status = buildOfflineStatus(online, 0);
  if (!status.banner) return null;

  return (
    <div
      role="status"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        padding: "10px 16px",
        background: "rgba(240, 180, 41, 0.16)",
        borderBottom: "1px solid rgba(240, 180, 41, 0.35)",
        color: "var(--co-warn)",
        fontSize: 13,
      }}
    >
      {status.banner}
    </div>
  );
}
