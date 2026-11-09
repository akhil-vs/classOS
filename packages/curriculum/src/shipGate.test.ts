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

  it("lets shipped balancer topic pass", () => {
    const topic = getTopicById("chem.10.chemical-reactions.balancing");
    expect(evaluateShipGate(topic!).canShip).toBe(true);
  });

  it("keeps reaction types blocked until teacher review", () => {
    const topic = getTopicById("chem.10.chemical-reactions.types");
    expect(topic?.status).toBe("in_progress");
    expect(evaluateShipGate(topic!).canShip).toBe(false);
  });

  it("never marks shipped topics without a consistent gate", () => {
    for (const topic of getAllTopics()) {
      expect(assertShippedConsistent(topic)).toBeNull();
    }
  });
});
