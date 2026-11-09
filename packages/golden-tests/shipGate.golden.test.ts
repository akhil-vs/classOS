import { describe, expect, it } from "vitest";
import {
  assertShippedConsistent,
  getAllTopics,
  getTopicById,
} from "@classos/curriculum";

describe("ship gate consistency", () => {
  it("keeps every shipped topic gate-consistent", () => {
    for (const topic of getAllTopics()) {
      expect(assertShippedConsistent(topic)).toBeNull();
    }
  });

  it("ships quadratic and balancer verticals", () => {
    expect(
      getTopicById("math.10.quadratic-equations.solving")?.status,
    ).toBe("shipped");
    expect(
      getTopicById("chem.10.chemical-reactions.balancing")?.status,
    ).toBe("shipped");
  });
});
