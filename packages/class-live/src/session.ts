import type {
  JoinPresence,
  LiveClassSession,
  PredictVote,
  SchoolSessionSummary,
  StudentJoinSnapshot,
  TeacherLiveSnapshot,
} from "./types";

const DEFAULT_CHOICES = ["D > 0", "D = 0", "D < 0", "Not sure"];
const DEFAULT_PROMPT = "What is the discriminant?";
const PRESENCE_STALE_MS = 45_000;

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

function normalizeLabel(label: string): string {
  return label.trim().replace(/\s+/g, " ").slice(0, 40);
}

function normalizeCode(code: string): string {
  return code.trim().toUpperCase();
}

/** In-memory local-first store — single teacher device / process. */
const sessions = new Map<string, LiveClassSession>();
const byCode = new Map<string, string>();

function allocateJoinCode(): string {
  for (let attempt = 0; attempt < 32; attempt++) {
    const code = joinCode();
    if (!byCode.has(code)) return code;
  }
  throw new Error("Unable to allocate join code");
}

function pruneStalePresence(session: LiveClassSession, now = Date.now()) {
  for (const [label, presence] of Object.entries(session.presence)) {
    if (now - presence.lastSeenAt > PRESENCE_STALE_MS) {
      delete session.presence[label];
    }
  }
}

export function createLiveClass(input: {
  teacherLabel: string;
  topicId?: string;
  predictPrompt?: string;
  predictChoices?: string[];
}): LiveClassSession {
  const code = allocateJoinCode();
  const choices =
    input.predictChoices?.map((c) => c.trim()).filter(Boolean) ?? DEFAULT_CHOICES;
  const session: LiveClassSession = {
    id: uid("live"),
    joinCode: code,
    teacherLabel: normalizeLabel(input.teacherLabel) || "Teacher",
    status: "live",
    topicId: input.topicId,
    createdAt: Date.now(),
    predictOpen: false,
    predictPrompt: input.predictPrompt?.trim() || DEFAULT_PROMPT,
    predictChoices: choices.length > 0 ? choices : [...DEFAULT_CHOICES],
    votes: {},
    presence: {},
  };
  sessions.set(session.id, session);
  byCode.set(session.joinCode, session.id);
  return session;
}

export function getLiveClass(id: string): LiveClassSession | undefined {
  const session = sessions.get(id);
  if (session) pruneStalePresence(session);
  return session;
}

export function getLiveClassByCode(code: string): LiveClassSession | undefined {
  const id = byCode.get(normalizeCode(code));
  return id ? getLiveClass(id) : undefined;
}

export function setPredictOpen(
  id: string,
  open: boolean,
  options?: { prompt?: string; choices?: string[] },
): LiveClassSession | { error: string } {
  const session = getLiveClass(id);
  if (!session) return { error: "Live class not found" };
  if (session.status !== "live") return { error: "Class is not live" };

  if (options?.prompt?.trim()) {
    session.predictPrompt = options.prompt.trim();
  }
  if (options?.choices) {
    const cleaned = options.choices.map((c) => c.trim()).filter(Boolean);
    if (cleaned.length > 0) session.predictChoices = cleaned;
  }

  session.predictOpen = open;
  if (open) session.votes = {};
  return session;
}

export function castPredictVote(
  vote: PredictVote,
): LiveClassSession | { error: string } {
  const session =
    getLiveClassByCode(vote.liveClassId) ?? getLiveClass(vote.liveClassId);
  if (!session) return { error: "Live class not found" };
  if (session.status !== "live") return { error: "Class is not live" };
  if (!session.predictOpen) return { error: "Predict is closed" };

  const studentLabel = normalizeLabel(vote.studentLabel);
  if (!studentLabel) return { error: "Student name required" };

  const choice = vote.choice.trim();
  if (!session.predictChoices.includes(choice)) {
    return { error: "Choice is not on the Predict board" };
  }

  session.votes[studentLabel] = choice;
  // Voting implies presence.
  const now = vote.at || Date.now();
  session.presence[studentLabel] = {
    liveClassId: session.id,
    studentLabel,
    joinedAt: session.presence[studentLabel]?.joinedAt ?? now,
    lastSeenAt: now,
  };
  return session;
}

export function registerPresence(input: {
  liveClassId: string;
  studentLabel: string;
}): JoinPresence | { error: string } {
  const session =
    getLiveClassByCode(input.liveClassId) ?? getLiveClass(input.liveClassId);
  if (!session) return { error: "Live class not found" };
  if (session.status !== "live") return { error: "Class is not live" };

  const studentLabel = normalizeLabel(input.studentLabel);
  if (!studentLabel) return { error: "Student name required" };

  const now = Date.now();
  const existing = session.presence[studentLabel];
  const presence: JoinPresence = {
    liveClassId: session.id,
    studentLabel,
    joinedAt: existing?.joinedAt ?? now,
    lastSeenAt: now,
  };
  session.presence[studentLabel] = presence;
  return presence;
}

export function voteSummary(session: LiveClassSession): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const choice of Object.values(session.votes)) {
    counts[choice] = (counts[choice] ?? 0) + 1;
  }
  return counts;
}

export function joinedCount(session: LiveClassSession): number {
  pruneStalePresence(session);
  return Object.keys(session.presence).length;
}

export function toTeacherSnapshot(session: LiveClassSession): TeacherLiveSnapshot {
  return {
    ...session,
    voteSummary: voteSummary(session),
    joinedCount: joinedCount(session),
  };
}

export function toStudentSnapshot(session: LiveClassSession): StudentJoinSnapshot {
  return {
    id: session.id,
    joinCode: session.joinCode,
    status: session.status,
    topicId: session.topicId,
    teacherLabel: session.teacherLabel,
    predictOpen: session.predictOpen,
    predictPrompt: session.predictPrompt,
    predictChoices: session.predictChoices,
    joinedCount: joinedCount(session),
  };
}

export function endLiveClass(id: string): LiveClassSession | { error: string } {
  const session = getLiveClass(id);
  if (!session) return { error: "Live class not found" };
  if (session.status === "ended") return session;
  session.status = "ended";
  session.predictOpen = false;
  session.endedAt = Date.now();
  return session;
}

export function listSchoolSessionSummaries(): SchoolSessionSummary[] {
  return [...sessions.values()]
    .map((session) => ({
      id: session.id,
      joinCode: session.joinCode,
      teacherLabel: session.teacherLabel,
      topicId: session.topicId,
      createdAt: session.createdAt,
      endedAt: session.endedAt,
      status: session.status,
      joinedCount: joinedCount(session),
      voteTotal: Object.keys(session.votes).length,
      voteSummary: voteSummary(session),
    }))
    .sort((a, b) => b.createdAt - a.createdAt);
}

/** Test helper */
export function __resetLiveClasses() {
  sessions.clear();
  byCode.clear();
}

export const __PRESENCE_STALE_MS = PRESENCE_STALE_MS;
