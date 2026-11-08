import { describe, expect, it } from "vitest";
import { evaluatePolynomial, formatFraction } from "@classos/engines-math";
import fixtures from "./fixtures/polynomial.ncert.json";

describe("NCERT polynomial golden set", () => {
  for (const fixture of fixtures) {
    it(fixture.id, () => {
      const result = evaluatePolynomial(
        { coeffs: fixture.input.coeffs },
        fixture.input.at,
      );
      expect(result.numericCheck.ok).toBe(true);
      expect(formatFraction(result.value)).toBe(fixture.expected.value);
    });
  }
});
