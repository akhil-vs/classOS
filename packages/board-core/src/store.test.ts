import { beforeEach, describe, expect, it } from "vitest";
import { useBoardStore } from "./store";

function drawParabola() {
  const id = useBoardStore.getState().beginStroke({ x: 0, y: 95 });
  for (let i = 1; i < 28; i++) {
    const x = i * 10;
    const y = 0.0035 * (x - 140) ** 2 + 36;
    useBoardStore.getState().extendStroke(id, { x, y });
  }
  useBoardStore.getState().endStroke(id);
  return id;
}

describe("board store", () => {
  beforeEach(() => {
    useBoardStore.getState().clearBoard();
    useBoardStore.getState().setAiEnabled(true);
    useBoardStore.getState().setUnitSystem("si");
    useBoardStore.getState().setTopicId(undefined);
  });

  it("records strokes and can undo", () => {
    const id = useBoardStore.getState().beginStroke({ x: 0, y: 0 });
    useBoardStore.getState().extendStroke(id, { x: 10, y: 4 });
    useBoardStore.getState().endStroke(id);
    expect(useBoardStore.getState().strokes).toHaveLength(1);
    useBoardStore.getState().undo();
    expect(useBoardStore.getState().strokes).toHaveLength(0);
  });

  it("requires chip confirm before opening a widget", () => {
    drawParabola();
    expect(useBoardStore.getState().chips).toHaveLength(1);
    expect(useBoardStore.getState().widgets).toHaveLength(0);
    const chipId = useBoardStore.getState().chips[0]!.id;
    useBoardStore.getState().confirmChip(chipId);
    expect(useBoardStore.getState().widgets).toHaveLength(1);
  });

  it("does not stack noisy chips for repeated similar strokes", () => {
    drawParabola();
    drawParabola();
    expect(useBoardStore.getState().chips).toHaveLength(1);
  });

  it("suppresses chips when AI is off", () => {
    useBoardStore.getState().setAiEnabled(false);
    drawParabola();
    expect(useBoardStore.getState().chips).toHaveLength(0);
  });

  it("scopes recognition to the active topic", () => {
    useBoardStore.getState().setTopicId("chem.10.chemical-reactions.balancing");
    drawParabola();
    const chips = useBoardStore.getState().chips;
    // Chem topic allowlist: either no chip, or balancer-only / pick for balancer.
    for (const chip of chips) {
      expect(chip.intent).toBe("balancer");
    }
  });

  it("lets the learner correct a wrong chip after writing", () => {
    drawParabola();
    const chip = useBoardStore.getState().chips[0];
    expect(chip).toBeTruthy();
    useBoardStore.getState().correctChip(chip!.id, "balancer");
    const fixed = useBoardStore.getState().chips[0]!;
    expect(fixed.intent).toBe("balancer");
    expect(fixed.needsPick).toBe(false);
    useBoardStore.getState().confirmChip(fixed.id);
    expect(useBoardStore.getState().widgets[0]?.kind).toBe("balancer");
  });

  it("cycles chip intent with Wrong?", () => {
    drawParabola();
    const chip = useBoardStore.getState().chips[0]!;
    useBoardStore.getState().cycleChip(chip.id);
    const cycled = useBoardStore.getState().chips[0]!;
    expect(cycled.intent).not.toBe(chip.intent);
  });

  it("selects, moves, and deletes strokes", () => {
    const id = useBoardStore.getState().beginStroke({ x: 10, y: 10 });
    useBoardStore.getState().extendStroke(id, { x: 20, y: 10 });
    useBoardStore.getState().endStroke(id);
    useBoardStore.getState().selectAt({ x: 10, y: 10 });
    expect(useBoardStore.getState().selectedStrokeIds).toEqual([id]);
    useBoardStore.getState().moveSelectedStrokes(5, -2);
    const stroke = useBoardStore.getState().strokes[0]!;
    expect(stroke.points[0]).toEqual({ x: 15, y: 8 });
    useBoardStore.getState().deleteSelection();
    expect(useBoardStore.getState().strokes).toHaveLength(0);
  });

  it("tracks unit system on the board", () => {
    useBoardStore.getState().setUnitSystem("classroom");
    expect(useBoardStore.getState().unitSystem).toBe("classroom");
  });
});
