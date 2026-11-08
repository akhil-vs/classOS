"use client";

import { useId } from "react";

/** Pointer-agnostic slider with typed field + keyboard arrow support. */
export function PointerSlider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
}) {
  const id = useId();

  return (
    <label
      htmlFor={id}
      style={{
        display: "grid",
        gap: 8,
        minWidth: 0,
      }}
    >
      <span
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          color: "var(--co-ink-muted)",
          fontSize: 13,
        }}
      >
        <span>{label}</span>
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          aria-label={`${label} typed value`}
          onChange={(event) => {
            const next = Number(event.target.value);
            if (Number.isFinite(next)) onChange(clamp(next, min, max));
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowUp") {
              event.preventDefault();
              onChange(clamp(value + step, min, max));
            }
            if (event.key === "ArrowDown") {
              event.preventDefault();
              onChange(clamp(value - step, min, max));
            }
          }}
          style={{
            width: 72,
            minHeight: 36,
            borderRadius: 8,
            border: "1px solid var(--co-border)",
            background: "var(--co-bg-elevated)",
            color: "var(--co-ink)",
            padding: "4px 8px",
          }}
        />
      </span>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        style={{ width: "100%", minHeight: "var(--co-hit)" }}
      />
    </label>
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
