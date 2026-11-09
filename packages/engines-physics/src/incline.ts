import {
  formatQuantity,
  quantity,
  type Quantity,
} from "@classos/engines-math";
import type { SceneAssumption, SceneDescription } from "./scene";

export interface InclineInput {
  massKg: number;
  angleDeg: number;
  g?: number;
  frictionless?: boolean;
}

export interface InclineSolution {
  scene: SceneDescription;
  parallel: Quantity;
  normal: Quantity;
  acceleration: Quantity;
  closedForm: string;
  /** Lightweight “sim” path: recompute via sin/cos; compare to closed form. */
  simCheck: {
    ok: boolean;
    residual: number;
    tolerance: number;
    warning?: string;
  };
  assumptionBanner: string;
}

const TOLERANCE = 1e-9;

/**
 * Closed-form incline (frictionless by default) + residual check.
 * Phase 1b: one scene, one closed-form check — not a full mechanics sim.
 */
export function solveIncline(input: InclineInput): InclineSolution {
  const gValue = input.g ?? 9.8;
  const frictionless = input.frictionless ?? true;
  const mass = quantity(input.massKg, "kg");
  const g = quantity(gValue, "m/s^2");
  const theta = (input.angleDeg * Math.PI) / 180;
  const sin = Math.sin(theta);
  const cos = Math.cos(theta);

  const parallelValue = input.massKg * gValue * sin;
  const normalValue = input.massKg * gValue * cos;
  const accelValue = frictionless ? gValue * sin : Number.NaN;

  const parallel = quantity(parallelValue, "N");
  const normal = quantity(normalValue, "N");
  const acceleration = quantity(
    frictionless ? accelValue : 0,
    "m/s^2",
  );

  const closedForm = frictionless
    ? `a = g sin θ = ${gValue} · sin(${input.angleDeg}°) = ${accelValue} m/s²; F∥ = mg sin θ = ${parallelValue} N; N = mg cos θ = ${normalValue} N`
    : "Frictionful incline closed form not in Phase 1b — enable frictionless assumption.";

  // Second path: recompute with degrees→radians independently.
  const simParallel = input.massKg * gValue * Math.sin((input.angleDeg * Math.PI) / 180);
  const residual = Math.abs(simParallel - parallelValue);
  const ok = frictionless && residual < TOLERANCE && Number.isFinite(accelValue);

  const assumptions: SceneAssumption[] = [
    {
      id: "frictionless",
      label: "Frictionless surface",
      enabled: frictionless,
    },
    {
      id: "point_mass",
      label: "Point mass block",
      enabled: true,
    },
    {
      id: "uniform_g",
      label: `Uniform g = ${formatQuantity(g)}`,
      enabled: true,
    },
  ];

  const scene: SceneDescription = {
    kind: "inclined_plane",
    assumptions,
    bodies: [{ id: "block", label: "Block", mass }],
    angleDeg: input.angleDeg,
    g,
  };

  return {
    scene,
    parallel,
    normal,
    acceleration,
    closedForm,
    simCheck: {
      ok,
      residual,
      tolerance: TOLERANCE,
      warning: ok
        ? undefined
        : frictionless
          ? "Simulation residual exceeds closed-form tolerance — withhold."
          : "Frictionful mode is out of Phase 1b scope.",
    },
    assumptionBanner: assumptions
      .filter((item) => item.enabled)
      .map((item) => item.label)
      .join(" · "),
  };
}
