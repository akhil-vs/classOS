"use client";

import { PointerSlider } from "@classos/input-kit";
import { useMemo, useState } from "react";

export function InclinedPlane() {
  const [angle, setAngle] = useState(30);
  const rad = (angle * Math.PI) / 180;

  const geometry = useMemo(() => {
    const base = 220;
    const height = Math.tan(rad) * base * 0.45;
    return {
      base,
      height: Math.min(110, Math.max(20, height)),
    };
  }, [rad]);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <svg viewBox="0 0 280 160" width="100%" height={160} role="img" aria-label="Inclined plane">
        <rect width="280" height="160" fill="rgba(0,0,0,0.25)" rx="8" />
        <polygon
          points={`40,140 ${40 + geometry.base * 0.9},140 40,${140 - geometry.height}`}
          fill="rgba(198,242,109,0.12)"
          stroke="var(--co-accent)"
        />
        <rect
          x="70"
          y={140 - geometry.height - 18}
          width="28"
          height="18"
          rx="3"
          fill="var(--co-chalk)"
          transform={`rotate(${-angle} 70 ${140 - geometry.height})`}
        />
        <text x="16" y="24" fill="var(--co-ink-muted)" fontSize="12">
          θ = {angle}°
        </text>
      </svg>
      <PointerSlider
        label="Angle (degrees)"
        value={angle}
        min={5}
        max={60}
        step={1}
        onChange={setAngle}
      />
      <div style={{ color: "var(--co-ink-muted)", fontSize: 13 }}>
        Assumption banner: frictionless surface, point mass block.
      </div>
    </div>
  );
}
