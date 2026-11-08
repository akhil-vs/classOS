"use client";

import {
  explainLinearTemplate,
  formatFraction,
  solveLinearSystem,
} from "@classos/engines-math";
import { PointerSlider } from "@classos/input-kit";
import { useMemo, useState, type CSSProperties } from "react";

export function LinearLab({
  onExplain,
}: {
  onExplain?: (payload: unknown) => void;
}) {
  const [a1, setA1] = useState(1);
  const [b1, setB1] = useState(1);
  const [c1, setC1] = useState(5);
  const [a2, setA2] = useState(1);
  const [b2, setB2] = useState(-1);
  const [c2, setC2] = useState(1);

  const solution = useMemo(
    () => solveLinearSystem({ a1, b1, c1, a2, b2, c2 }),
    [a1, b1, c1, a2, b2, c2],
  );

  return (
    <div style={{ display: "grid", gap: 10 }}>
      <svg viewBox="0 0 280 160" width="100%" height={140} role="img" aria-label="Two lines">
        <rect width="280" height="160" fill="rgba(0,0,0,0.25)" rx="8" />
        <line x1="0" y1="80" x2="280" y2="80" stroke="rgba(214,230,212,0.2)" />
        <line x1="140" y1="0" x2="140" y2="160" stroke="rgba(214,230,212,0.2)" />
        <LinePath a={a1} b={b1} c={c1} color="var(--co-accent)" />
        <LinePath a={a2} b={b2} c={c2} color="var(--co-warn)" />
        {solution.nature === "unique" && solution.x && solution.y && (
          <circle
            cx={140 + (solution.x.n / solution.x.d) * 18}
            cy={80 - (solution.y.n / solution.y.d) * 18}
            r={5}
            fill="var(--co-chalk)"
          />
        )}
      </svg>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <PointerSlider label="a₁" value={a1} min={-4} max={4} step={1} onChange={setA1} />
        <PointerSlider label="a₂" value={a2} min={-4} max={4} step={1} onChange={setA2} />
        <PointerSlider label="b₁" value={b1} min={-4} max={4} step={1} onChange={setB1} />
        <PointerSlider label="b₂" value={b2} min={-4} max={4} step={1} onChange={setB2} />
        <PointerSlider label="c₁" value={c1} min={-8} max={8} step={1} onChange={setC1} />
        <PointerSlider label="c₂" value={c2} min={-8} max={8} step={1} onChange={setC2} />
      </div>
      <div style={{ fontFamily: "var(--co-font-mono)", fontSize: 13 }}>
        {a1}x + {b1}y = {c1}
        <br />
        {a2}x + {b2}y = {c2}
      </div>
      <div style={{ fontSize: 13 }}>
        Nature: {solution.nature}
        {solution.x && solution.y
          ? ` · (${formatFraction(solution.x)}, ${formatFraction(solution.y)})`
          : ""}
      </div>
      <button
        type="button"
        onClick={() => onExplain?.(explainLinearTemplate(solution))}
        style={explainBtn}
      >
        Explain verified steps
      </button>
    </div>
  );
}

function LinePath({
  a,
  b,
  c,
  color,
}: {
  a: number;
  b: number;
  c: number;
  color: string;
}) {
  // ax + by = c → sample x from -7..7 in plot coords
  const points: string[] = [];
  for (let i = 0; i <= 40; i++) {
    const x = -7 + (14 * i) / 40;
    if (b === 0) {
      if (a === 0) continue;
      const px = 140 + (c / a) * 18;
      points.push(`${px},0`, `${px},160`);
      break;
    }
    const y = (c - a * x) / b;
    points.push(`${140 + x * 18},${80 - y * 18}`);
  }
  return (
    <polyline
      points={points.join(" ")}
      fill="none"
      stroke={color}
      strokeWidth="2.5"
    />
  );
}

const explainBtn: CSSProperties = {
  minHeight: "var(--co-hit)",
  borderRadius: 10,
  border: "1px solid var(--co-accent)",
  background: "rgba(198, 242, 109, 0.12)",
  color: "var(--co-accent)",
  cursor: "pointer",
};
