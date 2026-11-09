import { getPilotTopics } from "@classos/curriculum";
import { BrandMark } from "@classos/ui";
import Link from "next/link";

/** Phase 4 learner-pilot surface — shipped Quadratic + Reactions only. */
export default function ProgressPage() {
  const pilot = getPilotTopics();
  const quadratic = pilot.filter((topic) => topic.subject === "mathematics");
  const reactions = pilot.filter((topic) => topic.subject === "chemistry");

  return (
    <main style={{ maxWidth: 840, margin: "0 auto", padding: "24px 16px 48px" }}>
      <BrandMark />
      <h1
        style={{
          fontFamily: "var(--co-font-brand)",
          letterSpacing: "-0.03em",
          fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
        }}
      >
        Personal progress
      </h1>
      <p style={{ color: "var(--co-ink-muted)" }}>
        Learner pilot on phones and laptops. Watch recognition chip noise, unused
        templates, units vs assumptions, and offline banner behaviour before any
        classroom `/join` hardening. Progress stays on this device — cloud sync
        is deferred.
      </p>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", margin: "20px 0" }}>
        <Stat label="Pilot topics" value={String(pilot.length)} />
        <Stat label="Quadratic" value={String(quadratic.length)} />
        <Stat label="Reactions" value={String(reactions.length)} />
      </div>
      <TopicGroup title="Quadratic Equations" topics={quadratic} />
      <TopicGroup title="Chemical Reactions and Equations" topics={reactions} />
      <p style={{ marginTop: 24 }}>
        <Link href="/" style={{ color: "var(--co-accent)" }}>
          ← Home
        </Link>
        {" · "}
        <Link href="/board" style={{ color: "var(--co-accent)" }}>
          Personal board
        </Link>
      </p>
    </main>
  );
}

function TopicGroup({
  title,
  topics,
}: {
  title: string;
  topics: ReturnType<typeof getPilotTopics>;
}) {
  return (
    <section style={{ marginTop: 28 }}>
      <h2
        style={{
          fontFamily: "var(--co-font-brand)",
          fontSize: 20,
          letterSpacing: "-0.02em",
          margin: "0 0 8px",
        }}
      >
        {title}
      </h2>
      <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 10 }}>
        {topics.map((topic) => (
          <li
            key={topic.id}
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
              <div>{topic.topic}</div>
              <div style={{ color: "var(--co-ink-muted)", fontSize: 13 }}>
                Class {topic.classLevel} · shipped
              </div>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <Link href={`/learn/${topic.id}`} style={{ color: "var(--co-accent)" }}>
                Learn →
              </Link>
              <Link
                href={`/board?topic=${topic.id}`}
                style={{ color: "var(--co-ink-muted)" }}
              >
                Board
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ minWidth: 120 }}>
      <div style={{ fontFamily: "var(--co-font-brand)", fontSize: 28 }}>{value}</div>
      <div style={{ color: "var(--co-ink-muted)", fontSize: 13 }}>{label}</div>
    </div>
  );
}
