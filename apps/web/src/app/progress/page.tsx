import { getPilotTopics } from "@classos/curriculum";
import { BrandMark } from "@classos/ui";
import Link from "next/link";
import { AuthBar } from "../../components/AuthBar";
import { requirePageSession } from "../../lib/auth";

/** Phase 4 learner-pilot surface — LMS L0: signed-in students. */
export default async function ProgressPage() {
  const session = await requirePageSession("progress", { next: "/progress" });
  const pilot = getPilotTopics();
  const quadratic = pilot.filter((topic) => topic.subject === "mathematics");
  const reactions = pilot.filter((topic) => topic.subject === "chemistry");

  return (
    <main style={{ maxWidth: 840, margin: "0 auto", padding: "24px 16px 48px" }}>
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
          fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
        }}
      >
        Personal progress
      </h1>
      <p style={{ color: "var(--co-ink-muted)" }}>
        Signed in as {session.user.name}. Progress remains device-local for this
        pilot; cloud sync arrives under LMS L2 with school tenancy.
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
        <Link href="/browse" style={{ color: "var(--co-accent)" }}>
          Browse
        </Link>
      </p>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: 12, color: "var(--co-ink-muted)" }}>{label}</div>
      <div style={{ fontFamily: "var(--co-font-brand)", fontSize: 28 }}>{value}</div>
    </div>
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
    <section style={{ marginTop: 20, display: "grid", gap: 8 }}>
      <h2 style={{ fontFamily: "var(--co-font-brand)", fontSize: 18, margin: 0 }}>
        {title}
      </h2>
      {topics.map((topic) => (
        <Link
          key={topic.id}
          href={`/learn/${topic.id}`}
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            padding: "12px 0",
            borderTop: "1px solid var(--co-border)",
          }}
        >
          <span>{topic.topic}</span>
          <span style={{ color: "var(--co-accent)" }}>Open →</span>
        </Link>
      ))}
    </section>
  );
}
