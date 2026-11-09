"use client";

import {
  checkSimilarSides,
  checkTriangleAngleSum,
  segmentDistance,
} from "@classos/engines-math";
import { PointerSlider } from "@classos/input-kit";
import { useMemo, useState } from "react";

export function GeometryLab() {
  const [x2, setX2] = useState(3);
  const [y2, setY2] = useState(4);
  const [A, setA] = useState(60);
  const [B, setB] = useState(60);
  const [C, setC] = useState(60);
  const [scale, setScale] = useState(2);

  const distance = useMemo(
    () => segmentDistance({ x1: 0, y1: 0, x2, y2 }),
    [x2, y2],
  );
  const angles = useMemo(
    () => checkTriangleAngleSum({ A, B, C }),
    [A, B, C],
  );
  const similar = useMemo(
    () => checkSimilarSides([3, 4, 5], [3 * scale, 4 * scale, 5 * scale]),
    [scale],
  );

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <svg viewBox="0 0 280 160" width="100%" height={160} role="img" aria-label="Coordinate segment">
        <rect width="280" height="160" fill="rgba(0,0,0,0.25)" rx="8" />
        <line x1="40" y1="120" x2="240" y2="120" stroke="rgba(214,230,212,0.25)" />
        <line x1="40" y1="120" x2="40" y2="20" stroke="rgba(214,230,212,0.25)" />
        <line
          x1="40"
          y1="120"
          x2={40 + x2 * 18}
          y2={120 - y2 * 18}
          stroke="var(--co-accent)"
          strokeWidth="2.5"
        />
        <circle cx="40" cy="120" r="4" fill="var(--co-chalk)" />
        <circle cx={40 + x2 * 18} cy={120 - y2 * 18} r="4" fill="var(--co-warn)" />
      </svg>
      <PointerSlider label="x₂" value={x2} min={0} max={8} step={1} onChange={setX2} />
      <PointerSlider label="y₂" value={y2} min={0} max={8} step={1} onChange={setY2} />
      <div style={{ fontSize: 13 }}>
        Distance from (0,0): {distance.distance.value} (dimensionless grid units)
      </div>

      <div style={{ borderTop: "1px solid var(--co-border)", paddingTop: 10 }}>
        <div style={{ fontSize: 12, color: "var(--co-ink-muted)", marginBottom: 8 }}>
          Triangle angle sum
        </div>
        <PointerSlider label="A°" value={A} min={1} max={178} step={1} onChange={setA} />
        <PointerSlider label="B°" value={B} min={1} max={178} step={1} onChange={setB} />
        <PointerSlider label="C°" value={C} min={1} max={178} step={1} onChange={setC} />
        <div style={{ fontSize: 13, color: angles.ok ? "var(--co-accent)" : "var(--co-danger)" }}>
          {angles.steps[angles.steps.length - 1]}
        </div>
      </div>

      <div style={{ borderTop: "1px solid var(--co-border)", paddingTop: 10 }}>
        <PointerSlider
          label="Similarity scale (3-4-5)"
          value={scale}
          min={1}
          max={5}
          step={1}
          onChange={setScale}
        />
        <div style={{ fontSize: 13, color: similar.ok ? "var(--co-accent)" : "var(--co-danger)" }}>
          {similar.steps[similar.steps.length - 1]}
        </div>
      </div>
    </div>
  );
}
