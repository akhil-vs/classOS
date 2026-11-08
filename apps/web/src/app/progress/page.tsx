import { getTopicById } from "@classos/curriculum";
import { BrandMark } from "@classos/ui";
import { getLearnerId, learnerDisplayName } from "@/lib/auth";
import { listProgress, mastery } from "@/lib/progressStore";
import Link from "next/link";
import type { CSSProperties } from "react";
import { AuthStubControls } from "./AuthStubControls";

export default async function ProgressPage() {
  const learnerId = await getLearnerId();
  const entries = listProgress(learnerId);

  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: "24px 16px 48px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
          marginBottom: 20,
        }}
      >
        <BrandMark />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Link href="/browse" style={chip}>
            Browse
          </Link>
          <AuthStubControls />
        </div>
      </div>

      <h1
        style={{
          fontFamily: "var(--co-font-brand)",
          letterSpacing: "-0.03em",
          marginBottom: 8,
        }}
      >
        Progress
      </h1>
      <p style={{ color: "var(--co-ink-muted)" }}>
        {learnerDisplayName(learnerId)} · private to this device/session (auth
        stub). Weak-topic reports stay school-scoped later.
      </p>

      {entries.length === 0 ? (
        <p style={{ marginTop: 28 }}>
          No practice attempts yet.{" "}
          <Link
            href="/practice/math.10.quadratic-equations.discriminant"
            style={{ color: "var(--co-accent)" }}
          >
            Try a Check-it set →
          </Link>
        </p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 12 }}>
          {entries.map((entry) => {
            const topic = getTopicById(entry.topicId);
            return (
              <li
                key={entry.topicId}
                style={{
                  borderTop: "1px solid var(--co-border)",
                  paddingTop: 12,
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <div style={{ fontFamily: "var(--co-font-brand)" }}>
                    {topic?.topic ?? entry.topicId}
                  </div>
                  <div style={{ color: "var(--co-ink-muted)", fontSize: 13 }}>
                    {entry.correct}/{entry.attempts} correct
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <strong>{mastery(entry)}%</strong>
                  <Link href={`/practice/${entry.topicId}`} style={chip}>
                    Practice
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}

const chip: CSSProperties = {
  minHeight: 40,
  display: "inline-flex",
  alignItems: "center",
  padding: "0 12px",
  borderRadius: 999,
  border: "1px solid var(--co-border)",
};
