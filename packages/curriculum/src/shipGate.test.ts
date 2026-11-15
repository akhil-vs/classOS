import { describe, expect, it } from "vitest";
import { getAllTopics, getTopicById } from "./loader";
import { assertShippedConsistent, evaluateShipGate } from "./shipGate";

describe("ship gate", () => {
  it("lets shipped quadratic topics pass the metadata gate", () => {
    const topic = getTopicById("math.10.quadratic-equations.solving");
    expect(topic?.status).toBe("shipped");
    const evaluation = evaluateShipGate(topic!);
    expect(evaluation.canShip).toBe(true);
    expect(assertShippedConsistent(topic!)).toBeNull();
  });

  it("lets shipped balancer and reaction-types topics pass", () => {
    expect(
      evaluateShipGate(getTopicById("chem.10.chemical-reactions.balancing")!)
        .canShip,
    ).toBe(true);
    const types = getTopicById("chem.10.chemical-reactions.types")!;
    expect(types.status).toBe("shipped");
    expect(evaluateShipGate(types).canShip).toBe(true);
  });

  it("ships linear, geometry, and Class 11 complex verticals", () => {
    for (const id of [
      "math.10.pair-of-linear-equations.solving",
      "math.9.linear-equations.one-variable",
      "math.10.coordinate-geometry.distance",
      "math.11.complex-numbers.modulus",
    ]) {
      const topic = getTopicById(id)!;
      expect(topic.status).toBe("shipped");
      expect(evaluateShipGate(topic).canShip).toBe(true);
    }
  });

  it("never marks shipped topics without a consistent gate", () => {
    for (const topic of getAllTopics()) {
      expect(assertShippedConsistent(topic)).toBeNull();
    }
  });
});
