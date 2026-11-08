import { describe, expect, it } from "vitest";
import { formatFraction, solveQuadratic } from "@classos/engines-math";
import fixtures from "./fixtures/quadratic.ncert.json";

describe("NCERT quadratic golden set", () => {
  for (const fixture of fixtures) {
    it(fixture.id, () => {
      const result = solveQuadratic(fixture.input);
      expect(result.numericCheck.ok).toBe(true);
      expect(result.nature).toBe(fixture.expected.nature);
      expect(formatFraction(result.discriminant)).toBe(
        fixture.expected.discriminant,
      );
      const got = result.roots.map((root) => root.latex).sort();
      const expected = [...fixture.expected.roots].sort();
      expect(got).toEqual(expected);
    });
  }
});
