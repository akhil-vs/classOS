"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/");
        router.refresh();
      }}
      style={{
        minHeight: 36,
        padding: "0 12px",
        borderRadius: 8,
        border: "1px solid var(--co-border)",
        background: "transparent",
        color: "var(--co-ink)",
        cursor: "pointer",
        fontSize: 13,
      }}
    >
      Sign out
    </button>
  );
}
