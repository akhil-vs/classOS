"use client";

import { useState } from "react";

export function ClassBoardClient() {
  const [session, setSession] = useState<{
    id: string;
    joinCode: string;
    predictOpen: boolean;
    votes: Record<string, number>;
  } | null>(null);
  const [busy, setBusy] = useState(false);

  async function startClass() {
    setBusy(true);
    try {
      const response = await fetch("/api/class/live", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teacherLabel: "Teacher" }),
      });
      const data = await response.json();
      setSession({
        id: data.id,
        joinCode: data.joinCode,
        predictOpen: false,
        votes: {},
      });
    } finally {
      setBusy(false);
    }
  }

  async function togglePredict() {
    if (!session) return;
    const response = await fetch("/api/class/live", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: session.id,
        predictOpen: !session.predictOpen,
      }),
    });
    const data = await response.json();
    setSession({
      id: data.id,
      joinCode: data.joinCode,
      predictOpen: data.predictOpen,
      votes: data.voteSummary ?? {},
    });
  }

  async function refreshVotes() {
    if (!session) return;
    const response = await fetch(`/api/class/live?id=${session.id}`);
    const data = await response.json();
    setSession({
      id: data.id,
      joinCode: data.joinCode,
      predictOpen: data.predictOpen,
      votes: data.voteSummary ?? {},
    });
  }

  return (
    <div style={{ padding: 24, maxWidth: 720, margin: "0 auto", display: "grid", gap: 16 }}>
      <h1 style={{ fontFamily: "var(--co-font-brand)", letterSpacing: "-0.03em" }}>
        Classroom board
      </h1>
      <p style={{ color: "var(--co-ink-muted)", margin: 0 }}>
        Phase 5 local-first pack: start a live session, share a join code, open
        Predict. Full projection chrome and WebSocket fan-out follow the learner
        pilot.
      </p>
      {!session ? (
        <button type="button" disabled={busy} onClick={startClass} style={primary}>
          {busy ? "Starting…" : "Start local live session"}
        </button>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          <div
            style={{
              border: "1px solid var(--co-border)",
              borderRadius: 12,
              padding: 16,
              background: "var(--co-panel)",
            }}
          >
            <div style={{ color: "var(--co-ink-muted)", fontSize: 13 }}>Join code</div>
            <div
              style={{
                fontFamily: "var(--co-font-brand)",
                fontSize: 40,
                letterSpacing: "0.12em",
              }}
            >
              {session.joinCode}
            </div>
            <div style={{ fontSize: 13 }}>
              Students open <code>/join/{session.joinCode}</code>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button type="button" onClick={togglePredict} style={primary}>
              {session.predictOpen ? "Close Predict" : "Open Predict"}
            </button>
            <button type="button" onClick={refreshVotes} style={secondary}>
              Refresh votes
            </button>
          </div>
          <div style={{ fontSize: 14 }}>
            Votes:{" "}
            {Object.keys(session.votes).length === 0
              ? "none yet"
              : Object.entries(session.votes)
                  .map(([choice, count]) => `${choice} (${count})`)
                  .join(" · ")}
          </div>
        </div>
      )}
    </div>
  );
}

const primary = {
  minHeight: "var(--co-hit)",
  padding: "0 16px",
  borderRadius: 999,
  border: "1px solid var(--co-accent)",
  background: "rgba(198, 242, 109, 0.14)",
  color: "var(--co-accent)",
  cursor: "pointer",
} as const;

const secondary = {
  ...primary,
  border: "1px solid var(--co-border)",
  background: "transparent",
  color: "var(--co-ink)",
} as const;
