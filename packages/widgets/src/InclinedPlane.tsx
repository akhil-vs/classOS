"use client";

import { formatQuantity } from "@classos/engines-math";
import { solveIncline } from "@classos/engines-physics";
import { PointerSlider, QuantityField } from "@classos/input-kit";
import { useBoardStore } from "@classos/board-core";
import { useEffect, useMemo, useState } from "react";

export function InclinedPlane() {
  const [angle, setAngle] = useState(30);
  const [massKg, setMassKg] = useState(2);
  const [frictionless, setFrictionless] = useState(true);
  const setAssumptionBanner = useBoardStore((s) => s.setAssumptionBanner);

  const solution = useMemo(
    () =>
      solveIncline({
        massKg,
        angleDeg: angle,
        g: 9.8,
        frictionless,
      }),
    [angle, massKg, frictionless],
  );

  useEffect(() => {
    setAssumptionBanner(solution.assumptionBanner);
    return () => setAssumptionBanner(undefined);
  }, [solution.assumptionBanner, setAssumptionBanner]);

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
          θ = {angle}° · m = {formatQuantity(solution.scene.bodies[0]!.mass)}
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
      <QuantityField
        label="Mass"
        value={massKg}
        unit="kg"
        expectedUnit="kg"
        min={0.5}
        max={10}
        step={0.5}
        onChange={setMassKg}
      />
      <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13 }}>
        <input
          type="checkbox"
          checked={frictionless}
          onChange={(event) => setFrictionless(event.target.checked)}
        />
        Frictionless (Phase 1b closed-form)
      </label>
      <div style={{ fontSize: 13, display: "grid", gap: 4 }}>
        <div>F∥ = {formatQuantity(solution.parallel)}</div>
        <div>N = {formatQuantity(solution.normal)}</div>
        <div>a = {formatQuantity(solution.acceleration)}</div>
        <div style={{ color: "var(--co-ink-muted)", fontFamily: "var(--co-font-mono)" }}>
          {solution.closedForm}
        </div>
        {!solution.simCheck.ok && (
          <div style={{ color: "var(--co-danger)" }}>
            {solution.simCheck.warning}
          </div>
        )}
        {solution.simCheck.ok && (
          <div style={{ color: "var(--co-accent)" }}>
            Closed-form check OK (residual {solution.simCheck.residual})
          </div>
        )}
      </div>
    </div>
  );
}
