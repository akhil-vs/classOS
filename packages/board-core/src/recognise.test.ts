import { describe, expect, it } from "vitest";
import {
  allowedIntentsForTopic,
  mergePendingChips,
  recogniseFromStroke,
} from "./recognise";
import type { Stroke, SuggestionChip } from "./types";

function strokeFrom(points: Array<{ x: number; y: number }>): Stroke {
  return {
    id: "s1",
    points,
    color: "#fff",
    width: 2,
  };
}

/** Wide, shallow parabola — matches quadratic, not balancer. */
function parabolaPoints(): Array<{ x: number; y: number }> {
  const points: Array<{ x: number; y: number }> = [];
  for (let i = 0; i < 16; i++) {
    const x = i * 12;
    const y = 0.008 * (x - 90) ** 2 + 30;
    points.push({ x, y });
  }
  return points;
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
  });

  it("suppresses intents outside the topic allowlist", () => {
    const chip = recogniseFromStroke(strokeFrom(parabolaPoints()), [
      "balancer",
    ]);
    expect(chip).toBeNull();
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
