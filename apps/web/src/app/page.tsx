import { getPilotTopics } from "@classos/curriculum";
import { BrandMark } from "@classos/ui";
import Link from "next/link";
import type { CSSProperties } from "react";
import { AuthBar } from "../components/AuthBar";
import { readSessionFromCookies } from "../lib/auth";

export default async function HomePage() {
  const pilot = getPilotTopics();
  const continueTopic = pilot[0];
  const session = await readSessionFromCookies();
  const role = session?.user.role;

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
        {role === "teacher"
          ? "Open the classroom board for today’s section, or preview Learn topics."
          : role === "school_admin"
            ? "Review school session summaries, or browse the pilot curriculum."
            : "Learn and personal board on phones and laptops — Quadratic Equations and Chemical Reactions."}
      </p>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {role === "teacher" ? (
          <Link href="/class/board" style={primaryBtn}>
            Open classroom
          </Link>
        ) : role === "school_admin" ? (
          <Link href="/school" style={primaryBtn}>
            School admin
          </Link>
        ) : continueTopic ? (
          <Link href={`/learn/${continueTopic.id}`} style={primaryBtn}>
            Continue · {continueTopic.topic}
          </Link>
        ) : null}
        <Link href="/board" style={secondaryBtn}>
          Personal board
        </Link>
        <Link href="/browse" style={secondaryBtn}>
          Browse
        </Link>
        {role === "student" && (
          <Link href="/progress" style={secondaryBtn}>
            Progress
          </Link>
        )}
        {(role === "teacher" || role === "school_admin") && (
          <Link href="/school" style={secondaryBtn}>
            School
          </Link>
        )}
        {!session && (
          <Link href="/login" style={secondaryBtn}>
            Sign in
          </Link>
        )}
        <Link href="/settings" style={secondaryBtn}>
          Settings
        </Link>
      </div>

      <section style={{ display: "grid", gap: 12, marginTop: 8 }}>
        <div
          style={{
            fontSize: 12,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--co-ink-muted)",
          }}
        >
          Pilot path
        </div>
        <div style={{ display: "grid", gap: 10 }}>
          {pilot.map((topic) => (
            <Link
              key={topic.id}
              href={`/learn/${topic.id}`}
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                padding: "14px 0",
                borderTop: "1px solid var(--co-border)",
                flexWrap: "wrap",
              }}
            >
              <span>
                <strong style={{ fontWeight: 600 }}>{topic.topic}</strong>
                <span
                  style={{
                    display: "block",
                    color: "var(--co-ink-muted)",
                    fontSize: 13,
                    marginTop: 4,
                  }}
                >
                  Class {topic.classLevel} · {topic.chapter}
                </span>
              </span>
              <span style={{ color: "var(--co-accent)" }}>Learn →</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
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
