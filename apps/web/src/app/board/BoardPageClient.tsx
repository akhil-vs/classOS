"use client";

import { BoardShell, useBoardStore } from "@classos/board-core";
import {
  topicAssumptions,
  topicUsesUnits,
  type TopicModule,
} from "@classos/curriculum";
import { WidgetHost } from "@classos/widgets";
import { useEffect, useState } from "react";

export function BoardPageClient({ topic }: { topic?: TopicModule }) {
  const insertTemplate = useBoardStore((s) => s.insertTemplate);
  const setTopicId = useBoardStore((s) => s.setTopicId);
  const setAssumptionBanner = useBoardStore((s) => s.setAssumptionBanner);
  const clearBoard = useBoardStore((s) => s.clearBoard);
  const [explain, setExplain] = useState<string | null>(null);

  useEffect(() => {
    clearBoard();
    setTopicId(topic?.id);
    setAssumptionBanner(topicAssumptions(topic));
    if (topic?.widget) {
      insertTemplate(topic.widget);
    }
    // Insert once per topic id; avoid re-adding on store identity churn.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic?.id]);

  async function handleExplain(payload: unknown) {
    const response = await fetch("/api/explain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topicId: topic?.id,
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
    <>
      <BoardShell
        assumption={topicAssumptions(topic)}
        topicWidget={topic?.widget}
        unitsApply={topic ? topicUsesUnits(topic) : true}
        renderWidget={(widget) => (
          <WidgetHost kind={widget.kind} onExplain={handleExplain} />
        )}
      />
      {explain && (
        <div
          style={{
            position: "fixed",
            left: 16,
            right: 16,
            bottom: 64,
            maxWidth: 720,
            margin: "0 auto",
            padding: 14,
            borderRadius: 14,
            border: "1px solid var(--co-border)",
            background: "rgba(28, 37, 48, 0.96)",
            boxShadow: "var(--co-shadow)",
            zIndex: 30,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
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
          <div style={{ whiteSpace: "pre-wrap", fontSize: 14 }}>{explain}</div>
        </div>
      )}
    </>
  );
}
