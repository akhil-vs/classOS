"use client";

import { useBoardStore } from "./store";

export function ChipLayer() {
  const chips = useBoardStore((s) => s.chips);
  const aiEnabled = useBoardStore((s) => s.aiEnabled);
  const confirmChip = useBoardStore((s) => s.confirmChip);
  const dismissChip = useBoardStore((s) => s.dismissChip);

  if (!aiEnabled || chips.length === 0) return null;

  return (
    <div
      aria-live="polite"
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      {chips.map((chip) => (
        <div
          key={chip.id}
          style={{
            position: "absolute",
            left: Math.min(chip.x, 240),
            top: Math.max(12, chip.y - 48),
            pointerEvents: "auto",
            display: "flex",
            gap: 6,
            alignItems: "center",
          }}
        >
          <button
            type="button"
            onClick={() => confirmChip(chip.id)}
            style={{
              minHeight: "var(--co-hit)",
              padding: "0 14px",
              borderRadius: 999,
              border: "1px solid var(--co-accent)",
              background: "rgba(198, 242, 109, 0.14)",
              color: "var(--co-accent)",
              cursor: "pointer",
              boxShadow: "var(--co-shadow)",
            }}
          >
            {chip.label}
          </button>
          <button
            type="button"
            aria-label={`Dismiss ${chip.label}`}
            onClick={() => dismissChip(chip.id)}
            style={{
              minHeight: "var(--co-hit)",
              minWidth: "var(--co-hit)",
              borderRadius: 999,
              border: "1px solid var(--co-border)",
              background: "var(--co-panel)",
              color: "var(--co-ink-muted)",
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
