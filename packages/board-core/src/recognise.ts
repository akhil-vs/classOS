import type { Point, Stroke, SuggestionChip } from "./types";

export type ChipIntent = SuggestionChip["intent"];

/** Phase 4 learner pilot: only shipped Quadratic + Reactions intents by default. */
export const PILOT_CHIP_INTENTS: ChipIntent[] = ["quadratic", "balancer"];

const MAX_PENDING_CHIPS = 1;
/** Minimum score to auto-suggest a specific intent. */
const AUTO_SCORE = 0.68;
/** Best must beat runner-up by this margin, else treat as ambiguous. */
const SCORE_MARGIN = 0.1;
/** Spatial pad when clustering nearby strokes into one ink group. */
const CLUSTER_PAD = 72;
/** Max recent strokes considered with the just-finished stroke. */
const CLUSTER_LOOKBACK = 10;

const INTENT_LABELS: Record<ChipIntent, string> = {
  quadratic: "Quadratic ax²+bx+c=0?",
  balancer: "Balance reaction?",
  linear: "Linear ax+b=c?",
  geometry: "Geometry figure?",
  graph: "Open graph?",
  scene: "Inclined plane?",
  molecule: "Molecule view?",
};

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Topic-scoped allowlist. Ambiguous freeform strokes must not spam unused
 * template chips (graph / scene / molecule / linear / geometry).
 */
export function allowedIntentsForTopic(topicId?: string): ChipIntent[] {
  if (!topicId) return [...PILOT_CHIP_INTENTS];
  if (topicId.includes("quadratic")) return ["quadratic"];
  if (topicId.includes("chemical-reactions") || topicId.includes("reactions")) {
    return ["balancer"];
  }
  if (topicId.includes("linear")) return ["linear"];
  if (topicId.includes("geometry") || topicId.includes("triangles")) {
    return ["geometry"];
  }
  if (topicId.includes("inclined") || topicId.includes("scene")) return ["scene"];
  if (topicId.includes("molecule")) return ["molecule"];
  return [...PILOT_CHIP_INTENTS];
}

export function labelForIntent(intent: ChipIntent): string {
  return INTENT_LABELS[intent];
}

export function strokeBounds(stroke: Stroke) {
  const xs = stroke.points.map((p) => p.x);
  const ys = stroke.points.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const width = Math.max(0, maxX - minX);
  const height = Math.max(0, maxY - minY);
  return { minX, maxX, minY, maxY, width, height };
}

export function clusterBounds(strokes: Stroke[]) {
  const boxes = strokes.map(strokeBounds);
  const minX = Math.min(...boxes.map((b) => b.minX));
  const maxX = Math.max(...boxes.map((b) => b.maxX));
  const minY = Math.min(...boxes.map((b) => b.minY));
  const maxY = Math.max(...boxes.map((b) => b.maxY));
  return {
    minX,
    maxX,
    minY,
    maxY,
    width: Math.max(0, maxX - minX),
    height: Math.max(0, maxY - minY),
  };
}

function boxesNear(
  a: ReturnType<typeof strokeBounds>,
  b: ReturnType<typeof strokeBounds>,
  pad: number,
): boolean {
  return !(
    a.maxX + pad < b.minX ||
    b.maxX + pad < a.minX ||
    a.maxY + pad < b.minY ||
    b.maxY + pad < a.minY
  );
}

/**
 * Group the finished stroke with nearby recent ink so multi-glyph equations
 * (x², +, arrow) are scored as one writing block.
 */
export function clusterNearbyStrokes(
  allStrokes: Stroke[],
  focusId: string,
  pad = CLUSTER_PAD,
  lookback = CLUSTER_LOOKBACK,
): Stroke[] {
  const focus = allStrokes.find((stroke) => stroke.id === focusId);
  if (!focus) return [];
  const recent = allStrokes.slice(-lookback);
  const included = new Set<string>([focus.id]);
  let changed = true;
  while (changed) {
    changed = false;
    const union = clusterBounds(
      recent.filter((stroke) => included.has(stroke.id)),
    );
    for (const stroke of recent) {
      if (included.has(stroke.id)) continue;
      if (boxesNear(union, strokeBounds(stroke), pad)) {
        included.add(stroke.id);
        changed = true;
      }
    }
  }
  return recent.filter((stroke) => included.has(stroke.id));
}

export interface InkFeatures {
  width: number;
  height: number;
  aspect: number;
  pathLength: number;
  strokeCount: number;
  pointCount: number;
  /** Mean absolute second derivative of heading — high for curves, low for lines. */
  meanCurvature: number;
  /** Fraction of samples whose local heading is near-horizontal. */
  horizontalFraction: number;
  /** Sharp reverse / corner count — arrows and plus-like joins. */
  sharpTurns: number;
  /** Vertical span of local y extrema (multi-hump marks). */
  extremaSpread: number;
  /** End-to-middle vertical drop — high for a single U/bowl. */
  valleyDepth: number;
  compactness: number;
}

function polylineLength(points: Point[]): number {
  let length = 0;
  for (let i = 1; i < points.length; i++) {
    length += Math.hypot(
      points[i]!.x - points[i - 1]!.x,
      points[i]!.y - points[i - 1]!.y,
    );
  }
  return length;
}

function heading(a: Point, b: Point): number {
  return Math.atan2(b.y - a.y, b.x - a.x);
}

function angleDelta(a: number, b: number): number {
  let d = b - a;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  return d;
}

export function analyseInk(strokes: Stroke[]): InkFeatures | null {
  if (strokes.length === 0) return null;
  const points = strokes.flatMap((stroke) => stroke.points);
  if (points.length < 8) return null;

  const { width, height } = clusterBounds(strokes);
  if (width < 40 && height < 40) return null;

  const pathLength = strokes.reduce(
    (sum, stroke) => sum + polylineLength(stroke.points),
    0,
  );
  if (pathLength < 36) return null;

  let curveAcc = 0;
  let curveSamples = 0;
  let horizontalHits = 0;
  let headingSamples = 0;
  let sharpTurns = 0;
  const localExtremaY: number[] = [];

  for (const stroke of strokes) {
    const pts = stroke.points;
    if (pts.length < 3) continue;
    for (let i = 1; i < pts.length - 1; i++) {
      const h0 = heading(pts[i - 1]!, pts[i]!);
      const h1 = heading(pts[i]!, pts[i + 1]!);
      const d = angleDelta(h0, h1);
      const step = Math.hypot(
        pts[i + 1]!.x - pts[i]!.x,
        pts[i + 1]!.y - pts[i]!.y,
      );
      if (step < 1.5) continue;
      curveAcc += Math.abs(d);
      curveSamples += 1;
      headingSamples += 1;
      const absH = Math.abs(h1);
      if (absH < 0.35 || absH > Math.PI - 0.35) horizontalHits += 1;
      if (Math.abs(d) > 0.9) sharpTurns += 1;

      const yPrev = pts[i - 1]!.y;
      const y = pts[i]!.y;
      const yNext = pts[i + 1]!.y;
      if ((y <= yPrev && y <= yNext) || (y >= yPrev && y >= yNext)) {
        localExtremaY.push(y);
      }
    }
  }

  const meanCurvature = curveSamples === 0 ? 0 : curveAcc / curveSamples;
  const horizontalFraction =
    headingSamples === 0 ? 0 : horizontalHits / headingSamples;
  const extremaSpread =
    localExtremaY.length < 2
      ? 0
      : Math.max(...localExtremaY) - Math.min(...localExtremaY);

  // Single-bowl depth: average of endpoints vs lowest point (U shape).
  const first = points[0]!;
  const last = points[points.length - 1]!;
  const minY = Math.min(...points.map((p) => p.y));
  const endAvgY = (first.y + last.y) / 2;
  const valleyDepth = Math.max(0, endAvgY - minY);

  const area = Math.max(width * height, 1);
  const compactness = pathLength / Math.sqrt(area);

  return {
    width,
    height,
    aspect: height / Math.max(width, 1),
    pathLength,
    strokeCount: strokes.length,
    pointCount: points.length,
    meanCurvature,
    horizontalFraction,
    sharpTurns,
    extremaSpread,
    valleyDepth,
    compactness,
  };
}

interface ScoredIntent {
  intent: ChipIntent;
  label: string;
  score: number;
}

function scoreIntents(features: InkFeatures): ScoredIntent[] {
  const {
    width,
    height,
    aspect,
    meanCurvature,
    horizontalFraction,
    sharpTurns,
    extremaSpread,
    valleyDepth,
    strokeCount,
    compactness,
  } = features;

  const scores: ScoredIntent[] = [];
  const bowl =
    width >= 100 &&
    aspect > 0.18 &&
    aspect < 0.85 &&
    (valleyDepth >= 14 || (meanCurvature >= 0.1 && extremaSpread >= 16));

  // Quadratic: wide writing line or a clear U/bowl curve (not a tall chem stack).
  let quadratic = 0;
  if (width >= 90 && height >= 28 && aspect > 0.18 && aspect < 0.85) {
    quadratic += height <= 140 ? 0.42 : 0.28;
  }
  if (bowl) {
    quadratic += 0.36;
  }
  if (horizontalFraction >= 0.3 && width >= 110 && aspect < 0.8) {
    quadratic += 0.16;
  }
  if (strokeCount >= 2 && width >= 100 && aspect < 0.75) {
    quadratic += 0.12;
  }
  if (aspect >= 1.15) quadratic -= 0.4;
  if (quadratic > 0) {
    scores.push({
      intent: "quadratic",
      label: INTENT_LABELS.quadratic,
      score: Math.min(0.95, quadratic),
    });
  }

  // Linear: long, flat, low curvature.
  let linear = 0;
  if (width >= 100 && height > 0 && height <= 36 && aspect <= 0.28) {
    linear += 0.5;
  }
  if (meanCurvature <= 0.18 && horizontalFraction >= 0.55) {
    linear += 0.28;
  }
  if (strokeCount === 1 && height <= 28) linear += 0.1;
  if (linear > 0) {
    scores.push({
      intent: "linear",
      label: INTENT_LABELS.linear,
      score: Math.min(0.92, linear),
    });
  }

  // Balancer: compact/tall glyph clusters, arrow-like sharp turns, multi-stroke chem.
  let balancer = 0;
  if (width >= 48 && height >= 48 && width <= 180) {
    balancer += 0.18;
  }
  if (aspect >= 0.85 || (width <= 140 && height >= 70 && aspect >= 0.55)) {
    balancer += 0.3;
  }
  if (sharpTurns >= 2 || (sharpTurns >= 1 && strokeCount >= 2)) {
    balancer += 0.26;
  }
  if (strokeCount >= 3 && width >= 70) {
    balancer += 0.2;
  }
  if (compactness >= 2.4 && width <= 160) {
    balancer += 0.12;
  }
  // Wide bowls / equation lines are not chem reaction stacks.
  if (
    bowl ||
    (width >= 120 &&
      aspect < 0.7 &&
      (valleyDepth >= 14 || (extremaSpread >= 20 && meanCurvature >= 0.12)))
  ) {
    balancer -= 0.55;
  }
  if (balancer > 0) {
    scores.push({
      intent: "balancer",
      label: INTENT_LABELS.balancer,
      score: Math.min(0.94, balancer),
    });
  }

  // Geometry: near-square closed-ish marks with several turns.
  let geometry = 0;
  if (width >= 60 && height >= 60 && aspect > 0.65 && aspect < 1.45) {
    geometry += 0.3;
  }
  if (sharpTurns >= 3 && meanCurvature >= 0.2) geometry += 0.28;
  if (compactness >= 2.8) geometry += 0.12;
  if (geometry > 0) {
    scores.push({
      intent: "geometry",
      label: INTENT_LABELS.geometry,
      score: Math.min(0.88, geometry),
    });
  }

  return scores.sort((a, b) => b.score - a.score);
}

function chipFromRanked(
  ranked: ScoredIntent[],
  allowed: ChipIntent[],
  anchor: Point,
  strokeIds: string[],
): SuggestionChip | null {
  const filtered = ranked.filter((item) => allowed.includes(item.intent));
  if (filtered.length === 0) return null;

  const best = filtered[0]!;
  const second = filtered[1];
  const clearSingleton = filtered.length === 1 && best.score >= 0.55;
  const ambiguous =
    !clearSingleton &&
    (best.score < AUTO_SCORE ||
      (second !== undefined && best.score - second.score < SCORE_MARGIN));

  // Substantial ink but unclear intent → ask the learner to set the chip.
  if (ambiguous) {
    if (allowed.length === 1) {
      const only = allowed[0]!;
      return {
        id: uid("chip"),
        label: labelForIntent(only),
        intent: only,
        x: anchor.x,
        y: anchor.y,
        confidence: best.intent === only ? best.score : 0.5,
        alternatives: [],
        needsPick: best.intent !== only || best.score < AUTO_SCORE,
        sourceStrokeIds: strokeIds,
      };
    }
    return {
      id: uid("chip"),
      label: "What did you write?",
      intent: best.intent,
      x: anchor.x,
      y: anchor.y,
      confidence: best.score,
      alternatives: allowed.filter((intent) => intent !== best.intent),
      needsPick: true,
      sourceStrokeIds: strokeIds,
    };
  }

  return {
    id: uid("chip"),
    label: best.label,
    intent: best.intent,
    x: anchor.x,
    y: anchor.y,
    confidence: best.score,
    alternatives: allowed.filter((intent) => intent !== best.intent),
    needsPick: false,
    sourceStrokeIds: strokeIds,
  };
}

/**
 * Conservative ink heuristics for the learner pilot.
 * Returns null when the stroke is too small — never invents a fallback chip.
 */
export function recogniseFromStroke(
  stroke: Stroke,
  allowed: ChipIntent[] = PILOT_CHIP_INTENTS,
): SuggestionChip | null {
  return recogniseFromStrokes([stroke], allowed);
}

/** Score a stroke cluster (preferred entry point after each pen-up). */
export function recogniseFromStrokes(
  strokes: Stroke[],
  allowed: ChipIntent[] = PILOT_CHIP_INTENTS,
): SuggestionChip | null {
  const features = analyseInk(strokes);
  if (!features) return null;
  if (features.pointCount < 10 && features.strokeCount === 1) return null;

  const last = strokes[strokes.length - 1]!;
  const lastPoint = last.points[last.points.length - 1]!;
  const ranked = scoreIntents(features);
  return chipFromRanked(
    ranked,
    allowed,
    lastPoint,
    strokes.map((stroke) => stroke.id),
  );
}

/** Keep at most one pending chip; replace same-intent suggestions. */
export function mergePendingChips(
  existing: SuggestionChip[],
  next: SuggestionChip | null,
): SuggestionChip[] {
  if (!next) return existing;
  const withoutOverlap = existing.filter((chip) => {
    if (chip.intent === next.intent) return false;
    const a = new Set(chip.sourceStrokeIds ?? []);
    const b = next.sourceStrokeIds ?? [];
    return !b.some((id) => a.has(id));
  });
  return [...withoutOverlap, next].slice(-MAX_PENDING_CHIPS);
}

/** One-tap correction: set the chip to a different allowed intent. */
export function correctChipIntent(
  chip: SuggestionChip,
  intent: ChipIntent,
  allowed: ChipIntent[] = PILOT_CHIP_INTENTS,
): SuggestionChip | null {
  if (!allowed.includes(intent)) return null;
  return {
    ...chip,
    id: uid("chip"),
    intent,
    label: labelForIntent(intent),
    confidence: 1,
    needsPick: false,
    alternatives: allowed.filter((item) => item !== intent),
  };
}

export function cycleChipIntent(
  chip: SuggestionChip,
  allowed: ChipIntent[] = PILOT_CHIP_INTENTS,
): SuggestionChip | null {
  if (allowed.length === 0) return null;
  const order = [
    chip.intent,
    ...(chip.alternatives ?? allowed.filter((item) => item !== chip.intent)),
  ].filter((intent, index, all) => all.indexOf(intent) === index);
  const usable = order.filter((intent) => allowed.includes(intent));
  if (usable.length === 0) return null;
  const current = usable.indexOf(chip.intent);
  const next = usable[(current + 1) % usable.length]!;
  return correctChipIntent(chip, next, allowed);
}

export function pointNearStroke(
  stroke: Stroke,
  point: Point,
  pad = 8,
): boolean {
  for (const p of stroke.points) {
    if (Math.hypot(p.x - point.x, p.y - point.y) <= pad) return true;
  }
  return false;
}
