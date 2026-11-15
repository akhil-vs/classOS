"use client";

import { useCallback, useEffect, useState } from "react";
import { InviteForm } from "./InviteForm";

type Member = {
  userId: string;
  email: string;
  name: string;
  role: string;
  status: string;
};

type Pending = {
  id: string;
  email: string;
  role: string;
  expiresAt: number;
};

export function SchoolAdminClient() {
  const [members, setMembers] = useState<Member[]>([]);
  const [pending, setPending] = useState<Pending[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const response = await fetch("/api/school/members");
    const data = (await response.json()) as {
      members?: Member[];
      pendingInvites?: Pending[];
      error?: string;
    };
    if (!response.ok) {
      setError(data.error ?? "Could not load roster");
      return;
    }
    setError(null);
    setMembers(data.members ?? []);
    setPending(data.pendingInvites ?? []);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <section style={{ display: "grid", gap: 16, marginBottom: 28 }}>
      <h2
        style={{
          fontFamily: "var(--co-font-brand)",
          fontSize: 20,
          letterSpacing: "-0.02em",
          margin: 0,
        }}
      >
        Roster & invites
      </h2>
      <InviteForm onCreated={() => void load()} />
      {error && <div style={{ color: "var(--co-warn)", fontSize: 13 }}>{error}</div>}
      <div style={{ display: "grid", gap: 8 }}>
        {members.map((member) => (
          <div
            key={member.userId}
            style={{
              borderTop: "1px solid var(--co-border)",
              paddingTop: 10,
              fontSize: 14,
            }}
          >
            <strong>{member.name}</strong> · {member.role} · {member.email}
          </div>
        ))}
      </div>
      {pending.length > 0 && (
        <div style={{ display: "grid", gap: 6 }}>
          <div
            style={{
              fontSize: 12,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--co-ink-muted)",
            }}
          >
            Pending invites
          </div>
          {pending.map((invite) => (
            <div key={invite.id} style={{ fontSize: 13, color: "var(--co-ink-muted)" }}>
              {invite.email} · {invite.role}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
