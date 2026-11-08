export interface ProgressEntry {
  topicId: string;
  attempts: number;
  correct: number;
  lastAt: number;
}

/** In-memory learner progress for the auth stub phase. */
const byUser = new Map<string, Map<string, ProgressEntry>>();

export function recordAttempt(
  userId: string,
  topicId: string,
  correct: boolean,
) {
  const user = byUser.get(userId) ?? new Map<string, ProgressEntry>();
  const prev = user.get(topicId) ?? {
    topicId,
    attempts: 0,
    correct: 0,
    lastAt: 0,
  };
  const next: ProgressEntry = {
    topicId,
    attempts: prev.attempts + 1,
    correct: prev.correct + (correct ? 1 : 0),
    lastAt: Date.now(),
  };
  user.set(topicId, next);
  byUser.set(userId, user);
  return next;
}

export function listProgress(userId: string): ProgressEntry[] {
  const user = byUser.get(userId);
  if (!user) return [];
  return [...user.values()].sort((a, b) => b.lastAt - a.lastAt);
}

export function mastery(entry: ProgressEntry) {
  if (entry.attempts === 0) return 0;
  return Math.round((entry.correct / entry.attempts) * 100);
}
