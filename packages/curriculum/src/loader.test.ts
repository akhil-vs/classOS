import { describe, expect, it } from "vitest";
import {
  buildBrowseIndex,
  curriculumHealth,
  getManifestPayload,
  getTopicById,
} from "./loader";

describe("curriculum loader", () => {
  it("loads inventory-backed browse index", () => {
    const index = buildBrowseIndex();
    expect(index.classes).toEqual([9, 10, 11, 12]);
    expect(index.chapters.length).toBeGreaterThan(50);
    expect(
      index.chapters.some((chapter) => chapter.title === "Quadratic Equations"),
    ).toBe(true);
  });

  it("resolves reference topic modules", () => {
    const quadratic = getTopicById("math.10.quadratic-equations.discriminant");
    expect(quadratic?.engines).toContain("cas");
    expect(quadratic?.studentInput.touch.length).toBeGreaterThan(0);
    expect(quadratic?.studentInput.pointerKeyboard.length).toBeGreaterThan(0);

    const chem = getTopicById("chem.10.chemical-reactions.balancing");
    expect(chem?.widget).toBe("balancer");
  });

  it("serves manifest payloads without hardcoded UI ids", () => {
    const payload = getManifestPayload(
      "math.10.quadratic-equations.discriminant",
    );
    expect(payload?.type).toBe("topic");
    expect(curriculumHealth().inventoryUnits).toBe(139);
  });
});
