import { BrandMark } from "@classos/ui";
import Link from "next/link";
import type { CSSProperties } from "react";
import { AuthBar } from "../../components/AuthBar";
import { readSessionFromCookies } from "../../lib/auth";

export default async function SettingsPage() {
  const session = await readSessionFromCookies();

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "24px 16px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <BrandMark />
        <AuthBar />
      </div>
      <h1
        style={{
          fontFamily: "var(--co-font-brand)",
          letterSpacing: "-0.03em",
          marginTop: 24,
        }}
      >
        Settings
      </h1>
      <p style={{ color: "var(--co-ink-muted)" }}>
        Language and input preferences. Account sign-in is live (LMS L0) —
        preferences still persist locally for now.
      </p>
      {session ? (
        <p style={{ fontSize: 14 }}>
          Signed in as <strong>{session.user.email}</strong> ({session.user.role}
          {session.user.schoolName ? ` · ${session.user.schoolName}` : ""}).
        </p>
      ) : (
        <p style={{ fontSize: 14 }}>
          <Link href="/login" style={{ color: "var(--co-accent)" }}>
            Sign in
          </Link>{" "}
          to use classroom, progress, and school surfaces.
        </p>
      )}
      <form style={{ display: "grid", gap: 16, marginTop: 24 }}>
        <label style={{ display: "grid", gap: 8 }}>
          Language
          <select defaultValue="en" style={field}>
            <option value="en">English</option>
            <option value="hi">Hindi</option>
          </select>
        </label>
        <label style={{ display: "grid", gap: 8 }}>
          Preferred input
          <select defaultValue="auto" style={field}>
            <option value="auto">Auto (touch + mouse/keyboard)</option>
            <option value="touch">Prefer touch controls</option>
            <option value="keyboard">Prefer keyboard entry</option>
          </select>
        </label>
        <label style={{ display: "grid", gap: 8 }}>
          Text size
          <select defaultValue="md" style={field}>
            <option value="sm">Small</option>
            <option value="md">Medium</option>
            <option value="lg">Large</option>
          </select>
        </label>
      </form>
      <p style={{ marginTop: 24 }}>
        <Link href="/" style={{ color: "var(--co-accent)" }}>
          ← Back home
        </Link>
      </p>
    </main>
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
