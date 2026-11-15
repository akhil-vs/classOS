"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AcceptInviteForm({
  token,
  email,
}: {
  token: string;
  email: string;
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/auth/invite/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, name, password }),
      });
      const data = (await response.json()) as {
        error?: string;
        user?: { role: string };
      };
      if (!response.ok) {
        setError(data.error ?? "Could not accept invite");
        return;
      }
      const destination =
        data.user?.role === "teacher"
          ? "/class/board"
          : data.user?.role === "school_admin"
            ? "/school"
            : "/";
      router.push(destination);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ display: "grid", gap: 14 }}>
      <label style={{ display: "grid", gap: 6, fontSize: 13 }}>
        Email
        <input value={email} disabled style={field} />
      </label>
      <label style={{ display: "grid", gap: 6, fontSize: 13 }}>
        Your name
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          style={field}
        />
      </label>
      <label style={{ display: "grid", gap: 6, fontSize: 13 }}>
        Password
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          minLength={8}
          style={field}
        />
      </label>
      {error && (
        <div style={{ color: "var(--co-warn)", fontSize: 13 }}>{error}</div>
      )}
      <button type="submit" disabled={busy} style={primary}>
        {busy ? "Creating account…" : "Join school"}
      </button>
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
} as const;

const primary = {
  minHeight: "var(--co-hit)",
  borderRadius: 10,
  border: "1px solid var(--co-accent)",
  background: "rgba(198, 242, 109, 0.16)",
  color: "var(--co-accent)",
  fontWeight: 600,
  cursor: "pointer",
} as const;
