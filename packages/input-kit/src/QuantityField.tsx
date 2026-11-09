"use client";

import {
  assertCompatible,
  formatQuantity,
  quantity,
  type Quantity,
} from "@classos/engines-math";
import { useId, useMemo, useState } from "react";

/** Units-aware value field with dimension check against an expected unit. */
export function QuantityField({
  label,
  value,
  unit,
  expectedUnit,
  min,
  max,
  step = 1,
  onChange,
}: {
  label: string;
  value: number;
  unit: string;
  /** When set, warn if `unit` is dimension-incompatible. */
  expectedUnit?: string;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
}) {
  const id = useId();
  const [draft, setDraft] = useState(String(value));

  const parsed = useMemo(() => {
    try {
      return quantity(value, unit);
    } catch {
      return null;
    }
  }, [value, unit]);

  const compatible = useMemo(() => {
    if (!parsed || !expectedUnit) return true;
    try {
      return assertCompatible(parsed, quantity(1, expectedUnit));
    } catch {
      return false;
    }
  }, [parsed, expectedUnit]);

  return (
    <label
      htmlFor={id}
      style={{
        display: "grid",
        gap: 6,
        fontSize: 13,
      }}
    >
      <span
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 8,
          color: "var(--co-ink-muted)",
        }}
      >
        <span>{label}</span>
        <span style={{ fontFamily: "var(--co-font-mono)" }}>
          {parsed ? formatQuantity(parsed) : "—"}
        </span>
      </span>
      <input
        id={id}
        type="number"
        value={draft}
        min={min}
        max={max}
        step={step}
        aria-invalid={!compatible}
        onChange={(event) => {
          setDraft(event.target.value);
          const next = Number(event.target.value);
          if (!Number.isFinite(next)) return;
          const clamped =
            min !== undefined || max !== undefined
              ? Math.min(max ?? next, Math.max(min ?? next, next))
              : next;
          onChange(clamped);
        }}
        onBlur={() => setDraft(String(value))}
        style={{
          minHeight: "var(--co-hit)",
          borderRadius: 10,
          border: compatible
            ? "1px solid var(--co-border)"
            : "1px solid var(--co-danger)",
          background: "var(--co-bg-elevated)",
          color: "var(--co-ink)",
          padding: "0 12px",
        }}
      />
      {!compatible && (
        <span style={{ color: "var(--co-danger)", fontSize: 12 }}>
          Dimension mismatch — expected unit compatible with {expectedUnit}.
        </span>
      )}
    </label>
  );
}

export type { Quantity };
