/**
 * Phase 5 classroom pack — local-first protocol types.
 * Votes and presence stay on the teacher process; no cloud student sync.
 */

export type LiveClassStatus = "live" | "ended";

export interface JoinPresence {
  liveClassId: string;
  studentLabel: string;
  joinedAt: number;
  lastSeenAt: number;
}

export interface PredictVote {
  liveClassId: string;
  studentLabel: string;
  choice: string;
  at: number;
}

export interface LiveClassSession {
  id: string;
  joinCode: string;
  teacherLabel: string;
  status: LiveClassStatus;
  topicId?: string;
  createdAt: number;
  endedAt?: number;
  /** Freeze board + accept /join votes while true. */
  predictOpen: boolean;
  predictPrompt: string;
  predictChoices: string[];
  /** studentLabel → choice (last vote wins while Predict is open). */
  votes: Record<string, string>;
  /** studentLabel → presence (local-first roster). */
  presence: Record<string, JoinPresence>;
}

/** Teacher-facing snapshot with tallies. */
export interface TeacherLiveSnapshot extends LiveClassSession {
  voteSummary: Record<string, number>;
  joinedCount: number;
}

/** Student-facing snapshot — no peer vote map. */
export interface StudentJoinSnapshot {
  id: string;
  joinCode: string;
  status: LiveClassStatus;
  topicId?: string;
  teacherLabel: string;
  predictOpen: boolean;
  predictPrompt: string;
  predictChoices: string[];
  joinedCount: number;
}

/** School-pilot aggregate (device-local, school-scoped). */
export interface SchoolSessionSummary {
  id: string;
  joinCode: string;
  teacherLabel: string;
  topicId?: string;
  createdAt: number;
  endedAt?: number;
  status: LiveClassStatus;
  joinedCount: number;
  voteTotal: number;
  voteSummary: Record<string, number>;
}
