"use client";

import {
  createPilotNote,
  PILOT_NOTE_CATEGORIES,
  PILOT_NOTES_STORAGE_KEY,
  type PilotNote,
  type PilotNoteCategory,
} from "@classos/curriculum";
import { useEffect, useState, type CSSProperties, type FormEvent } from "react";

function loadNotes(): PilotNote[] {
  try {
    const raw = window.localStorage.getItem(PILOT_NOTES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as PilotNote[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveNotes(notes: PilotNote[]) {
  window.localStorage.setItem(PILOT_NOTES_STORAGE_KEY, JSON.stringify(notes));
}

export function PilotNotesClient() {
  const [notes, setNotes] = useState<PilotNote[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setNotes(loadNotes());
  }, []);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const body = String(data.get("body") ?? "").trim();
    const category = String(data.get("category") ?? "other") as PilotNoteCategory;
    const phase = Number(data.get("phase") ?? 4) as 4 | 5 | 6;
    if (!body) {
      setError("Add an observation before saving.");
      return;
    }
    const next = [
      createPilotNote({ category, body, phase }),
      ...notes,
    ].slice(0, 100);
    setNotes(next);
    saveNotes(next);
    setError(null);
    form.reset();
  }

  function clearNotes() {
    setNotes([]);
    saveNotes([]);
  }

  return (
    <section style={{ display: "grid", gap: 16 }}>
      <form style={{ display: "grid", gap: 12 }} onSubmit={onSubmit}>
        <label style={{ display: "grid", gap: 6, fontSize: 13 }}>
          Phase
          <select name="phase" defaultValue={4} style={field}>
            <option value={4}>4 · Learner pilot</option>
            <option value={5}>5 · Classroom pack</option>
            <option value={6}>6 · School pilot</option>
          </select>
        </label>
        <label style={{ display: "grid", gap: 6, fontSize: 13 }}>
          Category
          <select name="category" defaultValue="chip_noise" style={field}>
            {PILOT_NOTE_CATEGORIES.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label style={{ display: "grid", gap: 6, fontSize: 13 }}>
          What did you observe?
          <textarea
            name="body"
            rows={4}
            placeholder="e.g. chip fired on scribble; geometry template unused; offline banner stayed after reconnect"
            style={{ ...field, minHeight: 96, padding: 12, resize: "vertical" }}
          />
        </label>
        {error && (
          <div style={{ color: "var(--co-warn)", fontSize: 13 }}>{error}</div>
        )}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button type="submit" style={primaryBtn}>
            Save note
          </button>
          <button type="button" onClick={clearNotes} style={secondaryBtn}>
            Clear local notes
          </button>
        </div>
      </form>

      <div style={{ display: "grid", gap: 10 }}>
        <div
          style={{
            fontSize: 12,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--co-ink-muted)",
          }}
        >
          Device-local evidence ({notes.length})
        </div>
        {notes.length === 0 ? (
          <p style={{ color: "var(--co-ink-muted)", margin: 0, fontSize: 14 }}>
            No notes yet. Capture chip noise, unused templates, units vs
            assumptions, offline banner, and classroom `/join` observations
            before Class 11–12 breadth expands further.
          </p>
        ) : (
          notes.map((note) => {
            const label =
              PILOT_NOTE_CATEGORIES.find((item) => item.id === note.category)
                ?.label ?? note.category;
            return (
              <article
                key={note.id}
                style={{
                  borderTop: "1px solid var(--co-border)",
                  paddingTop: 12,
                  display: "grid",
                  gap: 4,
                }}
              >
                <div style={{ fontSize: 12, color: "var(--co-ink-muted)" }}>
                  Phase {note.phase} · {label} ·{" "}
                  {new Date(note.at).toLocaleString()}
                </div>
                <div style={{ fontSize: 14, lineHeight: 1.45 }}>{note.body}</div>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}

const field: CSSProperties = {
  minHeight: "var(--co-hit)",
  borderRadius: 10,
  border: "1px solid var(--co-border)",
  background: "var(--co-bg-elevated)",
  color: "var(--co-ink)",
  padding: "0 12px",
};

const primaryBtn: CSSProperties = {
  minHeight: "var(--co-hit)",
  padding: "0 16px",
  borderRadius: 999,
  border: "none",
  background: "var(--co-accent)",
  color: "#142016",
  fontWeight: 600,
  cursor: "pointer",
};

const secondaryBtn: CSSProperties = {
  minHeight: "var(--co-hit)",
  padding: "0 16px",
  borderRadius: 999,
  border: "1px solid var(--co-border)",
  background: "transparent",
  color: "var(--co-ink)",
  cursor: "pointer",
};
