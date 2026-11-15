"use client";

import { useState } from "react";

export function InviteForm({ onCreated }: { onCreated?: () => void }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"student" | "teacher" | "school_admin">(
    "student",
  );
  const [message, setMessage] = useState<string | null>(null);
  const [acceptUrl, setAcceptUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage(null);
    setAcceptUrl(null);
    try {
      const response = await fetch("/api/school/invites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });
      const data = (await response.json()) as {
        error?: string;
        acceptUrl?: string;
      };
      if (!response.ok) {
        setMessage(data.error ?? "Invite failed");
        return;
      }
      setAcceptUrl(data.acceptUrl ?? null);
      setMessage("Invite created — share the link with the new user.");
      setEmail("");
      onCreated?.();
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <input
          type="email"
          required
          placeholder="email@school.edu"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          style={field}
        />
        <select
          value={role}
          onChange={(event) =>
            setRole(event.target.value as typeof role)
          }
          style={{ ...field, width: "auto" }}
        >
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="school_admin">School admin</option>
        </select>
        <button type="submit" disabled={busy} style={primary}>
          {busy ? "…" : "Invite"}
        </button>
      </div>
      {message && (
        <div style={{ color: "var(--co-ink-muted)", fontSize: 13 }}>{message}</div>
      )}
      {acceptUrl && (
        <code
          style={{
            fontSize: 12,
            wordBreak: "break-all",
            color: "var(--co-accent)",
          }}
        >
          {acceptUrl}
        </code>
      )}
    </form>
  );
}

const field = {
  minHeight: "var(--co-hit)",
  borderRadius: 10,
  border: "1px solid var(--co-border)",
  background: "var(--co-bg-elevated)",
  color: "var(--co-ink)",
  padding: "0 12px",
  flex: 1,
} as const;

const primary = {
  minHeight: "var(--co-hit)",
  borderRadius: 10,
  border: "1px solid var(--co-accent)",
  background: "rgba(198, 242, 109, 0.14)",
  color: "var(--co-accent)",
  padding: "0 14px",
  cursor: "pointer",
} as const;
