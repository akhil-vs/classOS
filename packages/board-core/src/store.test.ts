import { beforeEach, describe, expect, it } from "vitest";
import { useBoardStore } from "./store";

describe("board store", () => {
  beforeEach(() => {
    useBoardStore.getState().clearBoard();
    useBoardStore.getState().setAiEnabled(true);
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
    const id = useBoardStore.getState().beginStroke({ x: 0, y: 0 });
    for (let i = 1; i < 12; i++) {
      useBoardStore.getState().extendStroke(id, { x: i * 12, y: 20 });
    }
    useBoardStore.getState().endStroke(id);
    expect(useBoardStore.getState().chips.length).toBeGreaterThan(0);
    expect(useBoardStore.getState().widgets).toHaveLength(0);
    const chipId = useBoardStore.getState().chips[0]!.id;
    useBoardStore.getState().confirmChip(chipId);
    expect(useBoardStore.getState().widgets).toHaveLength(1);
  });

  it("suppresses chips when AI is off", () => {
    useBoardStore.getState().setAiEnabled(false);
    const id = useBoardStore.getState().beginStroke({ x: 0, y: 0 });
    for (let i = 1; i < 12; i++) {
      useBoardStore.getState().extendStroke(id, { x: i * 12, y: 20 });
    }
    useBoardStore.getState().endStroke(id);
    expect(useBoardStore.getState().chips).toHaveLength(0);
  });
});
