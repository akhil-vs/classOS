"use client";

import type { PracticeItem, TopicModule } from "@classos/curriculum";
import { BrandMark } from "@classos/ui";
import { useEffect, useState, type CSSProperties } from "react";

export function PracticeClient({ topic }: { topic: TopicModule }) {
  const [items, setItems] = useState<PracticeItem[]>([]);
  const [index, setIndex] = useState(0);
  const [response, setResponse] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const seed = 1;

  useEffect(() => {
    void fetch(`/api/practice?topicId=${topic.id}&seed=${seed}&count=3`)
      .then((res) => res.json())
      .then((data: { items: PracticeItem[] }) => setItems(data.items));
  }, [topic.id]);

  const item = items[index];

  async function submit() {
    if (!item) return;
    const res = await fetch("/api/practice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topicId: topic.id,
        itemId: item.id,
        response,
        seed,
      }),
    });
    const data = (await res.json()) as {
      ok: boolean;
      feedback: string;
    };
    setFeedback(data.feedback);
    setScore((prev) => ({
      correct: prev.correct + (data.ok ? 1 : 0),
      total: prev.total + 1,
    }));
  }

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "20px 16px 48px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
          marginBottom: 20,
        }}
      >
        <BrandMark compact />
        <div style={{ display: "flex", gap: 8 }}>
          <a href={`/learn/${topic.id}`} style={chip}>
            Learn
          </a>
          <a href="/progress" style={chip}>
            Progress
          </a>
        </div>
      </div>

      <h1
        style={{
          fontFamily: "var(--co-font-brand)",
          letterSpacing: "-0.03em",
          margin: "0 0 8px",
          fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
        }}
      >
        Practice · {topic.topic}
      </h1>
      <p style={{ color: "var(--co-ink-muted)", marginTop: 0 }}>
        Check-it items from verified engines — answers never come from the LLM.
      </p>

      {!item ? (
        <p>Loading items…</p>
      ) : (
        <section
          style={{
            border: "1px solid var(--co-border)",
            borderRadius: 14,
            padding: 16,
            background: "var(--co-panel)",
            display: "grid",
            gap: 14,
          }}
        >
          <div style={{ color: "var(--co-ink-muted)", fontSize: 13 }}>
            Item {index + 1} of {items.length} · score {score.correct}/{score.total}
          </div>
          <div style={{ fontSize: 18, lineHeight: 1.4 }}>{item.prompt}</div>
          {item.choices ? (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {item.choices.map((choice) => (
                <button
                  key={choice}
                  type="button"
                  onClick={() => setResponse(choice)}
                  style={{
                    ...chip,
                    border:
                      response === choice
                        ? "1px solid var(--co-accent)"
                        : "1px solid var(--co-border)",
                    background:
                      response === choice
                        ? "rgba(198, 242, 109, 0.14)"
                        : "transparent",
                    cursor: "pointer",
                  }}
                >
                  {choice}
                </button>
              ))}
            </div>
          ) : (
            <input
              value={response}
              onChange={(event) => setResponse(event.target.value)}
              placeholder="Type your answer"
              aria-label="Practice answer"
              style={{
                minHeight: "var(--co-hit)",
                borderRadius: 10,
                border: "1px solid var(--co-border)",
                background: "var(--co-bg-elevated)",
                color: "var(--co-ink)",
                padding: "0 12px",
              }}
            />
          )}
          <div style={{ color: "var(--co-ink-muted)", fontSize: 13 }}>
            Hint: {item.hint}
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button type="button" onClick={() => void submit()} style={primary}>
              Check
            </button>
            <button
              type="button"
              onClick={() => {
                setIndex((value) => (value + 1) % Math.max(items.length, 1));
                setResponse("");
                setFeedback(null);
              }}
              style={chip}
            >
              Next
            </button>
          </div>
          {feedback && (
            <div
              style={{
                padding: 12,
                borderRadius: 10,
                border: "1px solid var(--co-border)",
                background: "rgba(0,0,0,0.2)",
              }}
            >
              {feedback}
            </div>
          )}
        </section>
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
  background: "transparent",
  color: "var(--co-ink)",
};

const primary: CSSProperties = {
  ...chip,
  border: "1px solid var(--co-accent)",
  background: "rgba(198, 242, 109, 0.14)",
  color: "var(--co-accent)",
  cursor: "pointer",
};
