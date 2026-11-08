import { curriculumHealth, getAllTopics } from "@classos/curriculum";
import { BrandMark } from "@classos/ui";
import Link from "next/link";
import type { CSSProperties } from "react";

export default function HomePage() {
  const topics = getAllTopics().filter((topic) => !topic.id.startsWith("demo."));
  const health = curriculumHealth();
  const continueTopic = topics[0];

  return (
    <main
      style={{
        minHeight: "100dvh",
        display: "grid",
        alignContent: "center",
        padding: "32px 20px 48px",
        gap: 28,
        maxWidth: 920,
        margin: "0 auto",
      }}
    >
      <BrandMark />
      <h1
        style={{
          margin: 0,
          fontFamily: "var(--co-font-brand)",
          fontSize: "clamp(2rem, 6vw, 3.4rem)",
          lineHeight: 1.05,
          letterSpacing: "-0.03em",
          width: "min(16ch, 100%)",
        }}
      >

        Concept before calculation.
      </h1>
      <p
        style={{
          margin: 0,
          color: "var(--co-ink-muted)",
          fontSize: 18,
          lineHeight: 1.5,
          maxWidth: 520,
        }}
      >
        Guided Learn on phones and laptops, a personal blackboard for freeform
        work, and verified engines that never invent answers.
      </p>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {continueTopic && (
          <Link href={`/learn/${continueTopic.id}`} style={primaryBtn}>
            Continue · {continueTopic.topic}
          </Link>
        )}
        <Link href="/browse" style={secondaryBtn}>
          Browse topics
        </Link>
        <Link href="/board" style={secondaryBtn}>
          Personal board
        </Link>
        <Link href="/progress" style={secondaryBtn}>
          Progress
        </Link>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 12,
          marginTop: 12,
        }}
      >
        <Stat label="Inventory units" value={String(health.inventoryUnits)} />
        <Stat
          label="Reference modules"
          value={String(health.implementedTopics)}
        />
        <Stat label="Languages" value="EN · HI" />
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        borderTop: "1px solid var(--co-border)",
        paddingTop: 12,
      }}
    >
      <div
        style={{
          fontFamily: "var(--co-font-brand)",
          fontSize: 28,
          letterSpacing: "-0.03em",
        }}
      >
        {value}
      </div>
      <div style={{ color: "var(--co-ink-muted)", fontSize: 13 }}>{label}</div>
    </div>
  );
}

const primaryBtn: CSSProperties = {
  minHeight: "var(--co-hit)",
  display: "inline-flex",
  alignItems: "center",
  padding: "0 18px",
  borderRadius: 999,
  background: "var(--co-accent)",
  color: "#142016",
  fontWeight: 600,
};

const secondaryBtn: CSSProperties = {
  minHeight: "var(--co-hit)",
  display: "inline-flex",
  alignItems: "center",
  padding: "0 18px",
  borderRadius: 999,
  border: "1px solid var(--co-border)",
};
