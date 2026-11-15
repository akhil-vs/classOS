import { describe, expect, it } from "vitest";
import { complexModulus, formatComplex } from "@classos/engines-math";
import fixtures from "./fixtures/complex.ncert.json";

describe("complex numbers golden set", () => {
  for (const fixture of fixtures) {
    it(fixture.id, () => {
      const result = complexModulus(fixture.input);
      expect(result.modulus).toBe(fixture.expected.modulus);
      expect(formatComplex(result.conjugate)).toBe(fixture.expected.conjugate);
      expect(result.numericCheck.ok).toBe(true);
    });
  }
});
