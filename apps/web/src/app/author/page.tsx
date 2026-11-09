import { evaluateShipGate, getAllTopics } from "@classos/curriculum";
import { BrandMark } from "@classos/ui";
import Link from "next/link";

export default function AuthorPage() {
  const topics = getAllTopics();
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "24px 16px" }}>
      <BrandMark />
      <h1
        style={{
          fontFamily: "var(--co-font-brand)",
          letterSpacing: "-0.03em",
        }}
      >
        Author (internal)
      </h1>
      <p style={{ color: "var(--co-ink-muted)" }}>
        Chapter manifest + ship-gate checklist. A topic may show{" "}
        <code>shipped</code> only when goldens, syllabus validation, teacher
        review, and input QA flags are complete.
      </p>
      <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 10 }}>
        {topics.map((topic) => {
          const gate = evaluateShipGate(topic);
          return (
            <li
              key={topic.id}
              style={{
                borderTop: "1px solid var(--co-border)",
                paddingTop: 10,
                fontFamily: "var(--co-font-mono)",
                fontSize: 13,
              }}
            >
              <div>{topic.id}</div>
              <div style={{ color: "var(--co-ink-muted)" }}>
                status {topic.status} · gate {gate.canShip ? "ready" : "blocked"} ·
                goldens: {topic.goldenTests.join(", ") || "none"}
              </div>
              {!gate.canShip && (
                <div style={{ color: "var(--co-warn)", marginTop: 4 }}>
                  missing: {gate.missing.join("; ")}
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <p>
        <Link href="/" style={{ color: "var(--co-accent)" }}>
          ← Home
        </Link>
      </p>
    </main>
  );
}
