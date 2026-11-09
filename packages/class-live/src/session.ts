import type { LiveClassSession, PredictVote } from "./types";

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}`;
}

function joinCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return code;
}

/** In-memory local-first store — Phase 5 scaffold before WebSocket fan-out. */
const sessions = new Map<string, LiveClassSession>();
const byCode = new Map<string, string>();

export function createLiveClass(input: {
  teacherLabel: string;
  topicId?: string;
}): LiveClassSession {
  const session: LiveClassSession = {
    id: uid("live"),
    joinCode: joinCode(),
    teacherLabel: input.teacherLabel,
    status: "live",
    topicId: input.topicId,
    createdAt: Date.now(),
    predictOpen: false,
    votes: {},
  };
  sessions.set(session.id, session);
  byCode.set(session.joinCode, session.id);
  return session;
}

export function getLiveClass(id: string): LiveClassSession | undefined {
  return sessions.get(id);
}

export function getLiveClassByCode(code: string): LiveClassSession | undefined {
  const id = byCode.get(code.toUpperCase());
  return id ? sessions.get(id) : undefined;
}

export function setPredictOpen(id: string, open: boolean): LiveClassSession | undefined {
  const session = sessions.get(id);
  if (!session) return undefined;
  session.predictOpen = open;
  if (open) session.votes = {};
  return session;
}

export function castPredictVote(vote: PredictVote): LiveClassSession | { error: string } {
  const session = getLiveClassByCode(vote.liveClassId) ?? getLiveClass(vote.liveClassId);
  if (!session) return { error: "Live class not found" };
  if (session.status !== "live") return { error: "Class is not live" };
  if (!session.predictOpen) return { error: "Predict is closed" };
  session.votes[vote.studentLabel] = vote.choice;
  return session;
}

export function voteSummary(session: LiveClassSession): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const choice of Object.values(session.votes)) {
    counts[choice] = (counts[choice] ?? 0) + 1;
  }
  return counts;
}

export function endLiveClass(id: string): LiveClassSession | undefined {
  const session = sessions.get(id);
  if (!session) return undefined;
  session.status = "ended";
  session.predictOpen = false;
  return session;
}

/** Test helper */
export function __resetLiveClasses() {
  sessions.clear();
  byCode.clear();
}
