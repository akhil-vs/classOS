"use client";

import { labelForIntent, type ChipIntent } from "./recognise";
import { useBoardStore } from "./store";

export function ChipLayer() {
  const chips = useBoardStore((s) => s.chips);
  const aiEnabled = useBoardStore((s) => s.aiEnabled);
  const confirmChip = useBoardStore((s) => s.confirmChip);
  const dismissChip = useBoardStore((s) => s.dismissChip);
  const correctChip = useBoardStore((s) => s.correctChip);
  const cycleChip = useBoardStore((s) => s.cycleChip);

  if (!aiEnabled || chips.length === 0) return null;

  return (
    <div
      aria-live="polite"
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      {chips.map((chip) => {
        const alternatives = (chip.alternatives ?? []) as ChipIntent[];
        const canCorrect = alternatives.length > 0 || chip.needsPick;
        return (
          <div
            key={chip.id}
            style={{
              position: "absolute",
              left: Math.min(chip.x, 200),
              top: Math.max(12, chip.y - 56),
              pointerEvents: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 6,
              maxWidth: "min(320px, calc(100% - 24px))",
            }}
          >
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <button
                type="button"
                onClick={() => confirmChip(chip.id)}
                title={
                  chip.needsPick
                    ? "Pick the right type below, then confirm"
                    : "Confirm and open widget"
                }
                style={{
                  minHeight: "var(--co-hit)",
                  padding: "0 14px",
                  borderRadius: 999,
                  border: chip.needsPick
                    ? "1px solid var(--co-warn)"
                    : "1px solid var(--co-accent)",
                  background: chip.needsPick
                    ? "rgba(240, 180, 41, 0.14)"
                    : "rgba(198, 242, 109, 0.14)",
                  color: chip.needsPick ? "var(--co-warn)" : "var(--co-accent)",
                  cursor: "pointer",
                  boxShadow: "var(--co-shadow)",
                  fontWeight: 600,
                }}
              >
                {chip.needsPick ? chip.label : `Open: ${chip.label.replace(/\?$/, "")}`}
              </button>
              {canCorrect && alternatives.length > 0 && (
                <button
                  type="button"
                  aria-label="Try next recognition guess"
                  title="Wrong chip — cycle to next guess"
                  onClick={() => cycleChip(chip.id)}
                  style={{
                    minHeight: "var(--co-hit)",
                    padding: "0 12px",
                    borderRadius: 999,
                    border: "1px solid var(--co-border)",
                    background: "var(--co-panel)",
                    color: "var(--co-ink)",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  Wrong?
                </button>
              )}
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
            {(chip.needsPick || alternatives.length > 0) && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 6,
                  padding: 4,
                }}
              >
                {([chip.intent, ...alternatives] as ChipIntent[])
                  .filter((intent, index, all) => all.indexOf(intent) === index)
                  .map((intent) => {
                    const active = intent === chip.intent && !chip.needsPick;
                    return (
                      <button
                        key={`${chip.id}-${intent}`}
                        type="button"
                        aria-pressed={active}
                        onClick={() => correctChip(chip.id, intent)}
                        style={{
                          minHeight: 36,
                          padding: "0 10px",
                          borderRadius: 999,
                          border: active
                            ? "1px solid var(--co-accent)"
                            : "1px solid var(--co-border)",
                          background: active
                            ? "rgba(198, 242, 109, 0.2)"
                            : "rgba(28, 37, 48, 0.92)",
                          color: active ? "var(--co-accent)" : "var(--co-ink)",
                          cursor: "pointer",
                          fontSize: 13,
                        }}
                      >
                        {labelForIntent(intent).replace(/\?$/, "")}
                      </button>
                    );
                  })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
