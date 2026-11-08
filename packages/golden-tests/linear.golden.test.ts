import { describe, expect, it } from "vitest";
import { formatFraction, solveLinearSystem } from "@classos/engines-math";
import fixtures from "./fixtures/linear.ncert.json";

describe("NCERT linear golden set", () => {
  for (const fixture of fixtures) {
    it(fixture.id, () => {
      const result = solveLinearSystem(fixture.input);
      expect(result.numericCheck.ok).toBe(true);
      expect(result.nature).toBe(fixture.expected.nature);
      if (fixture.expected.x && fixture.expected.y) {
        expect(formatFraction(result.x!)).toBe(fixture.expected.x);
        expect(formatFraction(result.y!)).toBe(fixture.expected.y);
      }
    });
  }
});
