"use client";

import { useEffect } from "react";
import { applyPreferences, readPreferences } from "../lib/preferences";

/** Applies locally persisted language / input / text-size prefs on load. */
export function PreferencesBootstrap() {
  useEffect(() => {
    applyPreferences(readPreferences());
  }, []);
  return null;
}
