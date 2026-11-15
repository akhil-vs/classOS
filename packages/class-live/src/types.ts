/**
 * Phase 5 classroom pack + LMS L0 identity bindings.
 * Votes and presence stay on the teacher process; keys prefer userId when set.
 */

export type LiveClassStatus = "live" | "ended";

export interface JoinPresence {
  liveClassId: string;
  /** Display name shown on the teacher roster. */
  studentLabel: string;
  /** Authenticated learner id when present (LMS L0+). */
  userId?: string;
  joinedAt: number;
  lastSeenAt: number;
}

export interface PredictVote {
  liveClassId: string;
  studentLabel: string;
  userId?: string;
  choice: string;
  at: number;
}

export interface LiveClassSession {
  id: string;
  joinCode: string;
  teacherLabel: string;
  /** Authenticated teacher id when present (LMS L0+). */
  teacherId?: string;
  schoolId?: string;
  status: LiveClassStatus;
  topicId?: string;
  createdAt: number;
  endedAt?: number;
  /** Freeze board + accept /join votes while true. */
  predictOpen: boolean;
  predictPrompt: string;
  predictChoices: string[];
  /** presenceKey → choice (last vote wins while Predict is open). */
  votes: Record<string, string>;
  /** presenceKey → presence (local-first roster). */
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
  teacherId?: string;
  schoolId?: string;
  topicId?: string;
  createdAt: number;
  endedAt?: number;
  status: LiveClassStatus;
  joinedCount: number;
  voteTotal: number;
  voteSummary: Record<string, number>;
}
