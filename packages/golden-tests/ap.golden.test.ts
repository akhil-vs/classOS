import { describe, expect, it } from "vitest";
import { formatFraction, solveAP } from "@classos/engines-math";
import fixtures from "./fixtures/ap.ncert.json";

describe("NCERT AP golden set", () => {
  for (const fixture of fixtures) {
    it(fixture.id, () => {
      const result = solveAP(fixture.input);
      expect(result.numericCheck.ok).toBe(true);
      expect(formatFraction(result.term)).toBe(fixture.expected.term);
      expect(formatFraction(result.sum)).toBe(fixture.expected.sum);
    });
  }
});
