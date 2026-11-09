import { quantity, type Quantity } from "./units";

export interface Segment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface DistanceResult {
  distance: Quantity;
  steps: string[];
  numericCheck: { ok: boolean; residual: number };
}

/** Coordinate-geometry distance formula (Class 10 thin slice). */
export function segmentDistance(segment: Segment): DistanceResult {
  const dx = segment.x2 - segment.x1;
  const dy = segment.y2 - segment.y1;
  const value = Math.hypot(dx, dy);
  const steps = [
    `Δx = ${segment.x2} − ${segment.x1} = ${dx}`,
    `Δy = ${segment.y2} − ${segment.y1} = ${dy}`,
    `d = √(Δx² + Δy²) = ${value}`,
  ];
  const recomputed = Math.sqrt(dx * dx + dy * dy);
  const residual = Math.abs(recomputed - value);
  return {
    distance: quantity(value, "1"),
    steps,
    numericCheck: { ok: residual < 1e-12, residual },
  };
}

export interface TriangleAngles {
  A: number;
  B: number;
  C: number;
}

export interface AngleSumCheck {
  ok: boolean;
  sum: number;
  steps: string[];
  warning?: string;
}

/** Euclid / lines-and-angles thin check: interior angles sum to 180°. */
export function checkTriangleAngleSum(angles: TriangleAngles): AngleSumCheck {
  const sum = angles.A + angles.B + angles.C;
  const ok = Math.abs(sum - 180) < 1e-6;
  return {
    ok,
    sum,
    steps: [
      `A + B + C = ${angles.A} + ${angles.B} + ${angles.C} = ${sum}°`,
      ok
        ? "Sum is 180° — triangle angle sum holds."
        : "Sum is not 180° — not a Euclidean triangle (or measurement error).",
    ],
    warning: ok ? undefined : "Angle sum check failed.",
  };
}

export interface SimilarityRatio {
  ok: boolean;
  ratio?: number;
  steps: string[];
  warning?: string;
}

/** Side-proportional similarity check for two triangles (AAA consequence). */
export function checkSimilarSides(
  sidesA: [number, number, number],
  sidesB: [number, number, number],
): SimilarityRatio {
  const sortedA = [...sidesA].sort((a, b) => a - b);
  const sortedB = [...sidesB].sort((a, b) => a - b);
  if (sortedA.some((s) => s <= 0) || sortedB.some((s) => s <= 0)) {
    return {
      ok: false,
      steps: ["Side lengths must be positive."],
      warning: "Invalid side lengths.",
    };
  }
  const ratios = sortedA.map((side, i) => side / sortedB[i]!);
  const mean = ratios.reduce((a, b) => a + b, 0) / ratios.length;
  const spread = Math.max(...ratios.map((r) => Math.abs(r - mean)));
  const ok = spread < 1e-6;
  return {
    ok,
    ratio: mean,
    steps: [
      `Sorted sides A: ${sortedA.join(", ")}`,
      `Sorted sides B: ${sortedB.join(", ")}`,
      `Ratios: ${ratios.map((r) => r.toFixed(4)).join(", ")}`,
      ok
        ? `Constant ratio ≈ ${mean} ⇒ sides are proportional.`
        : "Ratios disagree — not similar by SSS similarity.",
    ],
    warning: ok ? undefined : "Side ratios are not constant.",
  };
}
