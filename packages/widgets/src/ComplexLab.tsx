"use client";

import {
  complexModulus,
  explainComplexTemplate,
  formatComplex,
} from "@classos/engines-math";
import { PointerSlider } from "@classos/input-kit";
import { useMemo, useState } from "react";

export function ComplexLab({
  onExplain,
}: {
  onExplain?: (payload: unknown) => void;
}) {
  const [a, setA] = useState(3);
  const [b, setB] = useState(4);

  const result = useMemo(() => {
    try {
      return complexModulus({ a, b });
    } catch {
      return null;
    }
  }, [a, b]);

  const scale = 18;
  const cx = 140;
  const cy = 90;

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div
        role="note"
        style={{ fontSize: 12, color: "var(--co-warn)", lineHeight: 1.4 }}
      >
        Assumptions: z = a + bi over the reals · |z| = √(a² + b²) · conjugate
        flips Im(z).
      </div>
      <svg
        viewBox="0 0 280 180"
        width="100%"
        height={180}
        role="img"
        aria-label="Argand plane"
      >
        <rect width="280" height="180" fill="rgba(0,0,0,0.25)" rx="8" />
        <line
          x1="20"
          y1={cy}
          x2="260"
          y2={cy}
          stroke="rgba(214,230,212,0.25)"
        />
        <line
          x1={cx}
          y1="20"
          x2={cx}
          y2="160"
          stroke="rgba(214,230,212,0.25)"
        />
        {result && (
          <>
            <line
              x1={cx}
              y1={cy}
              x2={cx + a * scale}
              y2={cy - b * scale}
              stroke="var(--co-accent)"
              strokeWidth="2.5"
            />
            <circle
              cx={cx + a * scale}
              cy={cy - b * scale}
              r="5"
              fill="var(--co-warn)"
            />
            <circle
              cx={cx + a * scale}
              cy={cy + b * scale}
              r="4"
              fill="rgba(198, 242, 109, 0.55)"
            />
          </>
        )}
      </svg>
      <PointerSlider label="a (Re)" value={a} min={-5} max={5} step={1} onChange={setA} />
      <PointerSlider label="b (Im)" value={b} min={-5} max={5} step={1} onChange={setB} />
      {result && (
        <div style={{ fontSize: 13, display: "grid", gap: 4 }}>
          <div style={{ fontFamily: "var(--co-font-mono)" }}>
            z = {formatComplex(result.z)}
          </div>
          <div>|z| = {result.modulus}</div>
          <div>z̄ = {formatComplex(result.conjugate)}</div>
          {!result.numericCheck.ok && (
            <div style={{ color: "var(--co-danger)" }}>
              {result.numericCheck.warning}
            </div>
          )}
          <button
            type="button"
            onClick={() => onExplain?.(explainComplexTemplate(result))}
            style={{
              minHeight: "var(--co-hit)",
              borderRadius: 10,
              border: "1px solid var(--co-accent)",
              background: "rgba(198, 242, 109, 0.12)",
              color: "var(--co-accent)",
              cursor: "pointer",
            }}
          >
            Explain verified steps
          </button>
        </div>
      )}
    </div>
  );
}
