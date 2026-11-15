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

  it("ships quadratic, chem, linear, geometry, and complex verticals", () => {
    for (const id of [
      "math.10.quadratic-equations.solving",
      "chem.10.chemical-reactions.balancing",
      "chem.10.chemical-reactions.types",
      "math.10.pair-of-linear-equations.solving",
      "math.10.coordinate-geometry.distance",
      "math.11.complex-numbers.modulus",
    ]) {
      expect(getTopicById(id)?.status).toBe("shipped");
    }
  });
});
