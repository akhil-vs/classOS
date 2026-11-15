import Link from "next/link";
import { readSessionFromCookies } from "../lib/auth";
import { LogoutButton } from "./LogoutButton";

export async function AuthBar() {
  const session = await readSessionFromCookies();
  if (!session) {
    return (
      <div style={bar}>
        <Link href="/login" style={{ color: "var(--co-accent)" }}>
          Sign in
        </Link>
      </div>
    );
  }
  return (
    <div style={bar}>
      <span>
        {session.user.name}
        <span style={{ color: "var(--co-ink-muted)" }}>
          {" · "}
          {session.user.role}
          {session.user.schoolName ? ` · ${session.user.schoolName}` : ""}
        </span>
      </span>
      <LogoutButton />
    </div>
  );
}

const bar = {
  display: "flex",
  gap: 12,
  flexWrap: "wrap" as const,
  alignItems: "center",
  justifyContent: "space-between",
  fontSize: 13,
};
