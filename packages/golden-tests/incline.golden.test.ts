import { describe, expect, it } from "vitest";
import { solveIncline } from "@classos/engines-physics";
import fixtures from "./fixtures/incline.phase1b.json";

describe("Phase 1b incline golden set", () => {
  for (const fixture of fixtures) {
    it(fixture.id, () => {
      const result = solveIncline(fixture.input);
      expect(result.parallel.value).toBeCloseTo(fixture.expected.parallel, 9);
      expect(result.acceleration.value).toBeCloseTo(
        fixture.expected.acceleration,
        9,
      );
      expect(result.simCheck.ok).toBe(true);
    });
  }
});
