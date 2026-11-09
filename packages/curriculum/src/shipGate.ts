import type { ShipGateEvaluation, TopicModule } from "./types";

/**
 * Evaluate whether a topic may carry status "shipped".
 * Golden pass/fail is asserted in packages/golden-tests; this checks metadata.
 */
export function evaluateShipGate(topic: TopicModule): ShipGateEvaluation {
  const missing: string[] = [];
  const gate = topic.shipGate;

  if (!gate) {
    missing.push("shipGate metadata missing");
  } else {
    if (!gate.syllabusValidated) missing.push("syllabus not validated");
    if (!gate.teacherReviewed) missing.push("teacher review missing");
    if (!gate.qaTouchVerified) missing.push("touch QA missing");
    if (!gate.qaKeyboardVerified) missing.push("keyboard QA missing");
    if (!gate.assumptionsPresent) missing.push("assumptions / scope banner missing");
    if (gate.goldenIds.length === 0) missing.push("no golden ids listed");
    for (const id of topic.goldenTests) {
      if (!gate.goldenIds.includes(id)) {
        missing.push(`golden ${id} not listed on shipGate`);
      }
    }
  }

  if (topic.goldenTests.length === 0) {
    missing.push("topic.goldenTests empty");
  }

  if (
    topic.studentInput.touch.length === 0 ||
    topic.studentInput.pointerKeyboard.length === 0
  ) {
    missing.push("input parity paths incomplete");
  }

  const canShip = missing.length === 0;
  return {
    topicId: topic.id,
    canShip,
    missing,
    status: topic.status,
  };
}

export function assertShippedConsistent(topic: TopicModule): string | null {
  const evaluation = evaluateShipGate(topic);
  if (topic.status === "shipped" && !evaluation.canShip) {
    return `${topic.id} is marked shipped but gate fails: ${evaluation.missing.join("; ")}`;
  }
  if (topic.status !== "shipped" && evaluation.canShip) {
    // Soft signal — allowed to stay in_progress until explicitly flipped.
    return null;
  }
  return null;
}
