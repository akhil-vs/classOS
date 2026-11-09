"use client";

import {
  formatFraction,
  formatQuadratic,
  natureLabel,
  solveQuadratic,
} from "@classos/engines-math";
import { PointerSlider } from "@classos/input-kit";
import { useMemo, useState } from "react";

export function QuadraticLab({
  onExplain,
}: {
  onExplain?: (payload: unknown) => void;
}) {
  const [a, setA] = useState(1);
  const [b, setB] = useState(-5);
  const [c, setC] = useState(6);

  const solution = useMemo(() => {
    try {
      return solveQuadratic({ a, b, c });
    } catch (error) {
      return null;
    }
  }, [a, b, c]);

  const path = useMemo(() => {
    const points: string[] = [];
    for (let i = 0; i <= 120; i++) {
      const x = -6 + (12 * i) / 120;
      const y = a * x * x + b * x + c;
      const px = ((x + 6) / 12) * 280;
      const py = 100 - y * 8;
      points.push(`${px},${Math.min(150, Math.max(10, py))}`);
    }
    return `M ${points.join(" L ")}`;
  }, [a, b, c]);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div
        role="note"
        style={{
          fontSize: 12,
          color: "var(--co-warn)",
          lineHeight: 1.4,
        }}
      >
        Assumptions: real coefficients · complex roots withheld when D &lt; 0 ·
        a, b, c are dimensionless (not lengths).
      </div>
      <svg viewBox="0 0 280 160" width="100%" height={160} role="img" aria-label="Quadratic graph">
        <rect width="280" height="160" fill="rgba(0,0,0,0.25)" rx="8" />
        <line x1="0" y1="100" x2="280" y2="100" stroke="rgba(214,230,212,0.25)" />
        <line x1="140" y1="0" x2="140" y2="160" stroke="rgba(214,230,212,0.25)" />
        <path d={path} fill="none" stroke="var(--co-accent)" strokeWidth="2.5" />
        {solution?.roots
          .filter((root) => root.numeric !== undefined)
          .map((root, index) => {
            const x = root.numeric!;
            const px = ((x + 6) / 12) * 280;
            return (
              <circle
                key={`${root.latex}-${index}`}
                cx={px}
                cy={100}
                r={5}
                fill="var(--co-warn)"
              />
            );
          })}
      </svg>
      <PointerSlider label="a" value={a} min={-3} max={3} step={1} onChange={setA} />
      <PointerSlider label="b" value={b} min={-8} max={8} step={1} onChange={setB} />
      <PointerSlider label="c" value={c} min={-8} max={8} step={1} onChange={setC} />
      <div style={{ fontFamily: "var(--co-font-mono)", fontSize: 13 }}>
        {formatQuadratic({ a, b, c })}
      </div>
      {solution && (
        <div style={{ display: "grid", gap: 6, fontSize: 13 }}>
          <div>
            D = {formatFraction(solution.discriminant)} ·{" "}
            {natureLabel(solution.nature)}
          </div>
          <div>
            Roots: {solution.roots.map((root) => root.latex).join(", ")}
          </div>
          {!solution.numericCheck.ok && (
            <div style={{ color: "var(--co-danger)" }}>
              {solution.numericCheck.warning}
            </div>
          )}
          <button
            type="button"
            onClick={() => onExplain?.(solution)}
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
