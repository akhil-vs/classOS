"use client";

import type { TopicModule } from "@classos/curriculum";
import { LearnWorkspace } from "@classos/topic-ui";
import { useState } from "react";

export function LearnClient({ topic }: { topic: TopicModule }) {
  const [explain, setExplain] = useState<string | null>(null);

  async function handleExplain(payload: unknown) {
    const response = await fetch("/api/explain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topicId: topic.id,
        engineResult: payload,
      }),
    });
    const data = (await response.json()) as {
      prose?: string;
      error?: string;
    };
    setExplain(data.prose ?? data.error ?? "No explanation returned");
  }

  return (
    <div>
      <LearnWorkspace topic={topic} onExplain={handleExplain} />
      {explain && (
        <div
          style={{
            position: "fixed",
            left: 16,
            right: 16,
            bottom: 16,
            maxWidth: 720,
            margin: "0 auto",
            padding: 14,
            borderRadius: 14,
            border: "1px solid var(--co-border)",
            background: "rgba(28, 37, 48, 0.96)",
            boxShadow: "var(--co-shadow)",
            zIndex: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              marginBottom: 8,
            }}
          >
            <strong>Verified explain</strong>
            <button
              type="button"
              onClick={() => setExplain(null)}
              style={{
                border: "none",
                background: "transparent",
                color: "var(--co-ink-muted)",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
          <div style={{ whiteSpace: "pre-wrap", fontSize: 14, lineHeight: 1.5 }}>
            {explain}
          </div>
        </div>
      )}
    </div>
  );
}
