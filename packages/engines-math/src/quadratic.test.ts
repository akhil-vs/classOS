import { describe, expect, it } from "vitest";
import { solveQuadratic } from "./quadratic";
import { assertCompatible, quantity } from "./units";

describe("solveQuadratic", () => {
  it("solves x² − 5x + 6 = 0 exactly", () => {
    const result = solveQuadratic({ a: 1, b: -5, c: 6 });
    expect(result.nature).toBe("two_distinct_real");
    expect(result.roots.map((r) => r.latex).sort()).toEqual(["2", "3"]);
    expect(result.numericCheck.ok).toBe(true);
  });

  it("detects equal roots", () => {
    const result = solveQuadratic({ a: 1, b: -2, c: 1 });
    expect(result.nature).toBe("two_equal_real");
    expect(result.roots[0]?.latex).toBe("1");
  });

  it("reports no real roots when D < 0", () => {
    const result = solveQuadratic({ a: 1, b: 0, c: 1 });
    expect(result.nature).toBe("no_real");
    expect(result.roots[0]?.kind).toBe("none");
  });
});

describe("units", () => {
  it("checks dimension compatibility", () => {
    const speed = quantity(10, "m/s");
    const other = quantity(2, "m/s");
    expect(assertCompatible(speed, other)).toBe(true);
    expect(() => quantity(1, "furlong")).toThrow();
  });
});
