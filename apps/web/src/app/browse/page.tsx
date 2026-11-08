import { buildBrowseIndex, getTopicById } from "@classos/curriculum";
import { BrandMark } from "@classos/ui";
import Link from "next/link";
import type { CSSProperties } from "react";

export default function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ class?: string; subject?: string }>;
}) {
  return <BrowseInner searchParams={searchParams} />;
}

async function BrowseInner({
  searchParams,
}: {
  searchParams: Promise<{ class?: string; subject?: string }>;
}) {
  const params = await searchParams;
  const index = buildBrowseIndex();
  const classLevel = Number(params.class ?? 10);
  const subject = (params.subject ?? "mathematics") as
    | "mathematics"
    | "physics"
    | "chemistry";

  const chapters = index.chapters.filter(
    (chapter) =>
      chapter.classLevel === classLevel && chapter.subject === subject,
  );

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: "24px 16px 48px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          alignItems: "center",
          marginBottom: 24,
          flexWrap: "wrap",
        }}
      >
        <BrandMark />
        <div style={{ display: "flex", gap: 8 }}>
          <Link href="/" style={navChip}>
            Home
          </Link>
          <Link href="/board" style={navChip}>
            Board
          </Link>
          <Link href="/progress" style={navChip}>
            Progress
          </Link>
          <Link href="/settings" style={navChip}>
            Settings
          </Link>
        </div>
      </div>

      <h1
        style={{
          fontFamily: "var(--co-font-brand)",
          fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
          margin: "0 0 8px",
          letterSpacing: "-0.03em",
        }}
      >
        Browse
      </h1>
      <p style={{ color: "var(--co-ink-muted)", marginTop: 0 }}>
        Class → subject → chapter → topic. Manifests drive the UI — no hardcoded
        chapter screens.
      </p>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        {index.classes.map((level) => (
          <Link
            key={level}
            href={`/browse?class=${level}&subject=${subject}`}
            style={level === classLevel ? activeChip : navChip}
          >
            Class {level}
          </Link>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
        {index.subjects.map((item) => (
          <Link
            key={item}
            href={`/browse?class=${classLevel}&subject=${item}`}
            style={item === subject ? activeChip : navChip}
          >
            {item}
          </Link>
        ))}
      </div>

      <div style={{ display: "grid", gap: 16 }}>
        {chapters.map((chapter) => {
          const topics = chapter.topicIds
            .map((id) => getTopicById(id))
            .filter(Boolean);
          return (
            <section
              key={chapter.id}
              style={{
                borderTop: "1px solid var(--co-border)",
                paddingTop: 16,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <h2
                  style={{
                    margin: 0,
                    fontFamily: "var(--co-font-brand)",
                    fontSize: 22,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {chapter.title}
                </h2>
                <span style={{ color: "var(--co-ink-muted)", fontSize: 13 }}>
                  phase {chapter.phase}
                  {topics.length === 0 ? " · inventory only" : ""}
                </span>
              </div>
              {topics.length > 0 ? (
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: "12px 0 0",
                    display: "grid",
                    gap: 8,
                  }}
                >
                  {topics.map((topic) =>
                    topic ? (
                      <li key={topic.id}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 12,
                            padding: "12px 0",
                            borderBottom: "1px solid rgba(214,230,212,0.08)",
                            flexWrap: "wrap",
                          }}
                        >
                          <span>{topic.topic}</span>
                          <span style={{ display: "flex", gap: 10 }}>
                            <Link
                              href={`/learn/${topic.id}`}
                              style={{ color: "var(--co-accent)" }}
                            >
                              Learn
                            </Link>
                            <Link
                              href={`/practice/${topic.id}`}
                              style={{ color: "var(--co-ink-muted)" }}
                            >
                              Practice
                            </Link>
                          </span>
                        </div>
                      </li>
                    ) : null,
                  )}
                </ul>
              ) : (
                <p style={{ color: "var(--co-ink-muted)", fontSize: 14 }}>
                  Listed in inventory — module not scaffolded yet.
                </p>
              )}
            </section>
          );
        })}
      </div>
    </main>
  );
}

const navChip: CSSProperties = {
  minHeight: 40,
  display: "inline-flex",
  alignItems: "center",
  padding: "0 12px",
  borderRadius: 999,
  border: "1px solid var(--co-border)",
  textTransform: "capitalize",
};

const activeChip: CSSProperties = {
  ...navChip,
  border: "1px solid var(--co-accent)",
  background: "rgba(198, 242, 109, 0.14)",
  color: "var(--co-accent)",
};
