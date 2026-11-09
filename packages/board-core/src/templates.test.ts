import { describe, expect, it } from "vitest";
import {
  pilotPrimaryTemplates,
  secondaryTemplates,
  templatesForTopic,
} from "./templates";

describe("pilot templates", () => {
  it("keeps Quadratic and Balance as the only primary pilot templates", () => {
    expect(pilotPrimaryTemplates().map((item) => item.kind)).toEqual([
      "quadratic",
      "balancer",
    ]);
    expect(secondaryTemplates().some((item) => item.kind === "scene")).toBe(
      true,
    );
  });

  it("promotes the active topic widget without dumping demos into primary", () => {
    const { primary, secondary } = templatesForTopic("quadratic");
    expect(primary[0]?.kind).toBe("quadratic");
    expect(primary.map((item) => item.kind)).toEqual([
      "quadratic",
      "balancer",
    ]);
    expect(secondary.map((item) => item.kind)).not.toContain("quadratic");
  });
});
