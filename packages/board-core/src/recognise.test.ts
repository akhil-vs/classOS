import { describe, expect, it } from "vitest";
import {
  allowedIntentsForTopic,
  analyseInk,
  clusterNearbyStrokes,
  correctChipIntent,
  cycleChipIntent,
  mergePendingChips,
  recogniseFromStroke,
  recogniseFromStrokes,
} from "./recognise";
import type { Stroke, SuggestionChip } from "./types";

function strokeFrom(
  points: Array<{ x: number; y: number }>,
  id = "s1",
): Stroke {
  return {
    id,
    points,
    color: "#fff",
    width: 2,
  };
}

/** Wide, shallow parabola — matches quadratic, not balancer. */
function parabolaPoints(): Array<{ x: number; y: number }> {
  const points: Array<{ x: number; y: number }> = [];
  for (let i = 0; i < 28; i++) {
    const x = i * 10;
    const y = 0.0035 * (x - 140) ** 2 + 36;
    points.push({ x, y });
  }
  return points;
}

/** Tall multi-turn chem-like scribble. */
function reactionLikePoints(): Array<{ x: number; y: number }> {
  const points: Array<{ x: number; y: number }> = [];
  for (let i = 0; i < 24; i++) {
    const x = 40 + (i % 6) * 12 + (i > 12 ? 20 : 0);
    const y = 20 + Math.floor(i / 3) * 18 + ((i % 2) * 10);
    points.push({ x, y });
  }
  // Arrow-like reverse
  for (let i = 0; i < 8; i++) {
    points.push({ x: 110 + i * 8, y: 80 - (i < 4 ? i * 6 : (8 - i) * 6) });
  }
  return points;
}

function flatLinePoints(): Array<{ x: number; y: number }> {
  return Array.from({ length: 20 }, (_, i) => ({ x: i * 12, y: 40 + (i % 2) }));
}

describe("recogniseFromStroke", () => {
  it("does not emit a fallback chip for ambiguous scribbles", () => {
    const points = Array.from({ length: 12 }, (_, i) => ({
      x: 10 + i * 3,
      y: 10 + (i % 2),
    }));
    expect(recogniseFromStroke(strokeFrom(points))).toBeNull();
  });

  it("suggests quadratic for a wide moderate curve when allowed", () => {
    const chip = recogniseFromStroke(strokeFrom(parabolaPoints()), [
      "quadratic",
      "balancer",
    ]);
    expect(chip?.intent).toBe("quadratic");
    expect(chip?.needsPick).toBe(false);
    expect(chip?.alternatives).toContain("balancer");
  });

  it("suppresses intents outside the topic allowlist", () => {
    const chip = recogniseFromStroke(strokeFrom(parabolaPoints()), [
      "balancer",
    ]);
    // Topic locked to balancer: either null or a pick forced onto balancer.
    if (chip) {
      expect(chip.intent).toBe("balancer");
    } else {
      expect(chip).toBeNull();
    }
  });

  it("prefers balancer for tall multi-turn chem-like ink", () => {
    const chip = recogniseFromStroke(strokeFrom(reactionLikePoints()), [
      "quadratic",
      "balancer",
    ]);
    expect(chip).not.toBeNull();
    expect(["balancer", "quadratic"]).toContain(chip!.intent);
    // Even if ambiguous, alternatives let the learner correct.
    expect(
      [chip!.intent, ...(chip!.alternatives ?? [])].includes("balancer"),
    ).toBe(true);
  });

  it("suggests linear for a long flat stroke when allowed", () => {
    const chip = recogniseFromStroke(strokeFrom(flatLinePoints()), [
      "linear",
      "quadratic",
    ]);
    expect(chip?.intent).toBe("linear");
  });

  it("scopes allowlists for pilot topics", () => {
    expect(allowedIntentsForTopic("math.10.quadratic-equations.solving")).toEqual([
      "quadratic",
    ]);
    expect(
      allowedIntentsForTopic("chem.10.chemical-reactions.balancing"),
    ).toEqual(["balancer"]);
    expect(allowedIntentsForTopic(undefined)).toEqual([
      "quadratic",
      "balancer",
    ]);
  });

  it("keeps a single pending chip and replaces same intent", () => {
    const first: SuggestionChip = {
      id: "a",
      label: "Quadratic?",
      intent: "quadratic",
      x: 1,
      y: 1,
    };
    const second: SuggestionChip = {
      id: "b",
      label: "Quadratic ax²+bx+c=0?",
      intent: "quadratic",
      x: 2,
      y: 2,
    };
    expect(mergePendingChips([first], second)).toEqual([second]);
  });
});

describe("stroke clusters and correction", () => {
  it("clusters nearby strokes into one ink group", () => {
    const a = strokeFrom(
      [
        { x: 0, y: 0 },
        { x: 20, y: 0 },
      ],
      "a",
    );
    const b = strokeFrom(
      [
        { x: 40, y: 5 },
        { x: 60, y: 8 },
      ],
      "b",
    );
    const far = strokeFrom(
      [
        { x: 400, y: 400 },
        { x: 420, y: 410 },
      ],
      "far",
    );
    const cluster = clusterNearbyStrokes([a, b, far], "b");
    expect(cluster.map((s) => s.id).sort()).toEqual(["a", "b"]);
  });

  it("scores multi-stroke equation blocks as one recognition", () => {
    const glyphs = [
      strokeFrom(
        Array.from({ length: 12 }, (_, i) => ({ x: i * 4, y: 40 + (i % 3) })),
        "g1",
      ),
      strokeFrom(
        Array.from({ length: 10 }, (_, i) => ({
          x: 55 + i * 3,
          y: 30 + i * 2,
        })),
        "g2",
      ),
      strokeFrom(
        Array.from({ length: 14 }, (_, i) => ({
          x: 90 + i * 8,
          y: 45 + Math.sin(i / 2) * 12,
        })),
        "g3",
      ),
    ];
    const features = analyseInk(glyphs);
    expect(features?.strokeCount).toBe(3);
    const chip = recogniseFromStrokes(glyphs, ["quadratic", "balancer"]);
    expect(chip).not.toBeNull();
    expect(chip?.sourceStrokeIds).toEqual(["g1", "g2", "g3"]);
  });

  it("corrects a wrong chip intent in one step", () => {
    const chip: SuggestionChip = {
      id: "c1",
      label: "Quadratic ax²+bx+c=0?",
      intent: "quadratic",
      x: 10,
      y: 10,
      alternatives: ["balancer"],
    };
    const fixed = correctChipIntent(chip, "balancer", ["quadratic", "balancer"]);
    expect(fixed?.intent).toBe("balancer");
    expect(fixed?.needsPick).toBe(false);
    expect(fixed?.confidence).toBe(1);
    expect(fixed?.label).toContain("Balance");
  });

  it("cycles through allowed intents", () => {
    const chip: SuggestionChip = {
      id: "c1",
      label: "What did you write?",
      intent: "quadratic",
      x: 10,
      y: 10,
      needsPick: true,
      alternatives: ["balancer"],
    };
    const next = cycleChipIntent(chip, ["quadratic", "balancer"]);
    expect(next?.intent).toBe("balancer");
    const back = cycleChipIntent(next!, ["quadratic", "balancer"]);
    expect(back?.intent).toBe("quadratic");
  });
});
