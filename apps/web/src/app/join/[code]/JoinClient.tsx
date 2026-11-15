"use client";

import type { StudentJoinSnapshot } from "@classos/class-live";
import { useCallback, useEffect, useState } from "react";

export function JoinClient({
  code,
  studentName,
}: {
  code: string;
  studentName: string;
}) {
  const [choice, setChoice] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [session, setSession] = useState<StudentJoinSnapshot | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [joined, setJoined] = useState(false);

  const loadSession = useCallback(async () => {
    const response = await fetch(`/api/join/${code}`);
    const data = (await response.json()) as StudentJoinSnapshot & {
      error?: string;
    };
    if (!response.ok) {
      setLoadError(data.error ?? "Join code not found");
      setSession(null);
      return;
    }
    setLoadError(null);
    setSession(data);
  }, [code]);

  useEffect(() => {
    void loadSession();
    const timer = window.setInterval(() => {
      void loadSession();
    }, 2500);
    return () => window.clearInterval(timer);
  }, [loadSession]);

  useEffect(() => {
    if (!joined || !session || session.status !== "live") return;
    const beat = window.setInterval(() => {
      void fetch(`/api/join/${code}/presence`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
    }, 10_000);
    return () => window.clearInterval(beat);
  }, [joined, session, code]);

  async function joinPresence() {
    setMessage(null);
    const response = await fetch(`/api/join/${code}/presence`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const data = (await response.json()) as {
      error?: string;
      session?: StudentJoinSnapshot;
    };
    if (!response.ok) {
      setMessage(data.error ?? "Could not join");
      return;
    }
    setJoined(true);
    if (data.session) setSession(data.session);
    setMessage("Joined. Waiting for Predict…");
  }

  async function vote() {
    if (!choice) return;
    setMessage(null);
    const response = await fetch(`/api/join/${code}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ choice }),
    });
    const data = (await response.json()) as {
      error?: string;
      session?: StudentJoinSnapshot;
    };
    if (!response.ok) {
      setMessage(data.error ?? "Vote failed");
      return;
    }
    setJoined(true);
    if (data.session) setSession(data.session);
    setMessage("Vote recorded on the teacher device.");
  }

  if (loadError) {
    return (
      <div style={{ color: "var(--co-warn)", fontSize: 14 }}>
        {loadError}. Ask your teacher to start a live class.
      </div>
    );
  }

  if (!session) {
    return (
      <div style={{ color: "var(--co-ink-muted)", fontSize: 14 }}>
        Looking up class…
      </div>
    );
  }

  const ended = session.status === "ended";
  const canVote = session.predictOpen && !ended;
  const choices = session.predictChoices;

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ fontFamily: "var(--co-font-mono)", fontSize: 18 }}>{code}</div>
      <div style={{ color: "var(--co-ink-muted)", fontSize: 13, lineHeight: 1.45 }}>
        {session.teacherLabel}
        {" · "}
        Joining as <strong style={{ color: "var(--co-ink)" }}>{studentName}</strong>
        {" · "}
        {ended
          ? "Class ended"
          : session.predictOpen
            ? "Predict open — pick then send"
            : "Waiting for teacher to open Predict"}
        {" · "}
        {session.joinedCount} joined
      </div>

      {!joined && !ended && (
        <button type="button" onClick={joinPresence} style={secondary}>
          Join class
        </button>
      )}

      <div style={{ fontFamily: "var(--co-font-brand)", fontSize: 18 }}>
        {session.predictPrompt}
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {choices.map((item) => (
          <button
            key={item}
            type="button"
            disabled={!canVote}
            onClick={() => setChoice(item)}
            style={{
              minHeight: "var(--co-hit)",
              padding: "0 12px",
              borderRadius: 999,
              border:
                choice === item
                  ? "1px solid var(--co-accent)"
                  : "1px solid var(--co-border)",
              background: "transparent",
              color: canVote ? "var(--co-ink)" : "var(--co-ink-muted)",
              cursor: canVote ? "pointer" : "not-allowed",
            }}
          >
            {item}
          </button>
        ))}
      </div>

      <button
        type="button"
        disabled={!canVote || !choice}
        onClick={vote}
        style={{
          minHeight: "var(--co-hit)",
          borderRadius: 10,
          border: "1px solid var(--co-accent)",
          background: "rgba(198, 242, 109, 0.12)",
          color: "var(--co-accent)",
          cursor: canVote && choice ? "pointer" : "not-allowed",
        }}
      >
        Send Predict vote
      </button>

      {message && (
        <div style={{ color: "var(--co-ink-muted)", fontSize: 13 }}>{message}</div>
      )}
    </div>
  );
}

const secondary = {
  minHeight: "var(--co-hit)",
  borderRadius: 10,
  border: "1px solid var(--co-border)",
  background: "transparent",
  color: "var(--co-ink)",
  cursor: "pointer",
} as const;
