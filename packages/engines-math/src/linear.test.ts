import { describe, expect, it } from "vitest";
import { formatFraction } from "./fraction";
import { solveLinearSystem } from "./linear";

describe("solveLinearSystem", () => {
  it("solves a unique system", () => {
    const result = solveLinearSystem({
      a1: 1,
      b1: 1,
      c1: 5,
      a2: 1,
      b2: -1,
      c2: 1,
    });
    expect(result.nature).toBe("unique");
    expect(formatFraction(result.x!)).toBe("3");
    expect(formatFraction(result.y!)).toBe("2");
    expect(result.numericCheck.ok).toBe(true);
  });

  it("detects no solution", () => {
    const result = solveLinearSystem({
      a1: 1,
      b1: 1,
      c1: 2,
      a2: 2,
      b2: 2,
      c2: 5,
    });
    expect(result.nature).toBe("none");
  });
});
