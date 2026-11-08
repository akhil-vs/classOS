import { describe, expect, it } from "vitest";
import { generatePracticeItems, gradePracticeAnswer } from "./practice";

describe("practice generator", () => {
  it("builds quadratic check items with verifiable answers", () => {
    const items = generatePracticeItems(
      "math.10.quadratic-equations.discriminant",
      1,
      2,
    );
    expect(items).toHaveLength(2);
    const grade = gradePracticeAnswer(items[0]!, items[0]!.answer);
    expect(grade.ok).toBe(true);
  });

  it("builds AP items", () => {
    const items = generatePracticeItems("math.10.ap.nth-term", 0, 1);
    expect(items[0]?.engine).toBe("ap");
    expect(gradePracticeAnswer(items[0]!, items[0]!.answer).ok).toBe(true);
    expect(items[0]?.answer).toBe("14");
  });
});
