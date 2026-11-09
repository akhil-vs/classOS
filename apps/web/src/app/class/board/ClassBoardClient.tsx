"use client";

import { BoardShell, useBoardStore } from "@classos/board-core";
import type { TeacherLiveSnapshot } from "@classos/class-live";
import { WidgetHost } from "@classos/widgets";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const PILOT_TOPICS = [
  {
    id: "math.10.quadratic-equations.discriminant",
    label: "Quadratic · discriminant",
    prompt: "What is the discriminant?",
    choices: ["D > 0", "D = 0", "D < 0", "Not sure"],
  },
  {
    id: "chem.10.chemical-reactions.balancing",
    label: "Reactions · balancing",
    prompt: "Is this equation balanced?",
    choices: ["Yes", "No", "Need more atoms", "Not sure"],
  },
] as const;

type PilotTopic = (typeof PILOT_TOPICS)[number];

export function ClassBoardClient() {
  const [session, setSession] = useState<TeacherLiveSnapshot | null>(null);
  const [busy, setBusy] = useState(false);
  const [topic, setTopic] = useState<PilotTopic>(PILOT_TOPICS[0]);
  const [error, setError] = useState<string | null>(null);
  const insertTemplate = useBoardStore((s) => s.insertTemplate);
  const clearBoard = useBoardStore((s) => s.clearBoard);
  const setTopicId = useBoardStore((s) => s.setTopicId);

  const refresh = useCallback(async () => {
    if (!session?.id) return;
    const response = await fetch(`/api/class/live?id=${session.id}`);
    if (!response.ok) return;
    const data = (await response.json()) as TeacherLiveSnapshot;
    setSession(data);
  }, [session?.id]);

  useEffect(() => {
    if (!session || session.status !== "live") return;
    const timer = window.setInterval(() => {
      void refresh();
    }, 2000);
    return () => window.clearInterval(timer);
  }, [session, refresh]);

  useEffect(() => {
    if (!session) return;
    clearBoard();
    setTopicId(session.topicId);
    if (session.topicId?.includes("quadratic")) {
      insertTemplate("quadratic");
    } else if (session.topicId?.includes("chemical-reactions")) {
      insertTemplate("balancer");
    }
    // Seed once when the live session starts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.id]);

  async function startClass() {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/class/live", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teacherLabel: "Teacher",
          topicId: topic.id,
          predictPrompt: topic.prompt,
          predictChoices: [...topic.choices],
        }),
      });
      const data = (await response.json()) as TeacherLiveSnapshot & {
        error?: string;
      };
      if (!response.ok) {
        setError(data.error ?? "Could not start class");
        return;
      }
      setSession(data);
    } finally {
      setBusy(false);
    }
  }

  async function togglePredict() {
    if (!session || session.status !== "live") return;
    setError(null);
    const response = await fetch("/api/class/live", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: session.id,
        predictOpen: !session.predictOpen,
        predictPrompt: topic.prompt,
        predictChoices: [...topic.choices],
      }),
    });
    const data = (await response.json()) as TeacherLiveSnapshot & {
      error?: string;
    };
    if (!response.ok) {
      setError(data.error ?? "Predict update failed");
      return;
    }
    setSession(data);
  }

  async function endClass() {
    if (!session) return;
    setError(null);
    const response = await fetch("/api/class/live", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: session.id, action: "end" }),
    });
    const data = (await response.json()) as TeacherLiveSnapshot & {
      error?: string;
    };
    if (!response.ok) {
      setError(data.error ?? "Could not end class");
      return;
    }
    setSession(data);
  }

  if (!session) {
    return (
      <div style={{ padding: 24, maxWidth: 720, margin: "0 auto", display: "grid", gap: 16 }}>
        <h1 style={{ fontFamily: "var(--co-font-brand)", letterSpacing: "-0.03em", margin: 0 }}>
          Classroom board
        </h1>
        <p style={{ color: "var(--co-ink-muted)", margin: 0, lineHeight: 1.5 }}>
          Phase 5 local-first pack: start a live session on this device, share a
          join code, open Predict, then end class. Votes stay on the teacher
          process — no cloud student sync.
        </p>
        <label style={{ display: "grid", gap: 6, fontSize: 13 }}>
          Pilot topic
          <select
            value={topic.id}
            onChange={(event) => {
              const next = PILOT_TOPICS.find((item) => item.id === event.target.value);
              if (next) setTopic(next);
            }}
            style={field}
          >
            {PILOT_TOPICS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <button type="button" disabled={busy} onClick={startClass} style={primary}>
          {busy ? "Starting…" : "Start local live session"}
        </button>
        {error && <div style={{ color: "var(--co-warn)", fontSize: 13 }}>{error}</div>}
      </div>
    );
  }

  const voteEntries = Object.entries(session.voteSummary ?? {});

  return (
    <BoardShell
      mode="classroom"
      inkFrozen={session.predictOpen && session.status === "live"}
      assumption={`${topic.label} · engines calculate, AI only narrates`}
      renderWidget={(widget) => <WidgetHost kind={widget.kind} />}
      liveBar={
        <div
          style={{
            borderTop: "1px solid var(--co-border)",
            padding: "12px 16px",
            display: "grid",
            gap: 10,
            background: "rgba(15, 20, 25, 0.96)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ color: "var(--co-ink-muted)", fontSize: 12 }}>Join code</div>
              <div
                style={{
                  fontFamily: "var(--co-font-brand)",
                  fontSize: 32,
                  letterSpacing: "0.14em",
                }}
              >
                {session.joinCode}
              </div>
              <div style={{ fontSize: 13, color: "var(--co-ink-muted)" }}>
                Students open <code>/join/{session.joinCode}</code>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {session.status === "live" ? (
                <>
                  <button type="button" onClick={togglePredict} style={primary}>
                    {session.predictOpen ? "Close Predict" : "Open Predict"}
                  </button>
                  <button type="button" onClick={endClass} style={secondary}>
                    End class
                  </button>
                </>
              ) : (
                <Link href="/school" style={primary}>
                  School pilot summary →
                </Link>
              )}
            </div>
          </div>
          <div style={{ fontSize: 14 }}>
            Live: {session.joinedCount} joined ·{" "}
            {session.status === "ended"
              ? "ended"
              : session.predictOpen
                ? "Predict open"
                : "Predict closed"}
            {" · "}
            Votes:{" "}
            {voteEntries.length === 0
              ? "none yet"
              : voteEntries.map(([choice, count]) => `${choice} (${count})`).join(" · ")}
          </div>
          {error && <div style={{ color: "var(--co-warn)", fontSize: 13 }}>{error}</div>}
        </div>
      }
    />
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
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
} as const;

const secondary = {
  ...primary,
  border: "1px solid var(--co-border)",
  background: "transparent",
  color: "var(--co-ink)",
} as const;

const field = {
  minHeight: "var(--co-hit)",
  borderRadius: 10,
  border: "1px solid var(--co-border)",
  background: "var(--co-bg-elevated)",
  color: "var(--co-ink)",
  padding: "0 12px",
} as const;
