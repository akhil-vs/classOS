import { describe, expect, it } from "vitest";
import { formatFraction, solveLinear, solveLinearPair } from "@classos/engines-math";
import fixtures from "./fixtures/linear.ncert.json";

describe("linear golden set", () => {
  for (const fixture of fixtures) {
    it(fixture.id, () => {
      if (fixture.kind === "single") {
        const result = solveLinear(fixture.input as { a: number; b: number; c: number });
        expect(result.kind).toBe(fixture.expected.kind);
        expect(result.numericCheck.ok).toBe(true);
        if (fixture.expected.x) {
          expect(result.x && formatFraction(result.x)).toBe(fixture.expected.x);
        }
      } else {
        const result = solveLinearPair(
          fixture.input as {
            a1: number;
            b1: number;
            c1: number;
            a2: number;
            b2: number;
            c2: number;
          },
        );
        expect(result.kind).toBe(fixture.expected.kind);
        expect(result.numericCheck.ok).toBe(true);
        expect(result.x && formatFraction(result.x)).toBe(fixture.expected.x);
        expect(result.y && formatFraction(result.y)).toBe(fixture.expected.y);
      }
    });
  }
});
