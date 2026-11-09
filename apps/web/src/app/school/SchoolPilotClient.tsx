"use client";

import type { SchoolSessionSummary } from "@classos/class-live";
import { useEffect, useState } from "react";

export function SchoolPilotClient() {
  const [sessions, setSessions] = useState<SchoolSessionSummary[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const response = await fetch("/api/class/live?list=school");
      const data = (await response.json()) as {
        sessions?: SchoolSessionSummary[];
        error?: string;
      };
      if (cancelled) return;
      if (!response.ok) {
        setError(data.error ?? "Could not load local sessions");
        return;
      }
      setSessions(data.sessions ?? []);
    }
    void load();
    const timer = window.setInterval(() => {
      void load();
    }, 4000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);

  return (
    <section style={{ display: "grid", gap: 12 }}>
      <h2
        style={{
          fontFamily: "var(--co-font-brand)",
          fontSize: 20,
          letterSpacing: "-0.02em",
          margin: 0,
        }}
      >
        Local session summaries
      </h2>
      <p style={{ color: "var(--co-ink-muted)", margin: 0, fontSize: 14, lineHeight: 1.45 }}>
        School-scoped, device-local only. No cross-school marketplace or cloud
        student sync in this pilot.
      </p>
      {error && <div style={{ color: "var(--co-warn)", fontSize: 13 }}>{error}</div>}
      {sessions.length === 0 ? (
        <div style={{ color: "var(--co-ink-muted)", fontSize: 14 }}>
          No live or ended sessions on this device yet. Start one from the
          classroom board.
        </div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10 }}>
          {sessions.map((session) => (
            <li
              key={session.id}
              style={{
                borderTop: "1px solid var(--co-border)",
                paddingTop: 12,
                display: "grid",
                gap: 4,
              }}
            >
              <div>
                <strong>{session.joinCode}</strong> · {session.status} ·{" "}
                {session.teacherLabel}
              </div>
              <div style={{ color: "var(--co-ink-muted)", fontSize: 13 }}>
                {session.topicId ?? "no topic"} · {session.joinedCount} joined ·{" "}
                {session.voteTotal} vote(s)
                {Object.keys(session.voteSummary).length > 0
                  ? ` · ${Object.entries(session.voteSummary)
                      .map(([choice, count]) => `${choice} (${count})`)
                      .join(", ")}`
                  : ""}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
