"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm({ next }: { next: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("teacher@demo.classos");
  const [password, setPassword] = useState("demo-teacher");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await response.json()) as {
        error?: string;
        user?: { role: string };
      };
      if (!response.ok) {
        setError(data.error ?? "Sign in failed");
        return;
      }
      const destination =
        next && next !== "/"
          ? next
          : data.user?.role === "teacher"
            ? "/class/board"
            : data.user?.role === "school_admin"
              ? "/school"
              : data.user?.role === "platform_author"
                ? "/author"
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
        <input
          type="email"
          autoComplete="username"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          style={field}
        />
      </label>
      <label style={{ display: "grid", gap: 6, fontSize: 13 }}>
        Password
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          style={field}
        />
      </label>
      {error && (
        <div style={{ color: "var(--co-warn)", fontSize: 13 }}>{error}</div>
      )}
      <button type="submit" disabled={busy} style={primary}>
        {busy ? "Signing in…" : "Sign in"}
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
