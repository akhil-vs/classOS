/**
 * Phase 5 classroom pack — local-first protocol types.
 * Realtime transport comes after learner pilot (Phase 4).
 */

export type LiveClassStatus = "draft" | "live" | "ended";

export interface LiveClassSession {
  id: string;
  joinCode: string;
  teacherLabel: string;
  status: LiveClassStatus;
  topicId?: string;
  createdAt: number;
  /** Local-first: votes stored on teacher device until optional sync. */
  predictOpen: boolean;
  votes: Record<string, string>;
}

export interface JoinPresence {
  liveClassId: string;
  studentLabel: string;
  joinedAt: number;
}

export interface PredictVote {
  liveClassId: string;
  studentLabel: string;
  choice: string;
  at: number;
}
