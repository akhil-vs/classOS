import { describe, expect, it } from "vitest";
import { formatFraction } from "./fraction";
import { solveAP } from "./ap";

describe("solveAP", () => {
  it("computes nth term and sum", () => {
    const result = solveAP({ a: 2, d: 3, n: 5 });
    expect(formatFraction(result.term)).toBe("14");
    expect(formatFraction(result.sum)).toBe("40");
    expect(result.numericCheck.ok).toBe(true);
  });
});
