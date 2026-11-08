"use client";

import { useRouter } from "next/navigation";
import { useState, type CSSProperties } from "react";

export function AuthStubControls() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function signIn() {
    setBusy(true);
    await fetch("/api/auth/stub", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "signin", name: "demo" }),
    });
    setBusy(false);
    router.refresh();
  }

  async function signOut() {
    setBusy(true);
    await fetch("/api/auth/stub", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "signout" }),
    });
    setBusy(false);
    router.refresh();
  }

  return (
    <div style={{ display: "flex", gap: 8 }}>
      <button type="button" disabled={busy} onClick={() => void signIn()} style={chip}>
        Sign in stub
      </button>
      <button type="button" disabled={busy} onClick={() => void signOut()} style={chip}>
        Sign out
      </button>
    </div>
  );
}

const chip: CSSProperties = {
  minHeight: 40,
  display: "inline-flex",
  alignItems: "center",
  padding: "0 12px",
  borderRadius: 999,
  border: "1px solid var(--co-border)",
  background: "transparent",
  color: "var(--co-ink)",
  cursor: "pointer",
};
