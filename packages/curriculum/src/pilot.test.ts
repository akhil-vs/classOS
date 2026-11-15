import { describe, expect, it } from "vitest";
import {
  getPilotTopics,
  predictOptionsForTopic,
  topicAssumptions,
  topicUsesUnits,
} from "./pilot";
import { getTopicById } from "./loader";

describe("phase 4 pilot helpers", () => {
  it("lists only shipped Quadratic and Reactions topics", () => {
    const pilot = getPilotTopics();
    expect(pilot.length).toBeGreaterThan(0);
    expect(
      pilot.every(
        (topic) =>
          topic.status === "shipped" &&
          (topic.chapter === "Quadratic Equations" ||
            topic.chapter === "Chemical Reactions and Equations"),
      ),
    ).toBe(true);
  });

  it("keeps assumptions distinct from unit chrome", () => {
    const quadratic = getTopicById("math.10.quadratic-equations.solving")!;
    const reactions = getTopicById("chem.10.chemical-reactions.balancing")!;
    expect(topicAssumptions(quadratic)).toMatch(/dimensionless/i);
    expect(topicAssumptions(reactions)).toMatch(/atoms conserved/i);
    expect(topicUsesUnits(quadratic)).toBe(false);
    expect(topicUsesUnits(reactions)).toBe(false);
  });

  it("scopes predict options per subject", () => {
    const quadratic = getTopicById("math.10.quadratic-equations.discriminant")!;
    const reactions = getTopicById("chem.10.chemical-reactions.balancing")!;
    expect(predictOptionsForTopic(quadratic)).toContain("D > 0");
    expect(predictOptionsForTopic(quadratic)).not.toContain("Balanced");
    expect(predictOptionsForTopic(reactions)).toContain("Needs coefficients");
    expect(predictOptionsForTopic(reactions)).not.toContain("D > 0");
  });
});
