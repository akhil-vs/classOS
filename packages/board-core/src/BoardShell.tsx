"use client";

import { useKeyboardMap } from "@classos/input-kit";
import { BrandMark } from "@classos/ui";
import type { ReactNode } from "react";
import { ChipLayer } from "./ChipLayer";
import { InkCanvas } from "./InkCanvas";
import { useBoardStore } from "./store";
import type { BoardWidgetInstance } from "./types";

export function BoardShell({
  renderWidget,
  assumption,
}: {
  renderWidget?: (widget: BoardWidgetInstance) => ReactNode;
  assumption?: string;
}) {
  const tool = useBoardStore((s) => s.tool);
  const aiEnabled = useBoardStore((s) => s.aiEnabled);
  const widgets = useBoardStore((s) => s.widgets);
  const setTool = useBoardStore((s) => s.setTool);
  const setAiEnabled = useBoardStore((s) => s.setAiEnabled);
  const undo = useBoardStore((s) => s.undo);
  const insertTemplate = useBoardStore((s) => s.insertTemplate);

  useKeyboardMap({
    z: (event) => {
      if (event.metaKey || event.ctrlKey) {
        event.preventDefault();
        undo();
      }
    },
    Z: (event) => {
      if (event.metaKey || event.ctrlKey) {
        event.preventDefault();
        undo();
      }
    },
  });

  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "grid",
        gridTemplateRows: "auto 1fr auto",
        background: "var(--co-bg)",
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          padding: "12px 16px",
          borderBottom: "1px solid var(--co-border)",
          background: "rgba(15, 20, 25, 0.92)",
          backdropFilter: "blur(10px)",
          position: "sticky",
          top: 0,
          zIndex: 5,
        }}
      >
        <BrandMark compact />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Toggle
            label={`AI ${aiEnabled ? "on" : "off"}`}
            pressed={aiEnabled}
            onClick={() => setAiEnabled(!aiEnabled)}
          />
          <Toggle label="Undo" pressed={false} onClick={undo} />
        </div>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(72px, 96px) 1fr",
          minHeight: 0,
        }}
        className="board-layout"
      >
        <aside
          style={{
            borderRight: "1px solid var(--co-border)",
            padding: 10,
            display: "flex",
            flexDirection: "column",
            gap: 8,
            background: "var(--co-bg-elevated)",
          }}
        >
          <RailButton
            label="Pen"
            active={tool === "pen"}
            onClick={() => setTool("pen")}
          />
          <RailButton
            label="Select"
            active={tool === "select"}
            onClick={() => setTool("select")}
          />
          <div
            style={{
              height: 1,
              background: "var(--co-border)",
              margin: "6px 0",
            }}
          />
          <RailButton
            label="Graph"
            active={false}
            onClick={() => insertTemplate("graph")}
          />
          <RailButton
            label="Scene"
            active={false}
            onClick={() => insertTemplate("scene")}
          />
          <RailButton
            label="Molecule"
            active={false}
            onClick={() => insertTemplate("molecule")}
          />
          <RailButton
            label="Quadratic"
            active={false}
            onClick={() => insertTemplate("quadratic")}
          />
          <RailButton
            label="Balance"
            active={false}
            onClick={() => insertTemplate("balancer")}
          />
        </aside>

        <section
          style={{
            position: "relative",
            minHeight: 420,
            background: `
              linear-gradient(var(--co-board-grid) 1px, transparent 1px),
              linear-gradient(90deg, var(--co-board-grid) 1px, transparent 1px),
              var(--co-board)
            `,
            backgroundSize: "28px 28px, 28px 28px, auto",
          }}
        >
          <InkCanvas />
          <ChipLayer />
          {assumption && (
            <div
              style={{
                position: "absolute",
                left: 16,
                bottom: 16,
                padding: "8px 12px",
                borderRadius: 10,
                background: "rgba(240, 180, 41, 0.12)",
                border: "1px solid rgba(240, 180, 41, 0.35)",
                color: "var(--co-warn)",
                fontSize: 13,
                zIndex: 2,
              }}
            >
              Assumptions: {assumption}
            </div>
          )}
          <div
            style={{
              position: "absolute",
              right: 16,
              top: 16,
              display: "grid",
              gap: 12,
              width: "min(360px, calc(100% - 32px))",
              maxHeight: "calc(100% - 32px)",
              overflow: "auto",
              zIndex: 3,
            }}
          >
            {widgets.map((widget) => (
              <div
                key={widget.id}
                style={{
                  borderRadius: "var(--co-radius)",
                  border: "1px solid var(--co-border)",
                  background: "rgba(28, 37, 48, 0.94)",
                  boxShadow: "var(--co-shadow)",
                  padding: 12,
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--co-font-brand)",
                    marginBottom: 8,
                    fontSize: 15,
                  }}
                >
                  {widget.title}
                </div>
                {renderWidget?.(widget)}
              </div>
            ))}
          </div>
        </section>
      </div>

      <footer
        style={{
          borderTop: "1px solid var(--co-border)",
          padding: "10px 16px",
          color: "var(--co-ink-muted)",
          fontSize: 13,
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <span>
          {aiEnabled
            ? "AI on — chips need confirm before anything opens"
            : "Blackboard only — ink and templates, no chips"}
        </span>
        <span>
          {widgets.length} widget(s) · Ctrl/Cmd+Z undo
        </span>
      </footer>
      <style>{`
        @media (max-width: 720px) {
          .board-layout {
            grid-template-columns: 1fr !important;
            grid-template-rows: auto 1fr;
          }
          .board-layout > aside {
            flex-direction: row !important;
            overflow-x: auto;
            border-right: none !important;
            border-bottom: 1px solid var(--co-border);
          }
        }
      `}</style>
    </div>
  );
}

function RailButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        minHeight: "var(--co-hit)",
        borderRadius: 10,
        border: active
          ? "1px solid var(--co-accent)"
          : "1px solid var(--co-border)",
        background: active ? "rgba(198, 242, 109, 0.14)" : "transparent",
        color: "var(--co-ink)",
        cursor: "pointer",
        padding: "0 8px",
      }}
    >
      {label}
    </button>
  );
}

function Toggle({
  label,
  pressed,
  onClick,
}: {
  label: string;
  pressed: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      style={{
        minHeight: "var(--co-hit)",
        padding: "0 14px",
        borderRadius: 999,
        border: pressed
          ? "1px solid var(--co-accent)"
          : "1px solid var(--co-border)",
        background: pressed ? "rgba(198, 242, 109, 0.14)" : "transparent",
        color: pressed ? "var(--co-accent)" : "var(--co-ink)",
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}
