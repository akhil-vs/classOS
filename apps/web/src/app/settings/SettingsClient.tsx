"use client";

import { useEffect, useState, type CSSProperties } from "react";
import {
  DEFAULT_PREFERENCES,
  readPreferences,
  writePreferences,
  type InputPref,
  type LanguagePref,
  type Preferences,
  type TextSizePref,
} from "../../lib/preferences";

export function SettingsClient() {
  const [prefs, setPrefs] = useState<Preferences>(DEFAULT_PREFERENCES);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setPrefs(readPreferences());
  }, []);

  function update<K extends keyof Preferences>(key: K, value: Preferences[K]) {
    const next = { ...prefs, [key]: value };
    setPrefs(next);
    writePreferences(next);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1600);
  }

  return (
    <form
      style={{ display: "grid", gap: 16, marginTop: 24 }}
      onSubmit={(event) => event.preventDefault()}
    >
      <label style={{ display: "grid", gap: 8 }}>
        Language
        <select
          value={prefs.language}
          onChange={(event) =>
            update("language", event.target.value as LanguagePref)
          }
          style={field}
        >
          <option value="en">English</option>
          <option value="hi">Hindi</option>
        </select>
      </label>
      <label style={{ display: "grid", gap: 8 }}>
        Preferred input
        <select
          value={prefs.input}
          onChange={(event) => update("input", event.target.value as InputPref)}
          style={field}
        >
          <option value="auto">Auto (touch + mouse/keyboard)</option>
          <option value="touch">Prefer touch controls</option>
          <option value="keyboard">Prefer keyboard entry</option>
        </select>
      </label>
      <label style={{ display: "grid", gap: 8 }}>
        Text size
        <select
          value={prefs.textSize}
          onChange={(event) =>
            update("textSize", event.target.value as TextSizePref)
          }
          style={field}
        >
          <option value="sm">Small</option>
          <option value="md">Medium</option>
          <option value="lg">Large</option>
        </select>
      </label>
      <p style={{ color: "var(--co-ink-muted)", fontSize: 13, margin: 0 }}>
        Saved on this device only (localStorage). Auth and cloud sync stay
        deferred.
        {saved ? " · Saved." : null}
      </p>
    </form>
  );
}

const field: CSSProperties = {
  minHeight: "var(--co-hit)",
  borderRadius: 10,
  border: "1px solid var(--co-border)",
  background: "var(--co-bg-elevated)",
  color: "var(--co-ink)",
  padding: "0 12px",
};
