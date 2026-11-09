import { curriculumHealth, getAllTopics } from "@classos/curriculum";
import { BrandMark } from "@classos/ui";
import Link from "next/link";

/** Phase 4 learner-pilot surface — personal mastery stub before classroom infra. */
export default function ProgressPage() {
  const topics = getAllTopics().filter((topic) => !topic.id.startsWith("demo."));
  const health = curriculumHealth();
  const shipped = topics.filter((topic) => topic.status === "shipped");

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
        Learner-pilot view for phones and laptops. Progress stays private on this
        device for now — cloud student sync is deferred.
      </p>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", margin: "20px 0" }}>
        <Stat label="Shipped topics" value={String(health.shippedTopics)} />
        <Stat label="In your path" value={String(topics.length)} />
        <Stat label="Ship-gate ready" value={String(health.shipGateReady)} />
      </div>
      <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 10 }}>
        {shipped.map((topic) => (
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
                Class {topic.classLevel} · {topic.chapter}
              </div>
            </div>
            <Link href={`/learn/${topic.id}`} style={{ color: "var(--co-accent)" }}>
              Continue →
            </Link>
          </li>
        ))}
      </ul>
      <p style={{ marginTop: 24 }}>
        <Link href="/" style={{ color: "var(--co-accent)" }}>
          ← Home
        </Link>
      </p>
    </main>
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
