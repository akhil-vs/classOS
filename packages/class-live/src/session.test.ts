import { beforeEach, describe, expect, it } from "vitest";
import {
  __resetLiveClasses,
  castPredictVote,
  createLiveClass,
  setPredictOpen,
  voteSummary,
} from "./session";

describe("local-first live class", () => {
  beforeEach(() => __resetLiveClasses());

  it("creates a join code and collects predict votes", () => {
    const session = createLiveClass({ teacherLabel: "Ms. Rao" });
    expect(session.joinCode).toHaveLength(6);
    setPredictOpen(session.id, true);
    castPredictVote({
      liveClassId: session.id,
      studentLabel: "Asha",
      choice: "D > 0",
      at: Date.now(),
    });
    castPredictVote({
      liveClassId: session.id,
      studentLabel: "Dev",
      choice: "D = 0",
      at: Date.now(),
    });
    expect(voteSummary(session)).toEqual({ "D > 0": 1, "D = 0": 1 });
  });
});
