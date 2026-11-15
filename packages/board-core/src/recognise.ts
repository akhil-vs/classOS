import type { Point, Stroke, SuggestionChip } from "./types";

export type ChipIntent = SuggestionChip["intent"];

/** Phase 4 learner pilot: only shipped Quadratic + Reactions intents by default. */
export const PILOT_CHIP_INTENTS: ChipIntent[] = ["quadratic", "balancer"];

const MAX_PENDING_CHIPS = 1;

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

export function strokeBounds(stroke: Stroke) {
  const xs = stroke.points.map((p) => p.x);
  const ys = stroke.points.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const width = maxX - minX;
  const height = maxY - minY;
  return { minX, maxX, minY, maxY, width, height };
}

/**
 * Conservative ink heuristics for the learner pilot.
 * Returns null when the stroke is too small or ambiguous — never a fallback chip.
 */
export function recogniseFromStroke(
  stroke: Stroke,
  allowed: ChipIntent[] = PILOT_CHIP_INTENTS,
): SuggestionChip | null {
  if (stroke.points.length < 10) return null;

  const { width, height } = strokeBounds(stroke);
  const last = stroke.points[stroke.points.length - 1]!;
  const aspect = height / Math.max(width, 1);

  // Ignore tiny scribbles and dots.
  if (width < 48 && height < 48) return null;

  const candidates: Array<{ intent: ChipIntent; label: string; score: number }> =
    [];

  // Wide, moderately tall curve → quadratic family (not a tall equation block).
  if (width >= 100 && height >= 44 && height <= 95 && aspect > 0.28 && aspect < 0.7) {
    candidates.push({
      intent: "quadratic",
      label: "Quadratic ax²+bx+c=0?",
      score: 0.78,
    });
  }

  // Long shallow stroke → linear equation line.
  if (width >= 110 && height > 0 && height <= 28 && aspect <= 0.22) {
    candidates.push({
      intent: "linear",
      label: "Linear ax+b=c?",
      score: 0.74,
    });
  }

  // Tall / near-square mark → chem balance suggestion (distinct from parabola).
  if (width >= 48 && width <= 110 && height >= 90 && aspect >= 1.05) {
    candidates.push({
      intent: "balancer",
      label: "Balance reaction?",
      score: 0.76,
    });
  }

  const ranked = candidates
    .filter((item) => allowed.includes(item.intent))
    .sort((a, b) => b.score - a.score);

  const best = ranked[0];
  if (!best || best.score < 0.65) return null;

  return {
    id: uid("chip"),
    label: best.label,
    intent: best.intent,
    x: last.x,
    y: last.y,
  };
}

/** Keep at most one pending chip; replace same-intent suggestions. */
export function mergePendingChips(
  existing: SuggestionChip[],
  next: SuggestionChip | null,
): SuggestionChip[] {
  if (!next) return existing;
  const withoutSame = existing.filter((chip) => chip.intent !== next.intent);
  return [...withoutSame, next].slice(-MAX_PENDING_CHIPS);
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
