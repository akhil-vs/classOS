import { describe, expect, it } from "vitest";
import { formatFraction } from "./fraction";
import { formatLinear, solveLinear, solveLinearPair } from "./linear";
import {
  linearAnswerEquivalent,
  quadraticRootsEquivalent,
} from "./equivalence";

describe("solveLinear", () => {
  it("solves 2x + 3 = 11", () => {
    const result = solveLinear({ a: 2, b: 3, c: 11 });
    expect(result.kind).toBe("unique");
    expect(result.x && formatFraction(result.x)).toBe("4");
    expect(result.numericCheck.ok).toBe(true);
  });

  it("detects contradiction and identity", () => {
    expect(solveLinear({ a: 0, b: 2, c: 3 }).kind).toBe("contradiction");
    expect(solveLinear({ a: 0, b: 2, c: 2 }).kind).toBe("identity");
  });

  it("formats classroom equations", () => {
    expect(formatLinear({ a: 1, b: -5, c: 0 })).toBe("x − 5 = 0");
  });
});

describe("solveLinearPair", () => {
  it("solves a unique 2×2 system", () => {
    const result = solveLinearPair({
      a1: 1,
      b1: 1,
      c1: 5,
      a2: 1,
      b2: -1,
      c2: 1,
    });
    expect(result.kind).toBe("unique");
    expect(result.x && formatFraction(result.x)).toBe("3");
    expect(result.y && formatFraction(result.y)).toBe("2");
    expect(result.numericCheck.ok).toBe(true);
  });
});

describe("teacher-private equivalence", () => {
  it("matches linear answers privately", () => {
    const ok = linearAnswerEquivalent({ a: 2, b: 3, c: 11 }, 4);
    expect(ok.equivalent).toBe(true);
    expect(ok.teacherPrivate).toBe(true);
    expect(linearAnswerEquivalent({ a: 2, b: 3, c: 11 }, 5).equivalent).toBe(
      false,
    );
  });

  it("matches quadratic roots as a multiset", () => {
    const ok = quadraticRootsEquivalent({ a: 1, b: -5, c: 6 }, [3, 2]);
    expect(ok.equivalent).toBe(true);
    expect(ok.teacherPrivate).toBe(true);
  });
});
