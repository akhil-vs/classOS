import { describe, expect, it } from "vitest";
import {
  checkSimilarSides,
  checkTriangleAngleSum,
  segmentDistance,
} from "./geometry";

describe("geometry slice", () => {
  it("computes coordinate distance", () => {
    const result = segmentDistance({ x1: 0, y1: 0, x2: 3, y2: 4 });
    expect(result.distance.value).toBe(5);
    expect(result.numericCheck.ok).toBe(true);
  });

  it("checks triangle angle sum", () => {
    expect(checkTriangleAngleSum({ A: 60, B: 60, C: 60 }).ok).toBe(true);
    expect(checkTriangleAngleSum({ A: 90, B: 45, C: 40 }).ok).toBe(false);
  });

  it("checks similar side ratios", () => {
    expect(checkSimilarSides([3, 4, 5], [6, 8, 10]).ok).toBe(true);
    expect(checkSimilarSides([3, 4, 5], [6, 8, 11]).ok).toBe(false);
  });
});
