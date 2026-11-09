import { beforeEach, describe, expect, it } from "vitest";
import {
  __PRESENCE_STALE_MS,
  __resetLiveClasses,
  castPredictVote,
  createLiveClass,
  endLiveClass,
  getLiveClassByCode,
  joinedCount,
  listSchoolSessionSummaries,
  registerPresence,
  setPredictOpen,
  toStudentSnapshot,
  toTeacherSnapshot,
  voteSummary,
} from "./session";

describe("local-first live class", () => {
  beforeEach(() => __resetLiveClasses());

  it("creates a join code and collects predict votes", () => {
    const session = createLiveClass({ teacherLabel: "Ms. Rao" });
    expect(session.joinCode).toHaveLength(6);
    expect(session.status).toBe("live");
    expect(session.predictOpen).toBe(false);

    const opened = setPredictOpen(session.id, true);
    expect("error" in opened).toBe(false);

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
    expect(joinedCount(session)).toBe(2);
  });

  it("looks up sessions by join code case-insensitively", () => {
    const session = createLiveClass({ teacherLabel: "Teacher" });
    expect(getLiveClassByCode(session.joinCode.toLowerCase())?.id).toBe(
      session.id,
    );
  });

  it("rejects votes when Predict is closed or class ended", () => {
    const session = createLiveClass({ teacherLabel: "Teacher" });
    expect(
      castPredictVote({
        liveClassId: session.id,
        studentLabel: "Asha",
        choice: "D > 0",
        at: Date.now(),
      }),
    ).toEqual({ error: "Predict is closed" });

    setPredictOpen(session.id, true);
    endLiveClass(session.id);
    expect(
      castPredictVote({
        liveClassId: session.id,
        studentLabel: "Asha",
        choice: "D > 0",
        at: Date.now(),
      }),
    ).toEqual({ error: "Class is not live" });
  });

  it("clears votes when Predict re-opens and overwrites same student", () => {
    const session = createLiveClass({ teacherLabel: "Teacher" });
    setPredictOpen(session.id, true);
    castPredictVote({
      liveClassId: session.joinCode,
      studentLabel: "  Asha  ",
      choice: "D > 0",
      at: Date.now(),
    });
    castPredictVote({
      liveClassId: session.id,
      studentLabel: "Asha",
      choice: "D < 0",
      at: Date.now(),
    });
    expect(voteSummary(session)).toEqual({ "D < 0": 1 });

    setPredictOpen(session.id, false);
    setPredictOpen(session.id, true);
    expect(voteSummary(session)).toEqual({});
  });

  it("rejects choices outside the Predict board", () => {
    const session = createLiveClass({
      teacherLabel: "Teacher",
      predictChoices: ["More", "Less"],
    });
    setPredictOpen(session.id, true);
    expect(
      castPredictVote({
        liveClassId: session.id,
        studentLabel: "Asha",
        choice: "D > 0",
        at: Date.now(),
      }),
    ).toEqual({ error: "Choice is not on the Predict board" });
  });

  it("tracks presence and drops stale joiners", () => {
    const session = createLiveClass({ teacherLabel: "Teacher" });
    registerPresence({ liveClassId: session.id, studentLabel: "Dev" });
    expect(joinedCount(session)).toBe(1);

    const presence = session.presence.Dev;
    expect(presence).toBeDefined();
    if (presence) {
      presence.lastSeenAt = Date.now() - __PRESENCE_STALE_MS - 1;
    }
    expect(joinedCount(session)).toBe(0);
  });

  it("builds teacher and student snapshots without peer vote maps on join", () => {
    const session = createLiveClass({ teacherLabel: "Ms. Rao", topicId: "math.10" });
    setPredictOpen(session.id, true, { prompt: "Roots?" });
    castPredictVote({
      liveClassId: session.id,
      studentLabel: "Asha",
      choice: "D > 0",
      at: Date.now(),
    });

    const teacher = toTeacherSnapshot(session);
    expect(teacher.voteSummary["D > 0"]).toBe(1);
    expect(teacher.joinedCount).toBe(1);

    const student = toStudentSnapshot(session);
    expect(student.predictPrompt).toBe("Roots?");
    expect(student).not.toHaveProperty("votes");
  });

  it("ends the session and lists school summaries locally", () => {
    const session = createLiveClass({ teacherLabel: "Teacher" });
    setPredictOpen(session.id, true);
    castPredictVote({
      liveClassId: session.id,
      studentLabel: "Asha",
      choice: "D > 0",
      at: Date.now(),
    });
    const ended = endLiveClass(session.id);
    expect("error" in ended).toBe(false);
    if (!("error" in ended)) {
      expect(ended.status).toBe("ended");
      expect(ended.predictOpen).toBe(false);
      expect(ended.endedAt).toBeTypeOf("number");
    }

    const summaries = listSchoolSessionSummaries();
    expect(summaries).toHaveLength(1);
    expect(summaries[0]?.voteTotal).toBe(1);
    expect(summaries[0]?.status).toBe("ended");
  });

  it("refuses Predict toggle after end", () => {
    const session = createLiveClass({ teacherLabel: "Teacher" });
    endLiveClass(session.id);
    expect(setPredictOpen(session.id, true)).toEqual({
      error: "Class is not live",
    });
  });
});
