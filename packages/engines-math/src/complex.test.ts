import { describe, expect, it } from "vitest";
import { complexModulus, formatComplex } from "./complex";

describe("complexModulus", () => {
  it("computes |3 + 4i| = 5", () => {
    const result = complexModulus({ a: 3, b: 4 });
    expect(result.modulus).toBe(5);
    expect(result.numericCheck.ok).toBe(true);
    expect(formatComplex(result.conjugate)).toBe("3 − 4i");
  });

  it("handles pure imaginary", () => {
    const result = complexModulus({ a: 0, b: 1 });
    expect(result.modulus).toBe(1);
    expect(formatComplex(result.z)).toBe("i");
  });
});
