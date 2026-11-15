"use client";

import {
  predictOptionsForTopic,
  topicAssumptions,
  topicUsesUnits,
  type TopicMode,
  type TopicModule,
} from "@classos/curriculum";
import { useKeyboardMap } from "@classos/input-kit";
import { BrandMark, ModeTabs, modeFromShortcut } from "@classos/ui";
import { WidgetHost } from "@classos/widgets";
import { useMemo, useState, type CSSProperties, type ReactNode } from "react";

export function LearnWorkspace({
  topic,
  onExplain,
}: {
  topic: TopicModule;
  onExplain?: (payload: unknown) => void;
}) {
  const [mode, setMode] = useState<TopicMode>(topic.modes[0] ?? "see");
  const [prediction, setPrediction] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  const modeCopy = useMemo(() => {
    switch (mode) {
      case "see":
        return "Clean visual — explore the idea before numbers dominate.";
      case "predict":
        return "Freeze your prediction, then reveal the verified result.";
      case "build":
        return "Change values and watch the demonstration respond.";
      case "derive":
        return "Build the governing relation from what you just saw.";
      case "solve":
        return "CBSE-style worked path from verified engine output.";
      case "check":
        return "Quick check items generated from the live widget state.";
    }
  }, [mode]);

  const predictOptions = useMemo(
    () => predictOptionsForTopic(topic),
    [topic],
  );
  const assumptions = useMemo(() => topicAssumptions(topic), [topic]);
  const usesUnits = topicUsesUnits(topic);

  useKeyboardMap({
    "1": () => maybeMode("1"),
    "2": () => maybeMode("2"),
    "3": () => maybeMode("3"),
    "4": () => maybeMode("4"),
    "5": () => maybeMode("5"),
    "6": () => maybeMode("6"),
  });

  function maybeMode(key: string) {
    const next = modeFromShortcut(key);
    if (next && topic.modes.includes(next)) setMode(next);
  }

  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "grid",
        gridTemplateRows: "auto 1fr",
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          alignItems: "center",
          padding: "12px 16px",
          borderBottom: "1px solid var(--co-border)",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "grid", gap: 4, minWidth: 0 }}>
          <BrandMark compact />
          <div
            style={{
              color: "var(--co-ink-muted)",
              fontSize: 13,
              overflowWrap: "anywhere",
            }}
          >
            Class {topic.classLevel} · {topic.chapter} · {topic.topic}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <a href="/browse" style={linkBtn}>
            Browse
          </a>
          <a href={`/board?topic=${topic.id}`} style={linkBtn}>
            Open on board
          </a>
        </div>
      </header>

      <div className="learn-layout" style={{ display: "grid", minHeight: 0 }}>
        <section
          style={{
            padding: 16,
            borderRight: "1px solid var(--co-border)",
            background: "var(--co-board)",
            minHeight: 320,
            minWidth: 0,
          }}
        >
          <ModeTabs modes={topic.modes} value={mode} onChange={setMode} />
          <p style={{ color: "var(--co-ink-muted)", margin: "12px 0 16px" }}>
            {modeCopy}
          </p>
          <WidgetHost kind={topic.widget ?? "graph"} onExplain={onExplain} />
        </section>

        <aside
          style={{
            padding: 16,
            display: "grid",
            gap: 14,
            alignContent: "start",
            minWidth: 0,
          }}
        >
          <Block title="Understanding goal">{topic.understandingGoal}</Block>
          <Block title="Assumptions">{assumptions}</Block>
          <Block title="Units">
            {usesUnits
              ? "Dimensioned quantities — use SI or classroom units on the board; mismatched dimensions warn before calculate."
              : "Dimensionless for this topic — coefficients / stoichiometric counts are not lengths or masses. The board hides the units toggle here so it cannot be confused with assumptions."}
          </Block>
          <Block title="Board response">{topic.boardResponse}</Block>
          <Block title="Input parity">
            <div>Touch: {topic.studentInput.touch.join(" · ")}</div>
            <div>
              Mouse/keyboard: {topic.studentInput.pointerKeyboard.join(" · ")}
            </div>
          </Block>

          {mode === "predict" && (
            <Block title="Predict">
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {predictOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setPrediction(option);
                      setRevealed(false);
                    }}
                    style={{
                      minHeight: "var(--co-hit)",
                      padding: "0 12px",
                      borderRadius: 999,
                      border:
                        prediction === option
                          ? "1px solid var(--co-accent)"
                          : "1px solid var(--co-border)",
                      background: "transparent",
                      color: "var(--co-ink)",
                      cursor: "pointer",
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <button
                type="button"
                disabled={!prediction}
                onClick={() => setRevealed(true)}
                style={{
                  marginTop: 10,
                  minHeight: "var(--co-hit)",
                  borderRadius: 10,
                  border: "1px solid var(--co-accent)",
                  background: "rgba(198, 242, 109, 0.12)",
                  color: "var(--co-accent)",
                  cursor: prediction ? "pointer" : "not-allowed",
                  width: "100%",
                }}
              >
                Reveal
              </button>
              {revealed && (
                <div style={{ marginTop: 8, color: "var(--co-ink-muted)" }}>
                  You predicted “{prediction}”. Compare with the live engine
                  panel — engines stay source of truth.
                </div>
              )}
            </Block>
          )}

          {topic.misconceptions[0] && (
            <Block title="Misconception card">
              <strong style={{ color: "var(--co-warn)" }}>
                {topic.misconceptions[0].error}
              </strong>
              <div style={{ marginTop: 6 }}>{topic.misconceptions[0].demo}</div>
            </Block>
          )}

          {mode === "check" && (
            <Block title="Check-it">
              Quick item from board state: adjust a control, then explain why the
              verified output changed.
            </Block>
          )}
        </aside>
      </div>

      <style>{`
        .learn-layout {
          grid-template-columns: 1.3fr 0.9fr;
        }
        @media (max-width: 900px) {
          .learn-layout {
            grid-template-columns: 1fr;
          }
          .learn-layout > section {
            border-right: none !important;
            border-bottom: 1px solid var(--co-border);
          }
        }
        @media (max-width: 360px) {
          .learn-layout section,
          .learn-layout aside {
            padding: 12px !important;
          }
        }
      `}</style>
    </div>
  );
}

function Block({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      style={{
        border: "1px solid var(--co-border)",
        borderRadius: "var(--co-radius)",
        padding: 12,
        background: "var(--co-panel)",
      }}
    >
      <div
        style={{
          fontSize: 12,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "var(--co-ink-muted)",
          marginBottom: 8,
        }}
      >
        {title}
      </div>
      <div style={{ fontSize: 14, lineHeight: 1.45 }}>{children}</div>
    </section>
  );
}

const linkBtn: CSSProperties = {
  minHeight: "var(--co-hit)",
  display: "inline-flex",
  alignItems: "center",
  padding: "0 14px",
  borderRadius: 999,
  border: "1px solid var(--co-border)",
};
