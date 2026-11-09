import { describe, expect, it } from "vitest";
import { solveIncline } from "./incline";

describe("solveIncline", () => {
  it("matches mg sinθ / mg cosθ closed form", () => {
    const result = solveIncline({ massKg: 2, angleDeg: 30, g: 10 });
    expect(result.parallel.value).toBeCloseTo(10, 9);
    expect(result.normal.value).toBeCloseTo(10 * Math.sqrt(3), 9);
    expect(result.acceleration.value).toBeCloseTo(5, 9);
    expect(result.simCheck.ok).toBe(true);
    expect(result.assumptionBanner).toContain("Frictionless");
  });

  it("flags frictionful mode as out of 1b scope", () => {
    const result = solveIncline({
      massKg: 1,
      angleDeg: 45,
      frictionless: false,
    });
    expect(result.simCheck.ok).toBe(false);
    expect(result.simCheck.warning).toMatch(/Phase 1b/);
  });
});
