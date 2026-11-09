"use client";

import type { TopicMode } from "@classos/curriculum";

const LABELS: Record<TopicMode, string> = {
  see: "See",
  predict: "Predict",
  build: "Build",
  derive: "Derive",
  solve: "Solve",
  check: "Check",
};

const SHORTCUTS: TopicMode[] = [
  "see",
  "predict",
  "build",
  "derive",
  "solve",
  "check",
];

export function ModeTabs({
  modes,
  value,
  onChange,
}: {
  modes: TopicMode[];
  value: TopicMode;
  onChange: (mode: TopicMode) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Teaching modes"
      className="mode-tabs"
      style={{
        display: "flex",
        gap: 6,
        flexWrap: "wrap",
      }}
    >
      {modes.map((mode, index) => {
        const active = mode === value;
        return (
          <button
            key={mode}
            type="button"
            role="tab"
            aria-selected={active}
            title={`${LABELS[mode]} (shortcut ${index + 1})`}
            onClick={() => onChange(mode)}
            style={{
              minHeight: "var(--co-hit)",
              minWidth: "var(--co-hit)",
              padding: "0 14px",
              borderRadius: 999,
              border: active
                ? "1px solid var(--co-accent)"
                : "1px solid var(--co-border)",
              background: active ? "rgba(198, 242, 109, 0.16)" : "transparent",
              color: active ? "var(--co-accent)" : "var(--co-ink)",
              cursor: "pointer",
            }}
          >
            {LABELS[mode]}
          </button>
        );
      })}
      <style>{`
        @media (max-width: 360px) {
          .mode-tabs button {
            padding: 0 10px !important;
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  );
}

export function modeFromShortcut(key: string): TopicMode | null {
  const n = Number(key);
  if (!Number.isInteger(n) || n < 1 || n > SHORTCUTS.length) return null;
  return SHORTCUTS[n - 1] ?? null;
}
