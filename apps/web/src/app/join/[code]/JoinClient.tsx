"use client";

import { useState } from "react";

const CHOICES = ["D > 0", "D = 0", "D < 0", "Not sure"];

export function JoinClient({ code }: { code: string }) {
  const [name, setName] = useState("");
  const [choice, setChoice] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function vote() {
    if (!name || !choice) return;
    const response = await fetch(`/api/join/${code}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentLabel: name, choice }),
    });
    const data = await response.json();
    setMessage(data.error ?? "Vote recorded on the teacher device (local-first).");
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ fontFamily: "var(--co-font-mono)", fontSize: 18 }}>{code}</div>
      <label style={{ display: "grid", gap: 6, fontSize: 13 }}>
        Your name (local only)
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          style={field}
        />
      </label>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {CHOICES.map((item) => (
          <button
            key={item}
            type="button"
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
              color: "var(--co-ink)",
              cursor: "pointer",
            }}
          >
            {item}
          </button>
        ))}
      </div>
      <button
        type="button"
        disabled={!name || !choice}
        onClick={vote}
        style={{
          minHeight: "var(--co-hit)",
          borderRadius: 10,
          border: "1px solid var(--co-accent)",
          background: "rgba(198, 242, 109, 0.12)",
          color: "var(--co-accent)",
          cursor: name && choice ? "pointer" : "not-allowed",
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

const field = {
  minHeight: "var(--co-hit)",
  borderRadius: 10,
  border: "1px solid var(--co-border)",
  background: "var(--co-bg-elevated)",
  color: "var(--co-ink)",
  padding: "0 12px",
} as const;
