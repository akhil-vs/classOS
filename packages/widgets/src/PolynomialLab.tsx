"use client";

import {
  evaluatePolynomial,
  explainPolynomialTemplate,
  factorMonicQuadratic,
  formatFraction,
} from "@classos/engines-math";
import { PointerSlider } from "@classos/input-kit";
import { useMemo, useState } from "react";

export function PolynomialLab({
  onExplain,
}: {
  onExplain?: (payload: unknown) => void;
}) {
  const [a, setA] = useState(1);
  const [b, setB] = useState(-3);
  const [c, setC] = useState(2);
  const [x, setX] = useState(2);

  const evaluation = useMemo(
    () => evaluatePolynomial({ coeffs: [a, b, c] }, x),
    [a, b, c, x],
  );
  const factors = useMemo(() => {
    if (a !== 1) return null;
    return factorMonicQuadratic(b, c);
  }, [a, b, c]);

  return (
    <div style={{ display: "grid", gap: 10 }}>
      <svg viewBox="0 0 280 160" width="100%" height={140} role="img" aria-label="Polynomial graph">
        <rect width="280" height="160" fill="rgba(0,0,0,0.25)" rx="8" />
        <line x1="0" y1="100" x2="280" y2="100" stroke="rgba(214,230,212,0.25)" />
        <line x1="140" y1="0" x2="140" y2="160" stroke="rgba(214,230,212,0.25)" />
        <path
          d={polyPath(a, b, c)}
          fill="none"
          stroke="var(--co-accent)"
          strokeWidth="2.5"
        />
        <circle
          cx={((x + 6) / 12) * 280}
          cy={Math.min(150, Math.max(10, 100 - (a * x * x + b * x + c) * 8))}
          r={5}
          fill="var(--co-warn)"
        />
      </svg>
      <PointerSlider label="a" value={a} min={-3} max={3} step={1} onChange={setA} />
      <PointerSlider label="b" value={b} min={-6} max={6} step={1} onChange={setB} />
      <PointerSlider label="c" value={c} min={-6} max={6} step={1} onChange={setC} />
      <PointerSlider label="Evaluate at x" value={x} min={-4} max={4} step={1} onChange={setX} />
      <div style={{ fontFamily: "var(--co-font-mono)", fontSize: 13 }}>
        p(x) = {a}x² + {b}x + {c}
        <br />
        p({x}) = {formatFraction(evaluation.value)}
        {factors?.factored ? <><br />Factors: {factors.factored}</> : null}
      </div>
      <button
        type="button"
        onClick={() => onExplain?.(explainPolynomialTemplate(evaluation))}
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
  );
}

function polyPath(a: number, b: number, c: number) {
  const points: string[] = [];
  for (let i = 0; i <= 120; i++) {
    const x = -6 + (12 * i) / 120;
    const y = a * x * x + b * x + c;
    points.push(`${((x + 6) / 12) * 280},${Math.min(150, Math.max(10, 100 - y * 8))}`);
  }
  return `M ${points.join(" L ")}`;
}
