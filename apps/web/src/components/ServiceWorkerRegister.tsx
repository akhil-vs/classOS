"use client";

import { useEffect } from "react";

/** Phase 0 — register app-shell service worker when supported. */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Spike only — ignore registration failures in unsupported contexts.
    });
  }, []);
  return null;
}
